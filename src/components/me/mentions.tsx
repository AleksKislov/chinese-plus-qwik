import { component$ } from "@builder.io/qwik";
import { type CommentType } from "../common/comments/comment-card";
import { AvatarImg } from "../common/media/avatar-img";

type PersonalMentionsType = {
  newMentions: CommentType[];
};

export const PersonalMentions = component$(({ newMentions }: PersonalMentionsType) => {
  return (
    <div class='mb-3 mt-3 w-full'>
      <div class='prose'>
        <h3>Общение</h3>
      </div>

      <div class='join join-vertical border-secondary mt-2'>
        {!newMentions.length ? (
          <p>Нет уведомлений</p>
        ) : (
          [...newMentions, ...newMentions].map((comment, ind) => (
            <div class='join-item flex w-full pb-2 hover:bg-base-200 rounded-md' key={ind}>
              <div class='w-12 mask mask-squircle mr-3'>
                <AvatarImg avatarUrl={comment.avatar} />
              </div>
              <div>
                <p class={"mt-2"} dangerouslySetInnerHTML={comment.text}></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
