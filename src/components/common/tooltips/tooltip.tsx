import { component$, Slot, useSignal } from "@builder.io/qwik";

export const Tooltip = component$(() => {
  const state = useSignal(false);
  return (
    <div
      class='group relative flex'
      onMouseLeave$={() => {
        state.value = false;
      }}
    >
      <div
        onClick$={() => {
          state.value = true;
        }}
      >
        <Slot name='one' />
      </div>
      <span
        class={`absolute top-6 transition-all rounded bg-base-300 p-2 text-primary group-hover:scale-100 ${
          state.value ? "scale-100" : "scale-0"
        }`}
      >
        <Slot name='two' />
      </span>
    </div>
  );
});
