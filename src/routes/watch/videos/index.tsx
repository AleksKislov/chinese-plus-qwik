import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { VideoCard } from "~/components/watch/video-card";
// import { LevelFilter } from "~/components/common/ui/level-filter";
import { UnsetFiltersBtn } from "~/components/common/ui/unset-filters-btn";
import { CategoryFilter } from "~/components/common/ui/category-filter";
import { WHERE } from "~/components/common/comments/comment-form";

export type VideoCategory =
  | "misc"
  | "song"
  | "ads"
  | "cartoon"
  | "sciense"
  | "documentary"
  | "news";

// export enum VideoCategories {
//   misc = "misc",
//   song = "song",
//   ads = "ads",
//   cartoon = "cartoon",
//   sciense = "sciense",
//   documentary = "documentary",
//   news = "news",
// }

export type VideoCardInfo = {
  _id: ObjectId;
  category: VideoCategory;
  tags: string[];
  hits: number;
  title: string;
  desc: string;
  lvl: 1 | 2 | 3;
  length: number;
  userName: string;
  source: string;
  isApproved: 1 | 0 | undefined;
  user: string;
  comments_id: CommentId[];
  likes: ContentLike[];
  date: ISODate;
};

export const getInitVideos = routeLoader$((): Promise<VideoCardInfo[]> => {
  return ApiService.get(`/api/videos/infinite?skip=0&category=`, undefined, []);
});

export type LevelUnion = "0" | "1" | "2" | "3";

export default component$(() => {
  const initVideos = getInitVideos();
  const videos = useSignal<VideoCardInfo[]>(initVideos.value);
  // const levelSignal = useSignal<LevelUnion>("0");
  const categorySignal = useSignal("");
  const skip = useSignal(0);

  const getVideos = $((): Promise<VideoCardInfo[]> => {
    const cat = categorySignal.value;
    return ApiService.get(`/api/videos/infinite?skip=${skip.value}&category=${cat}`, undefined, []);
  });

  useTask$(async ({ track }) => {
    track(() => categorySignal.value);
    // track(() => levelSignal.value);
    videos.value = await getVideos();
  });

  return (
    <>
      <PageTitle txt={"Китайские видео с субтитрами"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Смотри и учись</h2>
              <p>
                Умные тройные субтитры (оригинал, пиньинь и перевод) для видео на китайском языке.
              </p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <div class='grid sm:grid-cols-4 grid-cols-2 gap-1 mb-3'>
            {/* <LevelFilter levelSignal={levelSignal} /> */}
            <CategoryFilter categorySignal={categorySignal} contentType={WHERE.video} />
            <UnsetFiltersBtn
              // levelSignal={levelSignal}
              categorySignal={categorySignal}
              skipSignal={skip}
            />
          </div>

          {videos.value.map((video, ind) => (
            <VideoCard key={ind} video={video} />
          ))}

          <div class={"flex flex-col items-center"}>
            <button
              type='button'
              class={`btn btn-sm btn-info btn-outline`}
              onClick$={async () => {
                skip.value += 10;
                videos.value = [...videos.value, ...(await getVideos())];
              }}
            >
              Еще
            </button>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});
