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
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { searchSvg } from "~/components/common/media/svg";
import { DictWordTranslation } from "~/components/common/translation/dict-word-translation";
import { ApiService } from "~/misc/actions/request";
import { alertsContext } from "~/root";
import { getWordsForTooltips } from "~/routes/read/texts/[id]";

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
  const loadTranslation = useLoadTranslation();
  const words = useSignal<(string | DictWord)[] | null>(null);
  const input = useSignal(loc.url.searchParams.get("q") || "");
  const alertsState = useContext(alertsContext);

  useTask$(() => {
    // track(() => input.value);
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
    words.value = null;
    words.value = await getWordsForTooltips(await getChineseWordsArr(chineseStr));
    nav("/search?q=" + chineseStr);
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
              {words.value && (
                <DictWordTranslation ru={words.value[0].russian} showExamples={true} />
              )}
            </div>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});