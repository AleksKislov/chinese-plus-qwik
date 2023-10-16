import { component$, useContext, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { isDarkThemeContext, userContext } from "~/root";
import { logout } from "~/misc/actions/auth";
import { Link, useNavigate } from "@builder.io/qwik-city";
import MenuItem from "./menu-item";
import type { MenuItemProps } from "./menu-item";
import {
  collapsedMenuSvg,
  dropdownArrowBottom,
  dropdownArrowRight,
  enterSvg,
  exitSvg,
  moonSvg,
  sunSvg,
} from "../../media/svg";
import { getNewMentions } from "~/routes/layout";
import { AvatarImg } from "../../media/avatar-img";

export default component$(() => {
  const newMentions = getNewMentions();
  const userState = useContext(userContext);
  const isDarkTheme = useContext(isDarkThemeContext);
  const themeChanged = useSignal(true);
  const nav = useNavigate();
  const showDoubleClickTip = useSignal(false);

  useTask$(() => {
    userState.newMentions = newMentions.value;
  });

  useVisibleTask$(({ track }) => {
    track(() => themeChanged.value);
    isDarkTheme.bool = themeChanged.value;
  });

  return (
    <header class='bg-neutral mb-4'>
      <div class='md:container md:mx-auto'>
        <div class='navbar h-12'>
          <div class='flex-1'>
            <div class='dropdown'>
              <label tabIndex={0} class='btn btn-ghost lg:hidden'>
                {collapsedMenuSvg}
              </label>
              <ul
                tabIndex={0}
                class='menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52 z-40'
              >
                <li tabIndex={0}>
                  <a class='justify-between'>
                    Читалка
                    {dropdownArrowRight}
                  </a>
                  <ul class='p-2'>
                    <li>
                      <a>Тексты</a>
                    </li>
                    <li>
                      <a>На проверке</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Item 3</a>
                </li>
              </ul>
            </div>

            <Link class='btn btn-ghost normal-case text-xl' href='/'>
              <span>
                Chinese<span class='text-success font-extrabold text-2xl'>+</span>
              </span>
            </Link>

            <div class='hidden lg:flex'>
              <ul class='menu menu-horizontal px-1 mt-1'>
                <MenuItem name={read.name} links={read.links} />
                <MenuItem name={watch.name} links={watch.links} />
                <MenuItem name={start.name} links={start.links} />

                <li tabIndex={0} class='dropdown dropdown-hover'>
                  <label>
                    HSK
                    {dropdownArrowBottom}
                  </label>
                  <ul class='dropdown-content menu shadow bg-neutral rounded-box w-52 p-2 z-40'>
                    <li class='menu-title'>
                      <small>HSK 2.0</small>
                    </li>
                    <li>
                      <Link href='/hsk/2/table'>Таблица</Link>
                    </li>
                    <li>
                      <Link href='/hsk/2/tests'>Тесты</Link>
                    </li>
                    <li>
                      <Link href='/hsk/2/search'>Поиск</Link>
                    </li>

                    <li class='menu-title'>
                      <small>HSK 3.0</small>
                    </li>
                    <li>
                      <Link href='/hsk/3/table'>Таблица</Link>
                    </li>
                    <li>
                      <Link href='/hsk/3/tests'>Тесты</Link>
                    </li>
                    <li>
                      <Link href='/hsk/3/search'>Поиск</Link>
                    </li>
                  </ul>
                </li>

                <li tabIndex={0}>
                  <Link href='/search'>Словарь</Link>
                </li>
                <li tabIndex={0}>
                  <Link href='/feedback'>Фидбэк</Link>
                </li>
                <li tabIndex={0}>
                  <label class='swap swap-rotate'>
                    <input type='checkbox' bind:checked={themeChanged} />
                    <div class='swap-on'>{moonSvg}</div>
                    <div class='swap-off'>{sunSvg}</div>
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div class='flex-none'>
            {!showDoubleClickTip.value ? null : (
              <div class='badge badge-xs'>double click ={">"} ЛК</div>
            )}

            <div class='dropdown dropdown-end'>
              <label
                tabIndex={0}
                class={`btn btn-ghost btn-circle avatar ${
                  newMentions.value.length ? "online" : ""
                } ${userState.name ? "mt-2" : ""}`}
              >
                {userState.name ? (
                  <div
                    class='rounded-full '
                    onMouseEnter$={() => {
                      showDoubleClickTip.value = true;
                    }}
                    onMouseLeave$={() => {
                      showDoubleClickTip.value = false;
                    }}
                    onClick$={(e) => {
                      // @ts-ignore
                      if (e.detail === 2) nav("/me");
                    }}
                  >
                    <AvatarImg
                      userName={userState.name}
                      size={46}
                      newAvatar={userState.newAvatar}
                    />
                  </div>
                ) : (
                  <div>{enterSvg}</div>
                )}
              </label>
              <ul
                tabIndex={0}
                class='menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52 z-40'
              >
                {userState.name ? authMenu : unAuthMenu}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export const unAuthMenu = (
  <>
    <li>
      <Link href='/register'>Регистрация</Link>
    </li>
    <li>
      <Link href='/login'>Войти</Link>
    </li>
  </>
);

export const authMenu = (
  <>
    <li>
      <Link href='/me'>Личный кабинет</Link>
    </li>
    <li>
      <Link href='/me/hsk/2'>Мой словарик HSK</Link>
    </li>
    <li>
      <Link href='/me/words'>Мой словарик</Link>
    </li>
    <li>
      <Link href='/create'>Поделиться контентом</Link>
    </li>
    <hr class='h-px my-1 bg-primary border-0' />

    <li>
      <a
        onClick$={() => {
          logout();
          location.reload();
        }}
      >
        Выйти {exitSvg}
      </a>
    </li>
  </>
);

export const start: MenuItemProps = {
  name: "Новичкам",
  links: [
    {
      href: "/start/pinyin-chart",
      text: "Таблица пиньиня с озвучкой",
    },
    {
      href: "/start/pinyin-tests",
      text: "Тесты на пиньинь",
    },
    {
      href: "/start/radicals",
      text: "Таблица ключей иероглифов",
    },
  ],
};

export const watch: MenuItemProps = {
  name: "Видео",
  links: [
    {
      href: "/watch/videos",
      text: "Видео",
    },
    {
      href: "/watch/unapproved-videos",
      text: "На проверке",
    },
  ],
};

export const read: MenuItemProps = {
  name: "Читалка",
  links: [
    {
      href: "/read/texts",
      text: "Тексты",
    },
    {
      href: "/read/unapproved-texts",
      text: "На проверке",
    },
  ],
};
