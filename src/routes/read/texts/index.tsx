import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { type ContentLike } from "~/components/common/comments/comment-card";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { LevelFilter } from "~/components/common/ui/level-filter";
import { UnsetFiltersBtn } from "~/components/common/ui/unset-filters-btn";
import { CategoryFilter } from "~/components/common/ui/category-filter";
import { WHERE } from "~/components/common/comments/comment-form";
import { TextCard } from "~/components/read/text-card";
import { type LevelUnion } from "~/routes/watch/videos";

export type TextCardInfo = {
  _id: string;
  categoryInd: number;
  tags: string[];
  hits: number;
  title: string;
  description: string;
  level: 1 | 2 | 3;
  length: number;
  name: string; // user name
  user: string; // user id
  pic_url: string;
  isApproved: 1 | 0 | undefined;
  source: string;
  comments_id: { _id: string }[];
  audioSrc: 1 | 0 | undefined;
  likes: ContentLike[];
  date: string;
};

export const getInitTexts = routeLoader$((): Promise<TextCardInfo[]> => {
  return ApiService.get(`/api/texts/infinite`, undefined, []);
});

export default component$(() => {
  const initTexts = getInitTexts();
  const texts = useSignal<TextCardInfo[]>(initTexts.value);
  const levelSignal = useSignal<LevelUnion>("0");
  const categorySignal = useSignal("");
  const onlyWithAudio = useSignal(false);
  const skip = useSignal(0);

  // console.log(texts.value[0]);
  const getTexts = $((): Promise<TextCardInfo[]> => {
    const cat = categorySignal.value;
    const catParam = cat && `&categoryInd=${cat}`;
    const lvlParam = !+levelSignal.value ? "" : `&level=${levelSignal.value}`;
    const audioParam = onlyWithAudio.value ? "&audioSrc=1" : "";

    return ApiService.get(
      `/api/texts/infinite?skip=${skip.value}${catParam}${lvlParam}${audioParam}`,
      undefined,
      []
    );
  });

  useTask$(async ({ track }) => {
    track(() => categorySignal.value);
    texts.value = await getTexts();
  });

  return (
    <>
      <PageTitle txt={"Китайские тексты с озвучкой"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Смотри и учись</h2>
              <p>
                Умные тройные субтитры (оригинал, пиньинь и перевод) для видео на китайском языке.
              </p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <div class='grid sm:grid-cols-4 grid-cols-2 gap-1 mb-3'>
            <LevelFilter levelSignal={levelSignal} />
            <CategoryFilter categorySignal={categorySignal} contentType={WHERE.text} />
            <UnsetFiltersBtn
              levelSignal={levelSignal}
              categorySignal={categorySignal}
              skipSignal={skip}
            />
          </div>

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
