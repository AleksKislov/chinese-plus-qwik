import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { ApiService } from "~/misc/actions/request";
import { UserMainInfo } from "~/components/me/user-main-info";

type UserInfo = {
  _id: string;
  name: string;
  avatar: string;
  role?: "moderator" | "admin";
};

export const getUserInfo = routeLoader$(async ({ params }): Promise<UserInfo> => {
  return ApiService.get("/api/profile/user/" + params.id, undefined, {
    _id: params.id,
    name: "unknown",
    avatar: "unknown",
    role: undefined,
  });
});

// api/texts/user/5f301a8f0aa547478da68c18 getTexts

export default component$(() => {
  const userInfo = getUserInfo();

  const { _id: userId, avatar, role, name } = userInfo.value;
  return (
    <>
      <PageTitle txt={"О пользователе"} />

      <FlexRow>
        <div class='w-full basis-1/2  mt-3'>
          <UserMainInfo id={userId} avatar={avatar} role={role} name={name} isPrivate={false} />
        </div>

        <div class='w-full basis-1/2'></div>
      </FlexRow>

      <FlexRow>тут будет список текстов и видео пользователя</FlexRow>
    </>
  );
});
