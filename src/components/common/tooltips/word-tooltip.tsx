import { component$ } from "@builder.io/qwik";
import { Tooltip } from "./tooltip";

type WordTooltipProps = {
  word: string | DictWord;
};

export const WordTooltip = component$(({ word }: WordTooltipProps) => {
  return (
    <>
      {typeof word === "string" ? (
        <span>{word}</span>
      ) : (
        <Tooltip>
          <div q:slot='one'>{word.chinese}</div>
          <div q:slot='two' class={"w-36"}>
            {word.pinyin}
          </div>
        </Tooltip>
      )}
    </>
  );
});
