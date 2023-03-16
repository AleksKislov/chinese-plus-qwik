import { component$, useStore } from "@builder.io/qwik";
import { HideButtons } from "./hide-buttons";
import { type NewHskWordType } from "~/routes/hsk/3/table";
import { NewHskTableRow } from "./new-hsk-table-row";

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

export const NewHskTable = component$(({ hskWords }: { hskWords: NewHskWordType[] }) => {
  const hideStore = useStore({
    chinese: false,
    pinyin: false,
    russian: false,
  });

  return (
    <>
      <div class={"flow-root"}>
        <HideButtons hide={hideStore} />
      </div>

      <div class='overflow-x-auto'>
        <table class='table table-compact w-full overflow-hidden'>
          <tbody>
            {hskWords.map((word) => (
              <NewHskTableRow
                key={word._id}
                word={word as NewHskWordType}
                hideChinese={hideStore.chinese}
                hideRussian={hideStore.russian}
                hidePinyin={hideStore.pinyin}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
