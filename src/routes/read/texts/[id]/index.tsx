import { component$, useSignal, useStore } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";

import CONSTANTS from "~/misc/consts/consts";
import { ContentPageCard, FontSizeBtns } from "~/components/common/content-cards/content-page-card";
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
  CommentForm,
} from "~/components/common/comments/comment-form";
import { Alerts } from "~/components/common/alerts/alerts";
import { type CommentType } from "~/components/common/comments/comment-card";
import { getContentComments } from "~/misc/actions/get-content-comments";
import { CommentsBlock } from "~/components/common/comments/comments-block";
import { CommentsBlockTitle } from "~/components/common/comments/comments-block-title";
import { type TextCardInfo } from "..";
import { parseTextWords } from "~/misc/helpers/content/parse-text-words";
import { Paragraph } from "~/components/read/paragraph";
import { ContentPageHead } from "~/components/common/ui/content-page-head";

type TextContent = {
  origintext: string[];
  translation: string[];
  chinese_arr: string[];
};

type TextFromDB = TextCardInfo &
  TextContent & {
    pages: TextContent & { _id: ObjectId }[];
  };

type TooltipText = {
  tooltipTxt: (string | DictWord)[][];
};

export const getTextFromDB = (id: ObjectId): Promise<TextFromDB> => {
  return ApiService.get(`/api/texts/${id}`, undefined, null);
};

export const getWordsForTooltips = (wordsArr: string[]): Promise<(string | DictWord)[]> => {
  return ApiService.post("/api/dictionary/allWords", wordsArr, undefined, []);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.text, params.id);
});

export const useGetText = routeLoader$(async ({ params }): Promise<TextFromDB & TooltipText> => {
  const textFromDb = await getTextFromDB(params.id);
  // todo: chinese_arr for long texts is [],
  // if (text.pages && text.pages.length) {
  const dbWords = await getWordsForTooltips(textFromDb.chinese_arr);
  const tooltipTxt = parseTextWords(textFromDb.chinese_arr, dbWords);
  return { ...textFromDb, tooltipTxt };
});

export default component$(() => {
  const text = useGetText();
  const comments = getComments();
  const fontSizeSig = useSignal(FontSizeBtns.md);
  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
  });

  const {
    _id: textId,
    title,
    description: desc,
    tags,
    hits,
    user: userId,
    name: userName,
    date,
    level: lvl,
    pic_url: picUrl,
    categoryInd,
    likes,
    length,
    translation,
    tooltipTxt,
  } = text.value;
  // console.log(text.value);
  return (
    <>
      <ContentPageHead title={title} hits={hits} path='/read/texts' />

      <FlexRow>
        <Sidebar>
          <ContentPageCard
            desc={desc}
            length={length}
            tags={tags}
            userId={userId}
            userName={userName}
            date={date}
            lvl={lvl}
            picUrl={picUrl}
            category={CONSTANTS.textCategories[categoryInd]}
            likes={likes}
            contentType={WHERE.text}
            contentId={textId}
            fontSizeSig={fontSizeSig}
          />
        </Sidebar>

        <MainContent>
          <Alerts />

          {tooltipTxt.map((parag, i) => (
            <Paragraph
              fontSize={fontSizeSig.value}
              tooltipedParag={parag}
              translation={translation[i]}
              ind={i}
              key={i}
            />
          ))}

          <div class={"mt-2"}>
            <CommentsBlockTitle />
            <CommentForm
              contentId={textId}
              where={WHERE.text}
              path={undefined}
              commentIdToReply={commentIdToReplyStore}
              addressees={addressees}
            />
            <CommentsBlock
              comments={comments.value}
              commentIdToReply={commentIdToReplyStore}
              addressees={addressees}
            />
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});
