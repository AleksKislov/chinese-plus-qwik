import { component$, useContext } from "@builder.io/qwik";
import { routeLoader$, type RequestEvent } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { academicCapBigSvg, archiveBigSvg, bookBigSvg } from "~/components/common/media/svg";
import { ReadResultCard } from "~/components/private/read-result-card";
import { ApiService } from "~/misc/actions/request";
import CONSTANTS from "~/misc/consts/consts";
import { userContext } from "~/root";
import { type TextsNumInfo } from "../read/texts";
import { type ReadStatType, ReadingDiagram } from "~/components/me/reading-diagram";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = cookie.get("token");
  if (!token?.value) throw redirect(302, "/login");
};

export const getTextsStats = routeLoader$((): Promise<TextsNumInfo> => {
  return ApiService.get(`/api/texts/texts_num`, undefined, {});
});

export const getReadStats = routeLoader$(async ({ cookie }): Promise<ReadStatType[]> => {
  const token = cookie.get("token")?.value || "";
  if (!token) return [];
  return ApiService.get(`/api/users/reading_results`, token, []);

  // return [
  //   {
  //     // user_id: "5f301a8f0aa5c18",
  //     have_read: 371,
  //     daily_goal: 400,
  //     createdAt: "2023-08-22T23:27:13.504Z",
  //   },
  // ];
});

export default component$(() => {
  const textsStats = getTextsStats();
  const readStats = getReadStats();
  const {
    avatar,
    name,
    isAdmin,
    isModerator,
    finishedTexts,
    readDailyGoal,
    readTodayNum,
    newMentions,
  } = useContext(userContext);

  console.log(newMentions);
  const getRole = (): { name: string; desc: string } => {
    if (isAdmin) return { name: "админ", desc: "full power" };
    if (isModerator) return { name: "модератор", desc: "редактирует тексты" };
    return { name: "изучающий", desc: "редактировать свои тексты до публикации" };
  };

  const role = getRole();

  return (
    <>
      <PageTitle txt={"Личный кабинет"} />

      <FlexRow>
        <div class='w-full basis-1/2  mt-3'>
          <div class='flex'>
            <div
              class='tooltip tooltip-info tooltip-bottom h-24 w-24 mr-4'
              data-tip='Сменить аватар'
            >
              <div class='avatar'>
                <div class='w-24 mask mask-squircle'>
                  <img src={`https:${avatar}`} width='280' height='280' />
                </div>
              </div>
            </div>
            <div>
              <div class='prose mt-3'>
                <p>
                  Nihao, <span class='badge badge-lg badge-primary'>{name}</span>
                </p>
                <p>
                  Роль:{" "}
                  <span class='tooltip tooltip-info tooltip-bottom' data-tip={role.desc}>
                    <span class='badge badge-lg badge-secondary'>{role.name}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class='card'>
            <div class='stats shadow'>
              <div class='stat'>
                <div class='stat-figure text-secondary'>{academicCapBigSvg}</div>
                <div class='stat-title'>Выбрано слов HSK</div>
                <div class='stat-value'>90 / {CONSTANTS.users.vocabSize}</div>
                <div class='stat-desc'>HSK 2.0</div>
              </div>

              <div class='stat'>
                <div class='stat-figure text-secondary'>{archiveBigSvg}</div>
                <div class='stat-title'>Выбрано лексики</div>
                <div class='stat-value'>120 / {CONSTANTS.users.vocabSize}</div>
                <div class='stat-desc'>из словаря или текстов</div>
              </div>

              <div class='stat'>
                <div class='stat-figure text-secondary'>{bookBigSvg}</div>
                <div class='stat-title'>Прочитано текстов</div>
                <div class='stat-value'>
                  {finishedTexts.length} / {textsStats.value.approved}
                </div>
                <div class='stat-desc'>в Читалке</div>
              </div>
            </div>
          </div>
        </div>

        <div class='w-full basis-1/2'>
          <ReadResultCard />
        </div>
      </FlexRow>

      <FlexRow>
        <div class='w-full h-80'>
          <ReadingDiagram
            data={readStats.value}
            readDailyGoal={readDailyGoal}
            readTodayNum={readTodayNum}
          />
        </div>
      </FlexRow>

      <FlexRow></FlexRow>
    </>
  );
});
