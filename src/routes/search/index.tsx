import {
  $,
  component$,
  useContext,
  useOnDocument,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeLoader$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { Alerts } from "~/components/common/alerts/alerts";
// import { useLocation } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { searchSvg } from "~/components/common/media/svg";
import { ApiService } from "~/misc/actions/request";
import { alertsContext } from "~/root";
import { getWordsForTooltips } from "~/routes/read/texts/[id]";

// export const useGetTranslation = routeAction$(
//   (params): Promise<(string | DictWord)[]> => {
//     return getWordsForTooltips(params.words);
//   },
//   zod$({
//     words: z.array(z.string()),
//   })
// );

export const segmenter = async (text: string): Promise<string[]> => {
  return ApiService.post("/api/dictionary/segmenter", { text }, undefined, []);
};

export const useLoadTranslation = routeLoader$(async (ev): Promise<(string | DictWord)[]> => {
  const q = ev.query.get("q") || "";
  return getWordsForTooltips(await getChineseWordsArr(q));
});

export const getChineseWordsArr = async (input: string): Promise<string[]> => {
  const arr = await segmenter(input);
  return arr.filter((word) => /\p{Script=Han}/u.test(word));
};

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  // const getTranslationFromDB = useGetTranslation();
  const loadTranslation = useLoadTranslation();
  const words = useSignal<(string | DictWord)[]>([]);
  const input = useSignal(loc.url.searchParams.get("q") || "");
  const alertsState = useContext(alertsContext);

  useTask$(() => {
    words.value = loadTranslation.value;
  });

  useVisibleTask$(() => {});

  const getTranslation = $(async () => {
    const chineseStr = input.value.trim();
    if (!chineseStr) return (input.value = "");

    const isChinese = /\p{Script=Han}/u.test(chineseStr);
    if (!isChinese) {
      return alertsState.push({ bg: "alert-error", text: "Введенный текст не является китайским" });
    }

    nav("/search?q=" + chineseStr);
    words.value = await getWordsForTooltips(await getChineseWordsArr(chineseStr));
  });

  useOnDocument(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Enter") getTranslation();
    })
  );

  return (
    <>
      <PageTitle txt={"Китайско-русский словарь"} />

      <FlexRow>
        <Alerts />
        <MainContent>
          <div class='prose'>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>База слов взята с БКРС</span>
              </label>
              <div class='input-group w-full'>
                <input
                  type='text'
                  placeholder='汉字…'
                  class='input input-bordered w-full'
                  value={input.value}
                  onInput$={(e) => (input.value = (e.target as HTMLInputElement)?.value || "")}
                />
                <button class='btn btn-square' onClick$={getTranslation}>
                  {searchSvg}
                </button>
              </div>
            </div>

            <div>
              {words.value.map((word) => (
                <p>{word.chinese}</p>
              ))}
            </div>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});
