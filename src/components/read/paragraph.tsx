import { component$, type Signal } from "@builder.io/qwik";
import { type FontSizeBtnsUnion, FontSizeMap } from "../common/content-cards/content-page-card";
import { plusSvg } from "../common/media/svg";
import { WordTooltip } from "../common/tooltips/word-tooltip";

type ParagraphProps = {
  translation: string;
  ind: number;
  tooltipedParag: (string | DictWord)[];
  fontSize: FontSizeBtnsUnion;
  currentWord: Signal<DictWord | undefined>;
  strLen: number;
  showTranslation: boolean;
};

export const Paragraph = component$(
  ({
    translation,
    ind,
    tooltipedParag,
    fontSize,
    currentWord,
    strLen,
    showTranslation,
  }: ParagraphProps) => {
    const blockClass = "my-1 border border-info rounded-md p-2 relative";
    const paragNum = ind + 1;

    return (
      <div class={`grid ${showTranslation ? "lg:grid-cols-2" : ""} grid-cols-1 gap-2`}>
        <div class={`${blockClass} ${FontSizeMap[fontSize]}`}>
          <ParagNum num={paragNum} />
          {tooltipedParag.map((word, i) => (
            <WordTooltip key={i} word={word} currentWord={currentWord} />
          ))}
          <ParagPlus strLen={strLen} />
        </div>

        {!showTranslation ? null : (
          <div class={blockClass}>
            <ParagNum num={paragNum} />
            {translation}
          </div>
        )}
      </div>
    );
  }
);

export const ParagNum = component$(({ num }: { num: number }) => (
  <div class='absolute right-1 -top-1'>
    <div class='tooltip text-sm text-info' data-tip={`Параграф ${num}`}>
      {num}
    </div>
  </div>
));

export const ParagPlus = component$(({ strLen }: { strLen: number }) => (
  <div class='absolute right-1 -bottom-1'>
    <div class='tooltip text-sm' data-tip={`Прочитано ${strLen} 字`}>
      <div onClick$={() => {}} class={"rounded-full bg-neutral-focus"}>
        {plusSvg}
      </div>
    </div>
  </div>
));
