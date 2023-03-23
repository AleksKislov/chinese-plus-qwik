import { component$, useStore } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { commentSvg } from "~/components/common/media/svg";
import { apiGetReq } from "~/misc/actions/request";
import { dateToStr } from "~/misc/helpers/tools";

type MsgType = "wish" | "bug" | "news";

type Post = {
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

export const getPosts = routeLoader$(async (ev): Promise<Post[]> => {
  const skip = 0;
  const tag = "";
  return await apiGetReq(`/api/posts/infinite?skip=${skip}&tag=${tag}`, undefined, []);
});

export default component$(() => {
  const chosenBtn = useStore<ChosenBtnStore>({
    wish: true,
    bug: false,
    news: false,
  });

  const msgTypes = {
    wish: "пожелание",
    bug: "баг",
    news: "новости",
  };

  const posts = getPosts();

  return (
    <>
      <PageTitle txt={"Гостевая и Новости Проекта"} />
      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4'>
          <div class='card w-full bg-neutral'>
            <div class='card-body'>
              <h2 class='card-title'>Чем хотите поделиться?</h2>
              <p class={"mb-2"}>
                {Object.keys(msgTypes).map((msg) => (
                  <span
                    class={`badge badge-info mr-1 cursor-pointer ${
                      chosenBtn[msg as MsgType] ? "" : "badge-outline"
                    }`}
                    onClick$={() => {
                      for (const key in chosenBtn) {
                        if (key === msg) chosenBtn[msg as MsgType] = true;
                        else chosenBtn[key as MsgType] = false;
                      }
                    }}
                  >
                    {msgTypes[msg as MsgType]}
                  </span>
                ))}
              </p>

              <div class='flex flex-wrap mb-1'>
                <div class='form-control w-1/3 md:w-1/5 pr-1'>
                  <select class='select select-bordered w-full'>
                    <option disabled selected>
                      Эмо
                    </option>
                    <option>Small Apple</option>
                    <option>Small Orange</option>
                    <option>Small Tomato</option>
                  </select>
                  <label class='label'>
                    <span class='label-text-alt'>Эмодзи</span>
                  </label>
                </div>

                <div class='form-control w-2/3 md:w-4/5 pl-1'>
                  <input
                    type='text'
                    placeholder='Заголовок сообщения'
                    class='input input-bordered w-full '
                  />
                  <label class='label'>
                    <span class='label-text-alt'>0 / 90</span>
                  </label>
                </div>
              </div>

              <div class='form-control'>
                <textarea
                  class='textarea textarea-bordered'
                  placeholder='Ваше сообщение'
                ></textarea>
                <label class='label'>
                  <span class='label-text-alt'>0 / 900</span>
                </label>
              </div>

              <div class='card-actions justify-end'>
                <button class='btn btn-info btn-sm'>Опубликовать</button>
              </div>
            </div>
          </div>
        </div>

        <div class='w-full md:w-1/2'>
          {posts.value.map((post) => (
            <div class='card w-full bg-neutral mb-3'>
              <div class='card-body'>
                <div class='flex'>
                  <div class='avatar mr-4'>
                    <div class='w-12 mask mask-squircle'>
                      <img src={`https:${post.avatar}`} />
                    </div>
                  </div>
                  <div>
                    <h2 class='card-title mb-1'>{post.title}</h2>
                    <small class={"text-accent"}>{dateToStr(post.date, false)}</small>
                    <span class='badge badge-info mr-1 badge-outline ml-2'>
                      {msgTypes[post.tag]}
                    </span>
                  </div>
                </div>
                <p class={"mt-2"} dangerouslySetInnerHTML={post.text}></p>

                <div class={"float-right"}>
                  <button class='btn btn-info btn-sm btn-outline float-right'>
                    {commentSvg}{" "}
                    {post.comments_id.length > 0 && (
                      <span class={"ml-1"}>{post.comments_id.length}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FlexRow>
    </>
  );
});

type ChosenBtnStore = {
  wish: boolean;
  bug: boolean;
  news: boolean;
};
