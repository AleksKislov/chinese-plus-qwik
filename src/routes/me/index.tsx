import { component$ } from "@builder.io/qwik";
import { type RequestEvent } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = cookie.get("token");
  if (!token?.value) throw redirect(302, "/login");
};

export default component$(() => {
  return (
    <>
      <PageTitle txt={"Личный кабинет"} />

      <FlexRow>
        <MainContent>
          <div class='prose'></div>
        </MainContent>
      </FlexRow>
    </>
  );
});
