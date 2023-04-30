import { component$, type Signal } from "@builder.io/qwik";
import { type FontSizeBtnsUnion, FontSizeMap } from "../common/content-cards/content-page-card";
import { WordTooltip } from "../common/tooltips/word-tooltip";
import { HideBtnsEnum, HideButtons } from "../hsk/hide-buttons";

type SubsProps = {
  fontSize: FontSizeBtnsUnion;
  hideBtnsSig: Signal<string[]>;
  ru: string;
  py: string;
  main: (string | DictWord)[];
  curWordInd: number;
};
export const Subs = component$(({ hideBtnsSig, ru, py, main, fontSize, curWordInd }: SubsProps) => {
  return (
    <div>
      <div class='card card-compact w-full bg-neutral mb-3'>
        <div class='card-body items-center text-center'>
          {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
            <div class={`flex ${FontSizeMap[fontSize]}`}>
              {main.map((word, ind) => (
                <WordTooltip key={ind} word={word} hasReddened={ind <= curWordInd} />
              ))}
            </div>
          )}
          {!hideBtnsSig.value.includes(HideBtnsEnum.py) && <p class={"text-lg text-info"}>{py}</p>}
          {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && <p>{ru}</p>}
        </div>
      </div>
      <div>
        <HideButtons hideBtnsSig={hideBtnsSig} />
      </div>
    </div>
  );
});
