import { component$ } from "@builder.io/qwik";
import { type RequestEvent } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export default component$(() => {
  return (
    <>
      <PageTitle txt={"Поделиться новым видео"} />

      <FlexRow>
        <div class='w-full basis-1/2 mt-3 prose'>
          <p>Что вы хотели бы создать сегодня?</p>
        </div>
        <div class='w-full basis-1/2 mt-3 prose'>
          <p>Что вы хотели бы создать сегодня?</p>
        </div>
      </FlexRow>
    </>
  );
});
