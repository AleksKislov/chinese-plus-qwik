import { component$, Slot, useSignal } from "@builder.io/qwik";

export const WordTooltipShell = component$(({ isShown }: { isShown: boolean }) => {
  const isRightSide = useSignal(false);

  return (
    <div class='group relative flex'>
      <div onMouseEnter$={(ev) => (isRightSide.value = screen.width / 2 < ev.x)}>
        <Slot name='one' />
      </div>
      <div
        class={`absolute z-50 top-7 transition-all rounded bg-base-300 p-2 ${
          isRightSide.value ? "-right-5" : "-left-5"
        } ${isShown ? "scale-100" : "scale-0"}`}
      >
        <Slot name='two' />
      </div>
    </div>
  );
});
