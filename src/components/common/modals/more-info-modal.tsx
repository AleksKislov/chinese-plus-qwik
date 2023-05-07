import { component$, useSignal } from "@builder.io/qwik";
import { markUpRuText } from "~/misc/helpers/translation";
import { type NewHskWordType } from "~/routes/hsk/3/table";

export const MoreInfoModal = component$(
  ({ word, modalId }: { word: NewHskWordType; modalId: string }) => {
    const { cn, py, ru } = word;
    const showExamples = useSignal(true);

    return (
      <>
        <input type='checkbox' id={modalId} class='modal-toggle' />
        <label class='modal text-left' for={modalId}>
          <label class='modal-box relative' for=''>
            <label for={modalId} class='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>

            <div class={"flex flex-row mb-2"}>
              <div class={"text-2xl mr-2"}>{cn}</div>
              <div class={"text-lg"}>{py}</div>
            </div>

            <div class='relative h-8'>
              <label class='absolute label cursor-pointer right-0'>
                {showExamples.value ? (
                  <span class='label-text mr-3'>Без примеров</span>
                ) : (
                  <span class='label-text mr-3'>С примерами</span>
                )}
                <input
                  type='checkbox'
                  class='toggle toggle-accent'
                  checked={showExamples.value}
                  onClick$={() => {
                    showExamples.value = !showExamples.value;
                  }}
                />
              </label>
            </div>
            <DictWordTranslation ru={ru} showExamples={showExamples.value} />
          </label>
        </label>
      </>
    );
  }
);

export const DictWordTranslation = component$(
  ({ ru, showExamples }: { ru: string; showExamples: boolean }) => {
    return <p dangerouslySetInnerHTML={markUpRuText(ru, showExamples)}></p>;
  }
);
