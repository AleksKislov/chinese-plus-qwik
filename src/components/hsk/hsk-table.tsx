import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";

import { HideButtons } from "./hide-buttons";
import { OldHskTableRow } from "./old-hsk-table-row";
import type { OldHskWordType, UserOldHskWordType } from "~/routes/hsk/2/table";
import { TableOrCardsBtns } from "./table-or-cards-btns";
import { FlipCards } from "./flip-cards";
import { FlipCardsButtons } from "./flip-cards-btns";

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

type OldHskTableType = {
  hskWords: OldHskWordType[];
  userHskWords: UserOldHskWordType[];
};

export const OldHskTable = component$(({ hskWords, userHskWords }: OldHskTableType) => {
  const hideStore = useStore({
    chinese: false,
    pinyin: false,
    russian: false,
  });
  const pinyinAbove = useStore<PinyinAboveStore>({ bool: false });
  const displayCardsStore = useStore<DisplayCardsStore>({ bool: false });

  useVisibleTask$(() => {
    pinyinAbove.bool = !!+localStorage.pinyinAbove;
  });

  return (
    <>
      <div class={"flow-root"}>
        {displayCardsStore.bool ? (
          <FlipCardsButtons pinyinAbove={pinyinAbove} />
        ) : (
          <HideButtons hide={hideStore} />
        )}
        <TableOrCardsBtns displayCards={displayCardsStore} />
      </div>
      {displayCardsStore.bool ? (
        <FlipCards words={hskWords as OldHskWordType[]} pinyinAbove={pinyinAbove} />
      ) : (
        <div class='overflow-x-auto'>
          <table class='table table-compact w-full	overflow-hidden'>
            <tbody>
              {hskWords.map((word) => (
                <OldHskTableRow
                  key={word._id}
                  word={word as OldHskWordType}
                  hideChinese={hideStore.chinese}
                  hideRussian={hideStore.russian}
                  hidePinyin={hideStore.pinyin}
                  userSelected={
                    Array.isArray(userHskWords) &&
                    userHskWords.some((x) => x.word_id === (word as OldHskWordType).word_id)
                  }
                  userWordsLen={Array.isArray(userHskWords) ? userHskWords.length : 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
});
