import { component$, useContext } from "@builder.io/qwik";
import { arrorUturnDown, editSvg, thumbUpSvg } from "../media/svg";
import { UserDateDiv } from "./user-with-date";
import { userContext } from "~/root";

export type Comment = {
  addressees: string[];
  _id: string;
  text: string;
  name: string; // userName
  avatar: string; // userAvatar
  user: string; // userId
  post_id: string;
  likes: string[];
  destination: string;
  date: string;
};

export const CommentCard = component$(({ comment }: { comment: Comment }) => {
  const userState = useContext(userContext);
  const { loggedIn, isAdmin } = userState;
  const { _id, date, text, name: userName, user: userId } = comment;
  const canEdit = userState._id === userId || isAdmin;

  return (
    <>
      <div class='card w-full bg-neutral mb-3'>
        <div class='text-neutral-500 absolute right-0 top-0'>
          <small class='float-right mr-2 mt-1'>{`#${_id.slice(-3)}`}</small>
        </div>
        <div class='card-body'>
          <div class='flex'>
            <div class='avatar mr-4'>
              <div class='w-12 mask mask-squircle'>
                <img src={`https:${comment.avatar}`} />
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
                <div class='tooltip tooltip-info' data-tip='Отредактировать'>
                  <button class={`btn btn-sm btn-info lowercase btn-outline`} type='button'>
                    {editSvg}
                  </button>
                </div>
              )}
              <div class='tooltip tooltip-info' data-tip={loggedIn ? "Лайк!" : "Авторизуйтесь"}>
                <button
                  class={`btn btn-sm btn-info lowercase btn-outline mx-1`}
                  type='button'
                  disabled={!loggedIn}
                >
                  {thumbUpSvg}
                </button>
              </div>
              <div class='tooltip tooltip-info' data-tip={loggedIn ? "Ответить" : "Авторизуйтесь"}>
                <button
                  class={`btn btn-sm btn-info lowercase btn-outline`}
                  type='button'
                  disabled={!loggedIn}
                >
                  {arrorUturnDown}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
