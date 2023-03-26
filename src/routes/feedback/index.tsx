import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { telegramSvg, vkSvg, youtubeSvg } from "~/components/common/media/svg";
import { ApiService } from "~/misc/actions/request";
import { PostForm } from "~/components/feedback/post-form";
import { PostCard } from "~/components/feedback/post-card";

export type MsgType = "wish" | "bug" | "news";
type MsgsType = "all" | "wish" | "bug" | "news";

export type Post = {
  _id: string;
  text: string;
  title: string;
  tag: MsgType;
  name: string; // user name
  avatar: string;
  user: string;
  comments_id: { _id: string }[];
  date: string;
};

export const msgTypes = {
  wish: "пожелание",
  bug: "баг",
  news: "новости",
};

export const getInitPosts = routeLoader$((): Promise<Post[]> => {
  return ApiService.get(`/api/posts/infinite?skip=0&tag=`, undefined, []);
});

export default component$(() => {
  const chosenMsgsType = useSignal<MsgsType>("all");
  const skip = useSignal(0);
  const posts = useSignal<Post[]>([]);
  const initialPosts = getInitPosts();

  useTask$(({ track }) => {
    track(() => initialPosts);
    posts.value = initialPosts.value;
  });

  const getPosts = $((): Promise<Post[]> => {
    const t = chosenMsgsType.value === "all" ? "" : chosenMsgsType.value;
    return ApiService.get(`/api/posts/infinite?skip=${skip.value}&tag=${t}`, undefined, []);
  });

  const DisplayBtns: MsgsType[] = ["all", "wish", "bug", "news"];

  return (
    <>
      <PageTitle txt={"Гостевая и Новости Проекта"} />
      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4 h-24'>
          <div class='card w-full bg-neutral h-full'>
            <div class='card-body'>
              <div class={"flex"}>
                За проектом можно следить и в соцсетях: <span class={"pl-2"}>{youtubeSvg}</span>
                <span class={"pl-2"}>{telegramSvg}</span>
                <span class={"pl-2"}>{vkSvg}</span>
              </div>
            </div>
          </div>
        </div>

        <div class='w-full md:w-1/2'>
          <div class='card w-full bg-neutral mb-3'>
            <div class='card-body'>
              <div class='btn-group'>
                {DisplayBtns?.map((btnType, ind) => (
                  <button
                    class={`btn btn-sm btn-info lowercase ${
                      chosenMsgsType.value === btnType ? "" : "btn-outline"
                    }`}
                    type='button'
                    onClick$={async () => {
                      chosenMsgsType.value = btnType;
                      skip.value = 0;
                      posts.value = await getPosts();
                    }}
                  >
                    {ind === 0 ? "Все" : msgTypes[btnType as MsgType]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4'>
          <PostForm />
        </div>

        <div class='w-full md:w-1/2'>
          {posts.value?.map((post, ind) => (
            <PostCard post={post} isPostPage={false} key={ind} />
          ))}

          <div class={"flex flex-col items-center"}>
            <button
              type='button'
              class={`btn btn-sm btn-info btn-outline`}
              onClick$={async () => {
                skip.value += 5;
                posts.value = [...posts.value, ...(await getPosts())];
              }}
            >
              Еще
            </button>
          </div>
        </div>
      </FlexRow>
    </>
  );
});
