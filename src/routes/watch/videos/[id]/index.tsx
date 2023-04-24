import { component$, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { type VideoCategory } from "..";

import YTframeLoader from "youtube-iframe";
import { YoutubeService } from "~/misc/actions/youtube-service";
import CONSTANTS from "~/misc/consts/consts";
import { ContentPageCard, FontSizeBtns } from "~/components/common/content-cards/content-page-card";
import { WHERE } from "~/components/common/comments/comment-form";
import { Subs } from "~/components/watch/subs";
import { parseVideoWords } from "~/misc/helpers/content";

type VideoFromDB = {
  _id: ObjectId;
  category: VideoCategory;
  pySubs: string[];
  ruSubs: string[];
  chineseArr: string[][];
  tags: string[];
  hits: number;
  title: string;
  desc: string;
  lvl: 1 | 2 | 3;
  cnSubs: ChineseSub[];
  length: number;
  userName: string;
  source: string;
  isApproved: 1 | 0 | undefined;
  user: string;
  comments_id: CommentId[];
  likes: ContentLike[];
  date: ISODate;
};

type ChineseSub = {
  _id: ObjectId;
  start: NumString;
  dur: NumString;
  text: string;
};

type TooltipSubs = {
  tooltipSubs: DictWord[][];
};

export const getVideoFromDB = (id: string): Promise<VideoFromDB> => {
  return ApiService.get(`/api/videos/${id}`, undefined, null);
};

export const getCnSub = (wordsArr: string[][]) => {
  return ApiService.post("/api/dictionary/allWordsForVideo", wordsArr, undefined, []);
};

export const useGetVideo = routeLoader$(async ({ params }): Promise<VideoFromDB & TooltipSubs> => {
  const videoFromDb = await getVideoFromDB(params.id);
  const tooltipSubs = await getCnSub(videoFromDb.chineseArr);
  return { ...videoFromDb, tooltipSubs };
});

type YTPlayer = {
  player: {
    playerInfo?: {
      currentTime: number;
    };
  };
};

export default component$(() => {
  const video = useGetVideo();
  const YtPlayerId = "ytPlayerId";
  const fontSizeSig = useSignal(FontSizeBtns.md);
  const hideBtnsSig = useSignal<string[]>([]);
  const ytSig = useStore<YTPlayer>({ player: {} });
  const subCurrentInd = useSignal(0);
  // const isPlaying = useSignal(false)

  const {
    _id: videoId,
    title,
    source,
    date,
    // hits,
    tags,
    user: userId,
    userName,
    category,
    lvl,
    length,
    desc,
    likes,
    cnSubs,
    ruSubs,
    pySubs,
    chineseArr,
    tooltipSubs,
  } = video.value;

  const mainSub = useSignal(parseVideoWords(chineseArr, tooltipSubs));

  // setFullChineseSubs(await parseWordsForVideo(video.chineseArr));

  useVisibleTask$(() => {
    if (!ytSig.player.playerInfo) {
      YTframeLoader.load((YT) => {
        const ytPlayer = new YT.Player(YtPlayerId, { videoId: source });
        ytSig.player = noSerialize(ytPlayer);
      });
    }

    setInterval(() => {
      const curTime = ytSig.player.playerInfo?.currentTime || 0;
      const ind = cnSubs.findIndex(({ start, dur }) => {
        return +start < curTime && +start + +dur > curTime;
      });
      if (ind < 0) return;
      subCurrentInd.value = ind;
    }, 100);
  });

  return (
    <>
      <PageTitle txt={title} />
      <FlexRow>
        <Sidebar>
          <ContentPageCard
            desc={desc}
            length={length}
            tags={tags}
            userId={userId}
            userName={userName}
            date={date}
            lvl={lvl}
            picUrl={YoutubeService.getVideoPicUrl(source)}
            category={CONSTANTS.videoCategories[category]}
            likes={likes}
            contentType={WHERE.video}
            contentId={videoId}
            fontSizeSig={fontSizeSig}
          />
        </Sidebar>

        <MainContent>
          <div class='aspect-w-16 aspect-h-9 mb-3'>
            <div id={YtPlayerId}></div>
          </div>

          <Subs
            hideBtnsSig={hideBtnsSig}
            main={mainSub.value[subCurrentInd.value]}
            ru={ruSubs[subCurrentInd.value]}
            py={pySubs[subCurrentInd.value]}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});
