import { component$, useSignal } from "@builder.io/qwik";
import { type CommentType } from "../common/comments/comment-card";
import { Mention } from "./mention";
import { getOldMentions, markMentionsAsOld } from "~/routes/me";

type PersonalMentionsType = {
  newMentions: CommentType[];
};

export const PersonalMentions = component$(({ newMentions }: PersonalMentionsType) => {
  const showOldMentions = useSignal(newMentions.length === 0);
  const oldMentions = getOldMentions();
  const markAsOld = markMentionsAsOld();

  // console.log(oldMentions.value);
  return (
    <div class='mb-3 mt-3 w-full'>
      <div class='prose'>
        <h3>Общение</h3>
      </div>

      <div class='flex'>
        <div class='tabs'>
          <a
            class={`tab tab-bordered ${showOldMentions.value ? "" : "tab-active"}`}
            onClick$={() => {
              showOldMentions.value = false;
            }}
          >
            Новые
          </a>
          <a
            class={`tab tab-bordered ${showOldMentions.value ? "tab-active" : ""}`}
            onClick$={() => {
              showOldMentions.value = true;
            }}
          >
            Прочитанные
          </a>
        </div>
        {newMentions.length > 0 && !showOldMentions.value ? (
          <div class='tooltip tooltip-info' data-tip={"Пометить как прочитанные"}>
            <button
              class='btn btn-sm btn-primary ml-3'
              onClick$={async () => {
                await markAsOld.submit();
                location.reload();
              }}
            >
              Я прочитал
            </button>
          </div>
        ) : null}
      </div>

      {showOldMentions.value ? (
        <div class='join join-vertical border-secondary mt-2'>
          {!oldMentions.value?.length ? (
            <p>Нет комментариев</p>
          ) : (
            oldMentions.value?.map((comment, ind) => (
              <Mention comment={comment} ind={ind} key={ind} />
            ))
          )}
        </div>
      ) : (
        <div class='join join-vertical border-secondary mt-2'>
          {!newMentions.length ? (
            <p>Нет новых комментариев</p>
          ) : (
            newMentions.map((comment, ind) => <Mention comment={comment} ind={ind} key={ind} />)
          )}
        </div>
      )}
    </div>
  );
});
