import { component$ } from "@builder.io/qwik";
import { type CommentType } from "../common/comments/comment-card";
import { UserDateDiv } from "../common/comments/user-with-date";
import { Link } from "@builder.io/qwik-city";
import { getContentPath } from "~/misc/helpers/content";
import { SmallAvatar } from "../common/ui/small-avatar";

type MentionType = {
  comment: CommentType;
  ind: number;
};

export const Mention = component$(({ comment, ind }: MentionType) => {
  const {
    text,
    date,
    user: { _id: userId, name: userName, newAvatar },
    destination: contentType,
    post_id: contentId,
  } = comment;
  return (
    <div class='join-item flex pb-2 hover:bg-base-200 rounded-md' key={ind}>
      <div class='avatar mt-2 mx-3'>
        <SmallAvatar newAvatar={newAvatar} userName={userName} />
      </div>
      <div class='flex flex-col'>
        <Link href={getContentPath(contentType, contentId, false)}>
          <div class='cursor-pointer'>
            <p class={"mt-2"} dangerouslySetInnerHTML={text}></p>
          </div>
        </Link>
        <div>
          <UserDateDiv userId={userId} userName={userName} date={date} ptNum={2} />
        </div>
      </div>
    </div>
  );
});
