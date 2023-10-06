import { type RequestEvent, routeLoader$ } from "@builder.io/qwik-city";
import { component$, useStore } from "@builder.io/qwik";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { TextPreprocessForm } from "~/components/content/text-preprocess-form";
import { Alerts } from "~/components/common/alerts/alerts";
import { getTextFromDB, type TextFromDB } from "~/routes/read/texts/[id]";
import { type NewTextStore } from "~/routes/(content)/create/text";
import { EditTextFields } from "~/components/content/edit-text-fields";

export type ThemePicType = {
  full: string;
  raw: string;
  regular: string;
  small: string;
  small_s3: string;
  thumb: string;
};

export type EditTextStore = NewTextStore & {
  _id: ObjectId;
  isApproved?: 0 | 1;
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

// export const usePublishText = routeAction$(async (params, ev): Promise<TextFromDB | null> => {
//   const token = getTokenFromCookie(ev.cookie);
//   if (!token) return null;
//   return ApiService.post("/api/texts/create", params, token, null);
// });

export default component$(() => {
  const textToEdit = useGetText();
  const {
    _id,
    level: lvl,
    name,
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
    pages,
  } = textToEdit.value;

  const store: EditTextStore = useStore({
    _id,
    lvl,
    name,
    title,
    source,
    picUrl,
    allwords,
    isApproved,
    description,
    categoryInd,
    translationParagraphs,
    chineseTextParagraphs,
    tags: tags.join(", "),
    length: 0,
    isLongText: Boolean(pages && pages.length),
  });

  return (
    <>
      <PageTitle txt={"Редактировать текст"} />
      <Alerts />

      <EditTextFields store={store} />

      <TextPreprocessForm store={store} userName={name} />
    </>
  );
});
