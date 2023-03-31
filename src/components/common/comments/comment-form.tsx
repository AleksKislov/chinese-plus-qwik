import { component$, useContext, $, useSignal, useTask$ } from "@builder.io/qwik";
import { globalAction$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import CONSTANTS from "~/misc/consts/consts";
import { userContext } from "~/root";
import EmojiSelect from "./emoji-select";

export const WHERE: { [key: string]: WhereType } = {
  post: "post",
  video: "video",
  text: "text",
  book: "book",
};

export type WhereType = "post" | "video" | "text" | "book";

export const useAddComment = globalAction$((params, ev): Promise<Post> => {
  const token = ev.cookie.get("token")?.value;
  console.log(token, params);
  // return ApiService.post(`/api/comments?where=${where}&id=${id}`, params.body, token, {});
});

type CommentForm = {
  contentId: string;
  where: WhereType;
  path?: string;
};

export const CommentForm = component$(({ contentId, where, path }: CommentForm) => {
  const userState = useContext(userContext);
  const addComment = useAddComment();
  const emoji = useSignal("");
  const { loggedIn, isAdmin } = userState;
  const newText = useSignal("");

  const submitPost = $(async () => {
    const text = newText.value.replace(/\n/g, "<br />");

    await addComment.submit({
      text,
      id: contentId,
      where,
      path,
      commentIdToReply: "",
      addressees: [],
    });
    // return location.reload();
  });

  useTask$(({ track }) => {
    track(() => emoji.value);
    newText.value += emoji.value;
  });

  return (
    <>
      <div class='card w-full bg-neutral'>
        <div class='card-body'>
          <div class={"flex justify-between mb-2"}>
            <h2 class='card-title pt-1'>Ваш комментарий</h2>
            <div class='card-actions'>
              <button class='btn btn-info btn-sm' disabled={!loggedIn} onClick$={submitPost}>
                Опубликовать
              </button>
            </div>
          </div>

          <div
            class={loggedIn ? "" : "tooltip tooltip-info"}
            data-tip={loggedIn ? "" : "Авторизуйтесь"}
          >
            <div class='form-control'>
              <label class={"label"}>
                <span class={"label-text-alt"}>Вы отвечаете на комментарий </span>
              </label>
              <textarea
                class='textarea textarea-bordered'
                placeholder='Ваше сообщение'
                disabled={!loggedIn}
                value={newText.value}
                onKeyUp$={(e) => {
                  newText.value = (e.target as HTMLInputElement).value;
                }}
              ></textarea>
              <div class='flex justify-between'>
                <label class='label'>
                  <span
                    class={`label-text-alt ${
                      newText.value.length > CONSTANTS.commentLength ? "text-error" : ""
                    }`}
                  >
                    {newText.value.length} / {CONSTANTS.commentLength}
                  </span>
                </label>
                <EmojiSelect emoji={emoji} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
