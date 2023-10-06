import { component$, useContext } from "@builder.io/qwik";
import { AvatarImg } from "../common/media/avatar-img";
import { copySvg } from "../common/media/svg";
import { alertsContext } from "~/root";
import { Link } from "@builder.io/qwik-city";

type UserMainInfoType = {
  id: ObjectId;
  avatar: string;
  role?: "moderator" | "admin";
  name: string;
  isPrivate: boolean;
};

export const UserMainInfo = component$(
  ({ id, avatar, role, name, isPrivate }: UserMainInfoType) => {
    const alertsState = useContext(alertsContext);

    const getRole = (): { name: string; desc: string } => {
      if (role === "admin") return { name: "админ", desc: "full power" };
      if (role === "moderator") return { name: "модератор", desc: "редактирует тексты" };
      return { name: "изучающий", desc: "редактировать свои тексты до публикации" };
    };

    return (
      <div class='flex'>
        <div class='tooltip tooltip-info tooltip-bottom h-24 w-24 mr-4' data-tip='Сменить аватар'>
          <div class='avatar'>
            <div class='w-24 mask mask-squircle'>
              <AvatarImg avatarUrl={avatar} />
            </div>
          </div>
        </div>
        <div>
          <div class='text-base-content mt-2'>
            <div>
              Nihao, <span class='badge badge-lg badge-primary'>{name}</span>
            </div>
            <div class='my-2'>
              Роль:{" "}
              <span class='tooltip tooltip-info tooltip-right' data-tip={getRole().desc}>
                <span class='badge badge-secondary'>{getRole().name}</span>
              </span>
            </div>
            {isPrivate ? (
              <Link href={"/users/" + id}>
                <button class='btn btn-xs btn-warning'>Мой контент</button>
              </Link>
            ) : (
              <div>
                User ID:{" "}
                <span
                  class='tooltip tooltip-warning tooltip-right'
                  data-tip='Скопировать ID, чтобы обратиться к пользователю в комментариях'
                >
                  <button
                    class='btn btn-xs btn-warning'
                    onClick$={() => {
                      navigator.clipboard.writeText(` @@[${id}]{${name}}@@, `);
                      alertsState.push({
                        bg: "alert-info",
                        text: "ID скопировано",
                      });
                    }}
                  >
                    {copySvg}
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
