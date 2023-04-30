import { component$, Slot } from "@builder.io/qwik";

export const EmojiTooltipShell = component$(({ isShown }: { isShown: boolean }) => {
  return (
    <div class='group relative flex'>
      <div>
        <Slot name='one' />
      </div>
      <div
        class={`absolute z-50 top-5 -right-3 transition-all rounded bg-base-300 p-2 text-primary group-hover:scale-100 ${
          isShown ? "scale-100" : "scale-0"
        }`}
      >
        <Slot name='two' />
      </div>
    </div>
  );
});
