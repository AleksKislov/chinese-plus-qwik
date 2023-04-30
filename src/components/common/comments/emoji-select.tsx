import { component$, useSignal, type Signal } from "@builder.io/qwik";
import CONSTANTS from "~/misc/consts/consts";
import { EmojiTooltipShell } from "../tooltips/emoji-tooltip-shell";

export const EmojiSelect = component$(({ emoji }: { emoji: Signal<string> }) => {
  const state = useSignal(false);

  return (
    <div onMouseLeave$={() => (state.value = false)}>
      <EmojiTooltipShell isShown={state.value}>
        <div onClick$={() => (state.value = true)} q:slot='one'>
          😀
        </div>
        <div q:slot='two' class={"w-36 text-center"}>
          {CONSTANTS.commentEmojis.map((emo, ind) => (
            <span class='mx-1 my-1 cursor-pointer' key={ind} onClick$={() => (emoji.value = emo)}>
              {emo}
            </span>
          ))}
        </div>
      </EmojiTooltipShell>
    </div>
  );
});
