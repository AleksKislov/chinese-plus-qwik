import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { dateToStr } from "~/misc/helpers/tools";

type UserDateDivProps = { userId: string; userName: string; date: string };

export const UserDateDiv = component$(({ userId, userName, date }: UserDateDivProps) => {
  return (
    <>
      <div class={"flex pt-2"}>
        <div>
          <Link href={`/users/${userId}`}>
            <small class={"text-accent"}>{userName}</small>
          </Link>
        </div>
        <div>
          <small class={"text-neutral-500 ml-1"}>{dateToStr(date, false)}</small>
        </div>
      </div>
    </>
  );
});
