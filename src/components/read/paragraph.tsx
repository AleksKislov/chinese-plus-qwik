import { component$ } from "@builder.io/qwik";
import { type FontSizeBtnsUnion, FontSizeMap } from "../common/content-cards/content-page-card";
import { WordTooltip } from "../common/tooltips/word-tooltip";

type ParagraphProps = {
  translation: string;
  ind: number;
  tooltipedParag: (string | DictWord)[];
  fontSize: FontSizeBtnsUnion;
};

export const Paragraph = component$(
  ({ translation, ind, tooltipedParag, fontSize }: ParagraphProps) => {
    const blockClass = "my-1 border border-info rounded-md p-2";

    return (
      <div class='grid lg:grid-cols-2 grid-cols-1 gap-2'>
        <div class={`${blockClass} grid ${FontSizeMap[fontSize]}`}>
          {tooltipedParag.map((word, ind) => (
            <WordTooltip key={ind} word={word} />
          ))}
        </div>
        <div class={blockClass}>{translation}</div>
      </div>
    );
  }
);
