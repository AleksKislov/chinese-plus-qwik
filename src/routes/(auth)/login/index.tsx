import {
  component$,
  $,
  useOnDocument,
  useSignal,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeAction$, type RequestEvent, Link } from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import { Alerts } from "~/components/common/alerts/alerts";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { ApiService } from "~/misc/actions/request";
import { AlertColorEnum, alertsContext } from "~/root";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (token) throw redirect(302, "/me");
};

export const useLogin = routeAction$(async (params): Promise<{ token: string } | null> => {
  return ApiService.post("/api/auth", params, undefined, null);
});

export default component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const login = useLogin();
  const alertsState = useContext(alertsContext);

  useVisibleTask$(({ track }) => {
    const res = track(() => login.value);
    if (res === undefined) return;

    if (!res?.token) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: `Ошибка! Проверьте имейл / пароль`,
      });
      return;
    }

    Cookies.set("token", res.token);
    location.reload();
  });

  useOnDocument(
    "keydown",
    $(
      (e) =>
        (e as KeyboardEvent).key === "Enter" &&
        login.submit({ email: email.value, password: password.value })
    )
  );

  return (
    <div class='text-center'>
      <article class={"prose max-w-none"}>
        <h1>Логин</h1>
        <Alerts />
        <div class='mb-3'>
          Нет аккаунта?{" "}
          <Link href='/register' class='link link-primary'>
            Зарегистрируйтесь
          </Link>
        </div>
        <div class='flex items-stretch'>
          <div class='form-control mx-auto w-96'>
            <label class='input-group input-group-vertical mb-4'>
              <span>Email</span>
              <input
                type={"email"}
                placeholder='example@site.com'
                class='input input-bordered'
                bind:value={email}
              />
            </label>

            <label class='input-group input-group-vertical mb-4'>
              <span>Пароль</span>
              <input
                minLength={6}
                type='password'
                placeholder='ваш pAs$w0rd'
                class='input input-bordered'
                bind:value={password}
              />
            </label>
            <button
              class='btn btn-info mt-2'
              onClick$={() => {
                login.submit({ email: email.value, password: password.value });
              }}
            >
              войти
            </button>
          </div>
        </div>
      </article>
    </div>
  );
});
