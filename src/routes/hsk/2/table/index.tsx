import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Alerts } from "~/components/common/alerts/alerts";
import { TableCard } from "~/components/hsk/table-card";
import { Pagination } from "~/components/hsk/pagination";
import { OldHskTable } from "~/components/hsk/hsk-table";
import { ApiService } from "~/misc/actions/request";
import { PageTitle } from "~/components/common/layout/title";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";

export type OldHskWordType = {
  _id: string;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
};

export type UserOldHskWordType = {
  _id: string;
  user: string;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
};

export const getUserHsk2Words = routeLoader$(async ({ cookie }): Promise<UserOldHskWordType[]> => {
  const token = cookie.get("token")?.value || "";
  if (!token) return [];
  return await ApiService.get("/api/words", token, []);
});

export const getHskWords = routeLoader$(async (ev): Promise<OldHskWordType[]> => {
  const lvl = ev.query.get("lvl") || "1";
  const lmt = ev.query.get("pg") || "0";
  return await ApiService.get(`/api/lexicon?hsk_level=${lvl}&limit=${lmt}`, undefined, []);
});

export default component$(() => {
  const loc = useLocation();
  const hskWords = getHskWords();
  const userHskWords = getUserHsk2Words();

  return (
    <>
      <PageTitle txt={"Вся лексика для HSK 2.0"} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <TableCard
            level={loc.url.searchParams.get("lvl") || "1"}
            isOldHsk={true}
            isForTests={false}
          />
        </Sidebar>

        <MainContent>
          <Pagination
            level={loc.url.searchParams.get("lvl") || "1"}
            curPage={+loc.url.searchParams.get("pg")! || 0}
            isOldHsk={true}
          />

          <OldHskTable hskWords={hskWords?.value || []} userHskWords={userHskWords?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});
