import { component$, useSignal } from "@builder.io/qwik";
import { UserDateDiv } from "../comments/user-with-date";
import { ContentCat } from "./content-cat";
import { ContentLen } from "./content-len";
import { ContentLvl } from "./content-lvl";
import { LikeBtn } from "./like-btn";
import { TagsLine } from "./tags-line";
import { TextDesc } from "./text-desc";
import { type WhereType } from "../comments/comment-form";

type ContentPageCardProps = {
  contentType: WhereType;
  contentId: ObjectId;
  picUrl: string;
  tags: string[];
  userId: ObjectId;
  userName: string;
  date: ISODate;
  lvl: 1 | 2 | 3;
  category: string;
  length: number;
  desc: string;
  likes: ContentLike[];
  // fontSizeSig: Signal<FontSizeBtnsUnion>;
};

export enum FontSizeBtns {
  sm = "小",
  md = "中",
  lg = "大",
}

export type FontSizeBtnsUnion = "小" | "中" | "大";

export const FontSizeMap: { [key: string]: string } = {
  小: "text-base",
  中: "text-lg",
  大: "text-2xl",
};

export const ContentPageCard = component$(
  ({
    picUrl,
    tags,
    userId,
    userName,
    date,
    lvl,
    category,
    length,
    desc,
    likes,
    contentType,
    contentId,
  }: ContentPageCardProps) => {
    const likesSignal = useSignal(likes);

    return (
      <div class='card w-full bg-neutral mb-3'>
        <figure>
          <img src={picUrl} alt='Content pic' />
        </figure>

        <div class='card-body'>
          <TagsLine tags={tags} />
          <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />
          <div>
            <span class={"font-bold"}>Благодарности: </span>
            <LikeBtn
              likes={likesSignal}
              contentType={contentType}
              contentId={contentId}
              creatorId={userId}
            />
          </div>
          <ContentLvl lvl={lvl} />
          <ContentCat txt={category} />
          <ContentLen len={length} />
          <TextDesc desc={desc} />
        </div>
      </div>
    );
  }
);
