import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { WHERE, type WhereType } from "../comments/comment-form";

export const getUrlToContent = (
  contentType: WhereType,
  contentId: string,
  isUnapproved?: boolean
): string => {
  const s = isUnapproved ? "unapproved-" : "";

  switch (contentType) {
    case WHERE.text:
      return `/read/${s}texts/${contentId}`;
    case WHERE.video:
      return `/watch/${s}videos/${contentId}`;
  }
  return "/";
};

type CardImgProps = {
  contentId: string;
  contentType: WhereType;
  picUrl: string;
  isUnapproved?: boolean;
};

export const CardImg = component$(
  ({ contentId, contentType, picUrl, isUnapproved }: CardImgProps) => {
    return (
      <figure class={`lg:w-1/3 max-h-full ${contentType === WHERE.text ? "max-h-52" : ""}`}>
        <Link href={getUrlToContent(contentType, contentId, isUnapproved)}>
          <img src={picUrl} alt='Content pic' class='w-full h-full lg:object-cover' />
        </Link>
      </figure>
    );
  }
);
