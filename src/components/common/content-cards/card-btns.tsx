import { component$, type Signal } from "@builder.io/qwik";
import { type ContentLike } from "../comments/comment-card";
import { WHERE, type WhereType } from "../comments/comment-form";
import { audioSvg } from "../media/svg";
import { BookmarkBtn } from "./bookmark-btn";
import { CommentsBtn } from "./comments-btn";
import { LikeBtn } from "./like-btn";

export const getUrlToContent = (contentType: WhereType, contentId: string): string => {
  switch (contentType) {
    case WHERE.text:
      return `/read/texts/${contentId}`;
    case WHERE.video:
      return `/watch/videos/${contentId}`;
  }
  return "/";
};

type CardBtnsProps = {
  contentId: string;
  contentType: WhereType;
  likes: Signal<ContentLike[]>;
  userId: string;
  commentIdsLen: number;
  withAudio: boolean;
};

export const CardBtns = component$(
  ({ contentId, contentType, likes, userId, commentIdsLen, withAudio }: CardBtnsProps) => {
    return (
      <div class='flex justify-end'>
        {withAudio && (
          <div class='tooltip tooltip-info' data-tip={"С аудио"}>
            <button class={`btn btn-sm btn-info ml-1`} type='button'>
              {audioSvg}
            </button>
          </div>
        )}

        <BookmarkBtn contentType={contentType} contentId={contentId} />
        <LikeBtn likes={likes} contentType={contentType} contentId={contentId} creatorId={userId} />

        <CommentsBtn
          contentId={contentId}
          contentType={contentType}
          commentIdsLen={commentIdsLen}
        />
      </div>
    );
  }
);
