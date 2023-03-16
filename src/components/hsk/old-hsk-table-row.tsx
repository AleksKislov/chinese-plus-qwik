import { component$, $, useSignal, useContext } from "@builder.io/qwik";
import CONST_URLS from "~/misc/consts/urls";
import CONSTANTS from "~/misc/consts/consts";
import type { OldHskWordType } from "~/routes/hsk/2/table";
import Cookies from "js-cookie";
import { apiPostReq, apiDeleteReq } from "~/misc/actions/request";
import { alertsContext } from "~/root";
import { minusSvg, plusSvg, playSvg } from "../common/media/svg";

type TableRowType = {
  word: OldHskWordType;
  hideChinese: boolean;
  hidePinyin: boolean;
  hideRussian: boolean;
  userSelected: boolean;
  userWordsLen: number;
};

export const pronounce = (id: number, lvl: number) => {
  const o: { [key: number]: number } = {
    1: id - 1,
    2: id - 151,
    3: id - 301,
    4: id - 601,
    5: id - 1201,
    6: id - 2501,
  };
  const wordId = o[lvl];
  new Audio(`${CONST_URLS.myAudioURL}hsk${lvl}/${wordId}.mp3`).play();
};

export const addUserHskWord = async (word: OldHskWordType, token: string) => {
  await apiPostReq("/api/words/", word, token);
};

export const removeUserHskWord = async (wordId: number, token: string) => {
  await apiDeleteReq("/api/words/" + wordId, token);
};

export const OldHskTableRow = component$(
  ({
    word,
    hideChinese,
    hidePinyin,
    hideRussian,
    userSelected: clickedByUser,
    userWordsLen,
  }: TableRowType) => {
    const userSelectedSignal = useSignal(clickedByUser);
    const userSelected = userSelectedSignal.value;
    const userWordsLenSignal = useSignal(userWordsLen);

    const alertsState = useContext(alertsContext);

    const { chinese: cn, pinyin: py, translation: ru, word_id: id, level: lvl } = word;

    const addOrRemoveHskWord = $(async () => {
      const token = Cookies.get("token");

      console.log(userWordsLenSignal.value);
      if (!token) {
        return alertsState.push({ bg: "alert-error", text: "Нужно войти" });
      }

      if (userSelected) {
        removeUserHskWord(word.word_id, token);
        userWordsLenSignal.value--;
        userSelectedSignal.value = !userSelected;
        return alertsState.push({ bg: "alert-info", text: "Слово удалено из вашего словарика" });
      }

      if (userWordsLenSignal.value >= CONSTANTS.users.vocabSize) {
        return alertsState.push({
          bg: "alert-error",
          text: `Лимит ${CONSTANTS.users.vocabSize} слов!`,
        });
      }

      addUserHskWord(word, token);
      userWordsLenSignal.value++;
      userSelectedSignal.value = !userSelected;
      return alertsState.push({ bg: "alert-success", text: "Слово добавлено в ваш словарик" });
    });

    return (
      <>
        <tr class={"hover"}>
          <td class={userSelected ? "bg-secondary" : ""}>{id}</td>
          {!hideChinese && (
            <td class={`prose ${userSelected ? "bg-secondary" : ""}`}>
              <h2>{cn}</h2>
            </td>
          )}
          {!hidePinyin && <td class={userSelected ? "bg-secondary" : ""}>{py}</td>}
          {!hideRussian && (
            <td class={userSelected ? "bg-secondary" : ""} style={{ maxWidth: "50%" }}>
              <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{ru}</div>
            </td>
          )}
          <td class={userSelected ? "bg-secondary" : ""}>
            <button class='btn btn-sm btn-info' onClick$={() => pronounce(id, lvl)}>
              {playSvg}
            </button>
          </td>
          <td class={userSelected ? "bg-secondary" : ""}>
            <button
              class={userSelected ? "btn btn-sm btn-warning" : "btn btn-sm btn-info"}
              onClick$={addOrRemoveHskWord}
            >
              {userSelected ? minusSvg : plusSvg}
            </button>
          </td>
        </tr>
      </>
    );
  }
);
