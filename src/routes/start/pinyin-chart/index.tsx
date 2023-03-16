import { component$, useClientEffect$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { tableMap, pinyinMap } from "~/misc/consts/pinyin";
import styles from "./table.css?inline";
import CONST_URLS from "~/misc/consts/urls";
import { PageTitle } from "~/components/common/layout/title";

export const initHiglights = () => {
  const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
  const tableHead = document.querySelector("#tableHead2") as Element;
  const tds = tbody.getElementsByTagName("td");
  const ths = tableHead.getElementsByTagName("th");

  const tdsArr = Array.from(tds);
  const thsArr = Array.from(ths);

  function higlightEvent(i: number, action: string) {
    const cols = i % 36;

    for (let index = 0; index < 22; index++) {
      const el = tdsArr[cols + index * 36];
      action === "set"
        ? el.setAttribute("class", "bg-base-300")
        : el.classList.remove("bg-base-300");
    }
    action === "set"
      ? thsArr[cols + 1].setAttribute("class", "bg-base-300")
      : thsArr[cols + 1].classList.remove("bg-base-300");
  }

  tdsArr.forEach((td, ind) => {
    td.addEventListener("mouseover", () => higlightEvent(ind, "set"));
    td.addEventListener("mouseout", () => higlightEvent(ind, "remove"));
  });
};

export const playAudioFromBtn = (sound: string) => {
  if (!sound) return;
  new Audio(`${CONST_URLS.myAudioURL}pinyin/${sound}.mp3`).play();
};

export default component$(() => {
  useStyles$(styles);

  const consonansts = Object.keys(tableMap);

  useClientEffect$(() => {
    initHiglights();
  });

  return (
    <>
      <PageTitle txt={"Таблица пиньиня с озвучкой"} />

      <div class='alert alert-info shadow-lg my-3'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            class='stroke-current flex-shrink-0 w-6 h-6'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <span>New software update available.</span>
        </div>
      </div>

      <div class='overflow-x-auto'>
        <table class='table table-compact'>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th colSpan={5}>a</th>
              <th colSpan={3}>o</th>
              <th colSpan={5}>e</th>
              <th colSpan={10}>i</th>
              <th colSpan={9}>u</th>
              <th colSpan={4}>ü</th>
            </tr>
            <tr id='tableHead2'>
              <th>&nbsp;</th>
              <th>a</th>
              <th>ai</th>
              <th>ao</th>
              <th>an</th>
              <th>ang</th>
              <th>o</th>
              <th>ong</th>
              <th>ou</th>
              <th>e</th>
              <th>ei</th>
              <th>en</th>
              <th>eng</th>
              <th>er</th>
              <th>i</th>
              <th>ia</th>
              <th>iao</th>
              <th>ie</th>
              <th>iou</th>
              <th>ian</th>
              <th>iang</th>
              <th>in</th>
              <th>ing</th>
              <th>iong</th>
              <th>u</th>
              <th>ua</th>
              <th>uo</th>
              <th>ui</th>
              <th>uai</th>
              <th>uan</th>
              <th>un</th>
              <th>uang</th>
              <th>ueng</th>
              <th>ü</th>
              <th>üe</th>
              <th>üan</th>
              <th>ün</th>
            </tr>
          </thead>
          <tbody id='pinyinTable'>
            {consonansts.map((conson, k) => (
              <tr key={k} class='hover'>
                <th scope='row'>{conson}</th>
                {tableMap[conson].map((pySound, ind) => (
                  <td key={ind}>
                    {pySound ? (
                      <div class={"dropdown dropdown-bottom"}>
                        <label tabIndex={0} class='cursor-pointer'>
                          {pySound}
                        </label>
                        <div
                          tabIndex={0}
                          class='card compact dropdown-content shadow bg-neutral rounded-box'
                        >
                          <div class='card-body'>
                            <div class='btn-group'>
                              {pySound &&
                                pinyinMap[pySound] &&
                                Object.keys(pinyinMap[pySound]).map((x, ind) => (
                                  <button
                                    class={`lowercase btn btn-sm ${
                                      pinyinMap[pySound][x] ? "btn-accent" : "btn-error"
                                    }`}
                                    key={ind}
                                    onClick$={() => {
                                      playAudioFromBtn(pinyinMap[pySound][x]);
                                    }}
                                  >
                                    {x}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Таблица пиньиня с озвучкой",
  meta: [
    {
      name: "Таблица пиньиня с озвучкой",
      content: "Таблица пиньиня, озвученная носителем китайского языка",
    },
  ],
};
