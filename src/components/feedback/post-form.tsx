import { component$, useStore } from "@builder.io/qwik";
import { msgTypes, type MsgType } from "~/routes/feedback";

export const PostForm = component$(() => {
  const chosenBtn = useStore<ChosenBtnStore>({
    wish: true,
    bug: false,
    news: false,
  });
  return (
    <>
      <div class='card w-full bg-neutral'>
        <div class='card-body'>
          <h2 class='card-title'>Чем хотите поделиться?</h2>
          <p class={"mb-2"}>
            {Object.keys(msgTypes)?.map((msg) => (
              <span
                class={`badge badge-info mr-1 cursor-pointer ${
                  chosenBtn[msg as MsgType] ? "" : "badge-outline"
                }`}
                onClick$={() => {
                  for (const key in chosenBtn) chosenBtn[key as MsgType] = key === msg;
                }}
              >
                {msgTypes[msg as MsgType]}
              </span>
            ))}
          </p>

          <div class='flex flex-wrap mb-1'>
            <div class='form-control w-1/3 md:w-1/5 pr-1'>
              <select class='select select-bordered w-full'>
                <option disabled selected>
                  Эмо
                </option>
                <option>Small Apple</option>
                <option>Small Orange</option>
                <option>Small Tomato</option>
              </select>
              <label class='label'>
                <span class='label-text-alt'>Эмодзи</span>
              </label>
            </div>

            <div class='form-control w-2/3 md:w-4/5 pl-1'>
              <input
                type='text'
                placeholder='Заголовок сообщения'
                class='input input-bordered w-full '
              />
              <label class='label'>
                <span class='label-text-alt'>0 / 90</span>
              </label>
            </div>
          </div>

          <div class='form-control'>
            <textarea class='textarea textarea-bordered' placeholder='Ваше сообщение'></textarea>
            <label class='label'>
              <span class='label-text-alt'>0 / 900</span>
            </label>
          </div>

          <div class='card-actions justify-end'>
            <button class='btn btn-info btn-sm'>Опубликовать</button>
          </div>
        </div>
      </div>
    </>
  );
});

type ChosenBtnStore = {
  wish: boolean;
  bug: boolean;
  news: boolean;
};
