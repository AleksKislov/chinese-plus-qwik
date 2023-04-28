import { component$, Slot, useSignal } from "@builder.io/qwik";

export const EmojiTooltipShell = component$(() => {
  const state = useSignal(false);

  return (
    <div class='group relative flex' onMouseLeave$={() => (state.value = false)}>
      <div>
        <Slot name='one' />
      </div>
      <div
        class={`absolute z-50 top-6 right-0 transition-all rounded bg-base-300 p-2 text-primary group-hover:scale-100 ${
          state.value ? "scale-100" : "scale-0"
        }`}
      >
        <Slot name='two' />
      </div>
    </div>
  );
});
