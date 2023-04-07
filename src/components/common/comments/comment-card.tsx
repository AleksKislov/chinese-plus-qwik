import { component$, type Signal, useContext } from "@builder.io/qwik";
import { arrorUturnDown, editSvg, thumbUpSvg } from "../media/svg";
import { UserDateDiv } from "./user-with-date";
import { userContext } from "~/root";
import { type Addressee, type CommentIdToReply } from "./comment-form";
import { ApiService } from "~/misc/actions/request";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { EditCommentModal } from "./edit-comment-modal";

export type Comment = {
  addressees: string[];
  _id: string;
  text: string;
  name: string; // userName
  avatar: string; // userAvatar
  user: string; // userId
  post_id: string;
  likes: ContentLike[];
  destination: string;
  date: string;
};

export type ContentLike = {
  _id: string;
  user: string; // user id
  name: string; // user name
};

type CommentCardProps = {
  comment: Comment;
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
};

export const useAddLike = globalAction$((params, ev) => {
  const token = ev.cookie.get("token")?.value;
  // console.log(token, params);

  return ApiService.put(`/api/comments/like/${params._id}`, null, token, {});
}, zod$({ _id: z.string() }));

export const CommentCard = component$(
  ({ comment, commentIdToReply, addressees }: CommentCardProps) => {
    const addDelLike = useAddLike();
    const userState = useContext(userContext);
    const { loggedIn, isAdmin } = userState;
    const { _id, date, text, name: userName, user: userId, likes } = comment;
    const ownsComment = userState._id === userId;
    const canEdit = ownsComment || isAdmin;
    const isLiked = loggedIn && likes.some((like) => like.user === userState._id);

    // console.log(comment);
    const modalId = `edit-modal-${_id}`;
    return (
      <>
        <div class='card w-full bg-neutral mb-3'>
          <div class='text-neutral-500 absolute right-0 top-0'>
            <small class='float-right mr-2 mt-1'>{`#${_id.slice(-3)}`}</small>
          </div>
          <div class='card-body'>
            <div class='flex'>
              <div
                class='tooltip tooltip-info'
                data-tip={ownsComment ? "Это вы" : "Обратиться к пользователю"}
              >
                <div
                  class='avatar mr-4 cursor-pointer'
                  onClick$={() => {
                    if (ownsComment || addressees.value.some((x) => x.id === userId)) return;
                    addressees.value = [
                      ...addressees.value,
                      {
                        id: userId,
                        name: userName,
                      },
                    ];
                  }}
                >
                  <div class='w-12 mask mask-squircle'>
                    <img src={`https:${comment.avatar}`} />
                  </div>
                </div>
              </div>
              <div>
                <p class={"mt-2"} dangerouslySetInnerHTML={text}></p>
              </div>
            </div>

            <div class={"mt-2 flex justify-between"}>
              <UserDateDiv userId={userId} userName={userName} date={date} />

              <div>
                {canEdit && (
                  <div class='tooltip tooltip-info' data-tip='Редактировать / удалить'>
                    <label for={modalId} class={`btn btn-sm btn-info lowercase btn-outline`}>
                      {editSvg}
                    </label>
                  </div>
                )}
                <div
                  class='tooltip tooltip-info'
                  data-tip={
                    likes.length > 0
                      ? likes.reduce((acc, x) => (acc += `${x.name}, `), "").slice(0, -2)
                      : "Никто не лайкал"
                  }
                >
                  <button
                    class={`btn btn-sm lowercase btn-info ${isLiked ? "" : "btn-outline"} mx-1`}
                    type='button'
                    disabled={!loggedIn || ownsComment}
                    onClick$={() => addDelLike.submit({ _id })}
                  >
                    {thumbUpSvg} {likes.length > 0 && <span>{likes.length}</span>}
                  </button>
                </div>
                {!ownsComment && (
                  <div
                    class='tooltip tooltip-info'
                    data-tip={loggedIn ? "Ответить" : "Авторизуйтесь"}
                  >
                    <button
                      class={`btn btn-sm btn-info lowercase btn-outline`}
                      type='button'
                      disabled={!loggedIn}
                      onClick$={() => {
                        commentIdToReply.commentId = _id;
                        commentIdToReply.name = userName;
                        commentIdToReply.userId = userId;
                      }}
                    >
                      {arrorUturnDown}
                    </button>
                  </div>
                )}
              </div>

              <EditCommentModal modalId={modalId} comment={comment} />
            </div>
          </div>
        </div>
      </>
    );
  }
);
