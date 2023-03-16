import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { TableCard } from "~/components/hsk/table-card";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { type OldHskWordType } from "../table";
import { apiGetReq } from "~/misc/actions/request";

export class TestWord {
  chinese: string;
  level: string;
  id: number;
  pinyin: string;
  translation: string;
  constructor({
    chinese: cn,
    level: lvl,
    word_id: id,
    pinyin: py,
    translation: ru,
  }: OldHskWordType) {
    this.chinese = cn;
    this.level = `${lvl}`;
    this.id = id;
    this.pinyin = py;
    this.translation = ru;
  }
}

// get 150 words
export const getTestWords = routeLoader$(async (ev): Promise<TestWord[]> => {
  const lvl = ev.query.get("lvl") || "1";
  const res = await apiGetReq(`/api/lexicon/all?hsk_level=${lvl}`, undefined, []);
  return res.map(({cn}: OldHskWordType) => ({
    chinese = cn;
    level = `${lvl}`;
    id = id;
    pinyin = py;
    translation = ru;
  }));
});

type QuestionStore = {
  chars: null | TestWord[];
  pinyin: null | TestWord[];
  audio: null | TestWord[];
};

export default component$(() => {
  const QUEST_NUM = 5;
  const OPTIONS_NUM = 5;

  const loc = useLocation();
  const testWords = getTestWords();

  const questionStore = useStore<QuestionStore>({ chars: null, pinyin: null, audio: null });

  useTask$(({ track }) => {
    track(() => testWords.value);
    questionStore.chars = testWords.value.slice(0, QUEST_NUM);
    questionStore.pinyin = testWords.value.slice(QUEST_NUM, QUEST_NUM * 2);
    questionStore.audio = testWords.value.slice(QUEST_NUM * 2, QUEST_NUM * 3);

    return () => {
      questionStore.chars = null;
      questionStore.pinyin = null;
      questionStore.audio = null;
    };
  });
  return (
    <>
      <PageTitle txt={"Тесты на знание HSK 2.0"} />
      <FlexRow>
        <Sidebar>
          <TableCard
            level={loc.url.searchParams.get("lvl") || "1"}
            isOldHsk={true}
            isForTests={true}
          />
        </Sidebar>

        <MainContent>
          {/* <TypingGame words={hskWords} testStarted={() => {}} level={level} /> */}
          <div class={"prose"}>
            <h4>Выберите верный перевод для иероглифов</h4>
            {testWords.value.length}
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});
