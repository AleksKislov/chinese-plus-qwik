import { component$, type Signal } from "@builder.io/qwik";
import CONSTANTS from "~/misc/consts/consts";
import { Tooltip } from "../tooltips/tooltip";

export const EmojiSelect = component$(({ emoji }: { emoji: Signal<string> }) => {
  return (
    <Tooltip>
      <div q:slot='one'>😀</div>
      <div q:slot='two' class={"w-36 text-center"}>
        {CONSTANTS.commentEmojis.map((emo, ind) => (
          <span class='mx-1 my-1 cursor-pointer' key={ind} onClick$={() => (emoji.value = emo)}>
            {emo}
          </span>
        ))}
      </div>
    </Tooltip>
  );
});
