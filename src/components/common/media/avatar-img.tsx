import { component$ } from "@builder.io/qwik";

export const AvatarImg = component$(({ avatarUrl }: { avatarUrl: string }) => {
  return <img width='280' height='280' src={`https:${avatarUrl}`} />;
});
