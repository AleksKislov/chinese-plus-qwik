import { component$, useContext, useSignal } from "@builder.io/qwik";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { parseRussian } from "~/misc/helpers/translation";
import { alertsContext, userContext } from "~/root";
import { editSvg, minusSvg, moreInfoSvg, plusSvg } from "../media/svg";
import { EditWordModal } from "../modals/edit-word-modal";
import { MoreInfoModal } from "../modals/more-info-modal";
import { WordTooltipShell } from "./word-tooltip-shell";

type WordTooltipProps = {
  word: string | DictWord;
};

export const useAddUserWord = globalAction$(
  (body, ev) => {
    const token = ev.cookie.get("token")?.value || "";
    return ApiService.post("/api/userwords", body, token);
  },
  zod$({
    chinese: z.string(),
    translation: z.string(),
    pinyin: z.string(),
  })
);

export const useDelUserWord = globalAction$((w, ev) => {
  const token = ev.cookie.get("token")?.value || "";
  return ApiService.delete("/api/userwords/" + w.chinese, token);
}, zod$({ chinese: z.string() }));

export const WordTooltip = component$(({ word }: WordTooltipProps) => {
  const addUserWord = useAddUserWord();
  const delUserWord = useDelUserWord();
  const userState = useContext(userContext);
  const { loggedIn } = userState;
  const alertsState = useContext(alertsContext);
  const state = useSignal(false);
  const modalId = `more-info-modal-${typeof word !== "string" ? word._id : word}`;
  const editWordModalId = modalId + "0";
  let isUserWord = false;
  if (typeof word !== "string") {
    isUserWord = loggedIn && userState.words.some((w) => w.chinese === word.chinese);
  }

  return (
    <>
      {typeof word === "string" ? (
        <span>{word}</span>
      ) : (
        <div onMouseLeave$={() => (state.value = false)}>
          <WordTooltipShell isShown={state.value}>
            <div
              onClick$={() => (state.value = true)}
              q:slot='one'
              class={`rounded cursor-pointer hover:bg-info hover:text-info-content hover:px-1 ${
                isUserWord ? "bg-accent text-accent-content" : ""
              } ${state.value ? "bg-info text-info-content px-1" : ""}`}
            >
              {word.chinese}
            </div>
            <div q:slot='two' class={"relative w-60 flex flex-col p-2 text-left"}>
              <label
                class='btn btn-sm btn-circle absolute right-0 top-0'
                onClick$={() => (state.value = false)}
              >
                ✕
              </label>
              <div class={"flex flex-row mb-2"}>
                <div class={"text-2xl mr-2"}>{word.chinese}</div>
                <div class={"text-md text-info"}>{word.pinyin}</div>
              </div>
              <div
                class={"text-sm mb-2"}
                dangerouslySetInnerHTML={parseRussian(word.russian, false)}
              ></div>

              <div class={"flex flex-row justify-between"}>
                <div>
                  <div class='tooltip tooltip-info tooltip-bottom' data-tip={"Больше информации"}>
                    <label for={modalId} class={"btn btn-sm btn-info mr-1"}>
                      {moreInfoSvg}
                    </label>
                  </div>
                  {isUserWord ? (
                    <div
                      class='tooltip tooltip-info tooltip-bottom'
                      data-tip={"Удалить из вокабуляра"}
                    >
                      <label
                        class='btn btn-sm btn-error'
                        onClick$={() => {
                          delUserWord.submit({ chinese: word.chinese });
                          userState.words = userState.words.filter(
                            (w) => w.chinese !== word.chinese
                          );
                          alertsState.push({
                            bg: "alert-info",
                            text: "Слово удалено из вашего словарика",
                          });
                        }}
                      >
                        {minusSvg}
                      </label>
                    </div>
                  ) : (
                    <div
                      class='tooltip tooltip-info tooltip-bottom'
                      data-tip={"Добавить в вокабуляр"}
                    >
                      <button
                        class='btn btn-sm btn-info'
                        onClick$={() => {
                          if (!loggedIn) {
                            return alertsState.push({
                              bg: "alert-error",
                              text: "Авторизуйтесь, чтобы добавить слово в ваш словарик",
                            });
                          }
                          addUserWord.submit({
                            chinese: word.chinese,
                            translation: word.russian,
                            pinyin: word.pinyin,
                          });
                          userState.words = [
                            ...userState.words,
                            {
                              _id: "0",
                              date: "",
                              chinese: word.chinese,
                              translation: word.russian,
                              pinyin: word.pinyin,
                            },
                          ];
                          alertsState.push({
                            bg: "alert-success",
                            text: "Слово добавлено в ваш словарик",
                          });
                        }}
                      >
                        {plusSvg}
                      </button>
                    </div>
                  )}
                </div>

                <div class='tooltip tooltip-info tooltip-bottom' data-tip={"Редактировать"}>
                  <label
                    for={loggedIn ? editWordModalId : undefined}
                    class='btn btn-sm btn-info'
                    onClick$={() => {
                      if (loggedIn) return;

                      alertsState.push({
                        bg: "alert-error",
                        text: "Авторизуйтесь, чтобы отредактировать",
                      });
                    }}
                  >
                    {editSvg}
                  </label>
                </div>
              </div>
            </div>
          </WordTooltipShell>
        </div>
      )}

      {typeof word === "string" ? null : (
        <>
          <EditWordModal word={word} modalId={editWordModalId} />
          <MoreInfoModal
            word={{
              _id: word._id,
              cn: word.chinese,
              py: word.pinyin,
              ru: word.russian,
              lvl: "unknown",
              id: 0,
            }}
            modalId={modalId}
          />
        </>
      )}
    </>
  );
});
