import { type RequestEvent, routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import { component$, useContext, useStore } from "@builder.io/qwik";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { Alerts } from "~/components/common/alerts/alerts";
import { getTextFromDB, type TextFromDB } from "~/routes/read/texts/[id]";
import { type NewTextStore } from "~/routes/(content)/create/text";
import { EditTextFields } from "~/components/content/edit-text-fields";
import { userContext } from "~/root";
import { ApiService } from "~/misc/actions/request";
import { EditTextPreprocessForm } from "~/components/content/edit-text-preprocess-form";

export type ThemePicType = {
  full: string;
  raw: string;
  regular: string;
  small: string;
  small_s3: string;
  thumb: string;
};

export type EditTextStore = NewTextStore & {
  textId: ObjectId;
  isApproved?: 0 | 1;
  audioSrc?: 0 | 1;
  curPage: number;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export const useGetText = routeLoader$(
  async ({
    params,
    query,
  }): Promise<
    TextFromDB & { curPage: number }
    // & TooltipText
  > => {
    let curPage = 0;
    const pg = query.get("pg") || "1";
    if (+pg && +pg > 0) curPage = +pg - 1;

    const textFromDb = await getTextFromDB(params.id);
    // let chineseArr = textFromDb.chinese_arr;
    // if (textFromDb.pages && textFromDb.pages.length) {
    //   chineseArr = textFromDb.pages[curPage].chinese_arr;
    // }
    // const dbWords = await getWordsForTooltips(chineseArr);
    // const tooltipTxt = parseTextWords(chineseArr, dbWords);
    return {
      ...textFromDb,
      curPage,
      // tooltipTxt,
    };
  }
);

export const useEditText = routeAction$(async (params, ev): Promise<{ status: "done" } | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post("/api/texts/update", params, token, null);
});

export default component$(() => {
  const { isAdmin } = useContext(userContext);

  const {
    _id,
    level: lvl,
    title,
    description,
    tags,
    source,
    categoryInd,
    pic_url: picUrl,
    translation: translationParagraphs,
    chinese_arr: allwords,
    isApproved,
    origintext: chineseTextParagraphs,
    audioSrc,
    // for long texts
    pages,
    curPage,
  } = useGetText().value;

  const isLongText = Boolean(pages && pages.length);
  const store: EditTextStore = useStore({
    textId: _id,
    lvl,
    title,
    source,
    picUrl,
    allwords,
    isApproved,
    description,
    categoryInd,
    translationParagraphs: isLongText ? pages[curPage].translation : translationParagraphs,
    chineseTextParagraphs: isLongText ? pages[curPage].origintext : chineseTextParagraphs,
    tags: tags.join(", "),
    length: 0,
    isLongText,
    audioSrc,
    curPage,
  });

  return (
    <>
      <PageTitle txt={"Редактировать текст"} />
      <Alerts />

      <EditTextFields store={store} isAdmin={isAdmin} />

      <EditTextPreprocessForm store={store} />
    </>
  );
});
