import { component$, useSignal } from "@builder.io/qwik";
import CONST_URLS from "~/misc/consts/urls";
import { type NewHskWordType } from "~/routes/hsk/3/table";
import { parseRussian, markUpRuText } from "~/misc/helpers/translation";
import { moreInfoSvg, playSvg } from "../common/media/svg";

type NewHskTableRowType = {
  word: NewHskWordType;
  hideChinese: boolean;
  hidePinyin: boolean;
  hideRussian: boolean;
};

export const pronounce = (id: number, lvl: string) => {
  new Audio(`${CONST_URLS.myAudioURL}newhsk/band${lvl}/${id}.mp3`).play();
};

export const NewHskTableRow = component$(
  ({ word, hideChinese, hidePinyin, hideRussian }: NewHskTableRowType) => {
    const { cn, py, ru, id, lvl } = word;

    const modalId = `more-info-modal-${lvl}-${id}`;
    return (
      <>
        <tr class={"hover"}>
          <td>{id}</td>
          {!hideChinese && (
            <td class={"prose"}>
              <h2>{cn}</h2>
            </td>
          )}
          {!hidePinyin && (
            <td class={"text-lg"}>
              <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{py}</div>
            </td>
          )}
          {!hideRussian && (
            <td>
              <div
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                dangerouslySetInnerHTML={parseRussian(ru, false)}
              ></div>
            </td>
          )}
          <td>
            <button class='btn btn-sm btn-info' onClick$={() => pronounce(id, lvl)}>
              {playSvg}
            </button>
          </td>
          <td>
            <label for={modalId} class={"btn btn-sm btn-info"}>
              {moreInfoSvg}
            </label>
          </td>
        </tr>

        <MoreInfoModal word={word} modalId={modalId} />
      </>
    );
  }
);

export const MoreInfoModal = component$(
  ({ word, modalId }: { word: NewHskWordType; modalId: string }) => {
    const { cn, py, ru } = word;
    const showExamples = useSignal(true);

    return (
      <>
        <input type='checkbox' id={modalId} class='modal-toggle' />
        <label for={modalId} class='modal cursor-pointer'>
          <div class='modal-box relative'>
            <label for={modalId} class='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>

            <h2 class='text-lg font-bold'>
              {cn} | {py}
            </h2>

            <div class='relative h-8'>
              <label class='absolute label cursor-pointer w-60 right-0'>
                <span class='label-text'>С примерами или без</span>
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
            <RuTranslation ru={ru} showExamples={showExamples.value} />
          </div>
        </label>
      </>
    );
  }
);

export const RuTranslation = component$(
  ({ ru, showExamples }: { ru: string; showExamples: boolean }) => {
    return <p dangerouslySetInnerHTML={markUpRuText(ru, showExamples)}></p>;
  }
);
