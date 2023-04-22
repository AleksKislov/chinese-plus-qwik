import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { TextCard } from "~/components/read/text-card";
import { type TextCardInfo } from "../texts";
import { type LevelUnion } from "~/routes/watch/videos";

export const getInitTexts = routeLoader$((): Promise<TextCardInfo[]> => {
  return ApiService.get(`/api/texts/not_approved`, undefined, []);
});

export default component$(() => {
  const initTexts = getInitTexts();
  const texts = useSignal<TextCardInfo[]>(initTexts.value);
  const levelSignal = useSignal<LevelUnion>("0");
  const categorySignal = useSignal("");
  const skip = useSignal(0);

  // console.log(texts.value[0]);
  const getTexts = $((): Promise<TextCardInfo[]> => {
    return ApiService.get(`/api/texts/not_approved?skip=${skip.value}`, undefined, []);
  });

  useTask$(async ({ track }) => {
    track(() => categorySignal.value);
    texts.value = await getTexts();
  });

  return (
    <>
      <PageTitle txt={"Тексты на проверке"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Нужно проверить</h2>
              <p>Тексты, которые ожидают проверки модератором или админом.</p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          {texts.value.map((text, ind) => (
            <TextCard key={ind} text={text} showLevel={levelSignal.value} />
          ))}

          <div class={"flex flex-col items-center mt-1"}>
            <button
              type='button'
              class={`btn btn-sm btn-info btn-outline`}
              onClick$={async () => {
                skip.value += 10;
                texts.value = [...texts.value, ...(await getTexts())];
              }}
            >
              Еще
            </button>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});
