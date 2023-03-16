import { component$ } from "@builder.io/qwik";

type HideBtnStore = {
  hide: {
    chinese: boolean;
    russian: boolean;
    pinyin: boolean;
  };
};

export const HideButtons = component$(({ hide }: HideBtnStore) => {
  const btns = [
    {
      txt: "Иероглифы",
      flag: hide.chinese,
    },
    {
      txt: "Пиньинь",
      flag: hide.pinyin,
    },
    {
      txt: "Перевод",
      flag: hide.russian,
    },
  ];

  return (
    <div class={"float-left mb-2"}>
      <div>Скрыть</div>
      <div class='btn-group'>
        {btns.map(({ txt, flag }, ind) => (
          <button
            key={txt}
            class={`btn btn-sm btn-outline btn-info ${flag ? "btn-active" : ""}`}
            onClick$={() => {
              if (ind === 0) hide.chinese = !flag;
              if (ind === 1) hide.pinyin = !flag;
              if (ind === 2) hide.russian = !flag;
            }}
          >
            {txt}
          </button>
        ))}
      </div>
    </div>
  );
});
