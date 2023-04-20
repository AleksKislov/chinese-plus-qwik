import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type UserLinkProps = { userId: string; userName: string };

export const UserLink = component$(({ userId, userName }: UserLinkProps) => {
  return (
    <Link href={`/users/${userId}`}>
      <small class={"text-accent"}>{userName}</small>
    </Link>
  );
});
