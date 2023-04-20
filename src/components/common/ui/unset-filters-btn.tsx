import { component$, type Signal } from "@builder.io/qwik";

type UnsetFiltersBtnProps = {
  levelSignal: Signal<string>;
  categorySignal: Signal<string>;
  skipSignal: Signal<number>;
};

export const UnsetFiltersBtn = component$(
  ({ levelSignal, categorySignal, skipSignal }: UnsetFiltersBtnProps) => {
    return (
      <button
        class={`btn btn-sm btn-outline btn-info h-full`}
        type='button'
        onClick$={() => {
          levelSignal.value = "0";
          categorySignal.value = "";
          skipSignal.value = 0;
        }}
      >
        Сброс фильтра
      </button>
    );
  }
);
