import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
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
import { HideButtons } from "~/components/hsk/hide-buttons";

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

export const useGetVideo = routeLoader$(({ params }): Promise<VideoFromDB> => {
  return ApiService.get(`/api/videos/${params.id}`, undefined, null);
});

export default component$(() => {
  const video = useGetVideo();
  const YtPlayer = "ytPlayer";
  const fontSizeSig = useSignal(FontSizeBtns.md);
  const hideBtnsSig = useSignal<string[]>([]);

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
  } = video.value;

  useVisibleTask$(() => {
    YTframeLoader.load((YT) => new YT.Player(YtPlayer, { videoId: source }));
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
            <div id={YtPlayer}></div>
          </div>

          <div class='card w-full bg-neutral mb-3'>
            <div class='card-body'>сабы</div>
          </div>

          <HideButtons hideBtnsSig={hideBtnsSig} />
        </MainContent>
      </FlexRow>
    </>
  );
});
