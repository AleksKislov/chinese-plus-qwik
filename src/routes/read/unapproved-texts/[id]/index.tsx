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
import { parseTextWords, countZnChars } from "~/misc/helpers/content";
import { Paragraph } from "~/components/read/paragraph";
import { ContentPageHead } from "~/components/common/ui/content-page-head";
import { MoreInfoModal } from "~/components/common/modals/more-info-modal";
import { EditWordModal } from "~/components/common/modals/edit-word-modal";
import { editWordModalId, moreInfoModalId } from "~/components/common/tooltips/word-tooltip";
import { FontSizeBtnGroup } from "~/components/common/content-cards/font-size-btns";
import { getWordsForTooltips, type TextFromDB, type TooltipText } from "../../texts/[id]";

export const getTextFromDB = (id: ObjectId): Promise<TextFromDB> => {
  return ApiService.get(`/api/texts/${id}`, undefined, null);
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
    origintext,
    source,
  } = text.value;

  const currentWord = useSignal<DictWord | undefined>(undefined);
  const showTranslation = useSignal(true);

  return (
    <>
      <ContentPageHead title={title} hits={hits} path='/read/unapproved-texts' />

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
            textSource={source}
          />
        </Sidebar>

        <MainContent>
          <Alerts />

          <div class={"flex justify-between w-full"}>
            <div class={"pt-1"}>
              <FontSizeBtnGroup fontSizeSig={fontSizeSig} />
            </div>
            <div class={""}>
              <label class='label cursor-pointer'>
                <span class='label-text mr-3 font-bold'>
                  {showTranslation.value ? "Без перевода" : "С переводом"}
                </span>

                <input
                  type='checkbox'
                  class='toggle toggle-accent'
                  checked={!showTranslation.value}
                  onClick$={() => (showTranslation.value = !showTranslation.value)}
                />
              </label>
            </div>
          </div>

          {tooltipTxt.map((parag, i) => (
            <Paragraph
              key={i}
              fontSize={fontSizeSig.value}
              tooltipedParag={parag}
              translation={translation[i]}
              strLen={countZnChars(origintext[i])}
              ind={i}
              currentWord={currentWord}
              showTranslation={showTranslation.value}
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

          {!currentWord.value ? null : (
            <>
              <EditWordModal word={currentWord.value} modalId={editWordModalId} />
              <MoreInfoModal
                word={{
                  _id: currentWord.value._id,
                  cn: currentWord.value.chinese,
                  py: currentWord.value.pinyin,
                  ru: currentWord.value.russian,
                  lvl: "unknown",
                  id: 0,
                }}
                modalId={moreInfoModalId}
              />
            </>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});
