import { component$ } from "@builder.io/qwik";
import { AvatarImg } from "../common/media/avatar-img";
import { type CommentType } from "../common/comments/comment-card";
import { UserDateDiv } from "../common/comments/user-with-date";
import { Link } from "@builder.io/qwik-city";
import { getContentPath } from "~/misc/helpers/content";

type MentionType = {
  comment: CommentType;
  ind: number;
};

export const Mention = component$(({ comment, ind }: MentionType) => {
  const {
    text,
    avatar,
    date,
    user: userId,
    name: userName,
    destination: contentType,
    post_id: contentId,
  } = comment;
  return (
    // to={`/${comment.destination}s/${comment.path || comment.post_id}`}
    <div class='join-item flex w-full pb-2 hover:bg-base-200 rounded-md' key={ind}>
      <div class='w-12 mask mask-squircle mx-3'>
        <AvatarImg avatarUrl={avatar} />
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
