import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { WHERE, type WhereType } from "../comments/comment-form";

export const getUrlToContent = (contentType: WhereType, contentId: string): string => {
  switch (contentType) {
    case WHERE.text:
      return `/read/texts/${contentId}`;
    case WHERE.video:
      return `/watch/videos/${contentId}`;
  }
  return "/";
};

type CardImgProps = { contentId: string; contentType: WhereType; picUrl: string };

export const CardImg = component$(({ contentId, contentType, picUrl }: CardImgProps) => {
  return (
    <figure class={`lg:w-1/3 max-h-full ${contentType === WHERE.text ? "max-h-52" : ""}`}>
      <Link href={getUrlToContent(contentType, contentId)}>
        <img src={picUrl} alt='Text pic' class='w-full h-full lg:object-cover' />
      </Link>
    </figure>
  );
});
