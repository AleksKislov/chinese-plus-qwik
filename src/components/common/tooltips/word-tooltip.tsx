import { component$, type Signal, useContext, useSignal } from "@builder.io/qwik";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { parseRussian } from "~/misc/helpers/translation";
import { alertsContext, userContext } from "~/root";
import { editSvg, minusSvg, moreInfoSvg, plusSvg } from "../media/svg";

export const editWordModalId = "editWordModalId";
export const moreInfoModalId = "moreInfoModalId";

type WordTooltipProps = {
  word: string | DictWord;
  hasReddened?: boolean; // only for video subs
  currentWord: Signal<DictWord | undefined>;
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

export const WordTooltip = component$(({ word, hasReddened, currentWord }: WordTooltipProps) => {
  const addUserWord = useAddUserWord();
  const delUserWord = useDelUserWord();
  const isRightSide = useSignal(false);
  const userState = useContext(userContext);
  const { loggedIn } = userState;
  const alertsState = useContext(alertsContext);
  const showTooltip = useSignal(false);
  let isUserWord = false;
  if (typeof word !== "string") {
    isUserWord = loggedIn && userState.words.some((w) => w.chinese === word.chinese);
  }

  // useOnDocument(
  //   "click",
  //   $((ev) => {
  //     // const { x, y } = event as MouseEvent;
  //     console.log((ev as MouseEvent).target.id);
  //   })
  // );

  return (
    <div class={`dropdown dropdown-bottom ${isRightSide.value ? "dropdown-end" : ""}`}>
      <label
        onMouseEnter$={(ev) => (isRightSide.value = screen.width / 2 < ev.x)}
        tabIndex={0}
        onClick$={() => {
          currentWord.value = word as DictWord;
          showTooltip.value = true;
        }}
        class={`rounded cursor-pointer hover:bg-info hover:text-info-content ${
          isUserWord ? "bg-accent text-accent-content" : ""
        } ${hasReddened ? "text-error" : ""}`}
      >
        {typeof word !== "string" ? word.chinese : word}
      </label>
      {typeof word !== "string" && (
        <div
          tabIndex={0}
          class={`rounded-box dropdown-content card card-compact bg-base-300 w-64 p-1 shadow ${
            showTooltip.value ? "" : "hidden"
          } ${isRightSide.value ? "-right-5" : "-left-5"}`}
        >
          <div class='card-body text-left'>
            <label
              class='btn btn-sm btn-circle absolute right-1 top-1'
              onClick$={() => (showTooltip.value = false)}
            >
              ✕
            </label>
            <div class={"flex flex-row mb-2"}>
              <div class={"text-2xl mr-2"}>{word.chinese}</div>
              <div class={"text-lg text-info"}>{word.pinyin}</div>
            </div>
            <div
              class={"text-sm mb-2"}
              dangerouslySetInnerHTML={parseRussian(word.russian, false)}
            ></div>

            <div class={"flex flex-row justify-between"}>
              <div>
                <div class='tooltip tooltip-info tooltip-bottom' data-tip={"Больше информации"}>
                  <label for={moreInfoModalId} class={"btn btn-sm btn-info mr-1"}>
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
                        userState.words = userState.words.filter((w) => w.chinese !== word.chinese);
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
        </div>
      )}
    </div>
  );
});
