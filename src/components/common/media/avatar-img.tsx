import { component$ } from "@builder.io/qwik";
import { getAvatarUrl } from "~/misc/helpers/content/get-avatar-url";

export const AvatarImg = component$(({ avatarUrl }: { avatarUrl: string }) => {
  return <img width='280' height='280' src={getAvatarUrl(avatarUrl)} />;
});
