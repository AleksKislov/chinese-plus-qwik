import { component$, useStore, $, useOnDocument } from "@builder.io/qwik";
import { type RequestEvent } from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import { ApiService } from "~/misc/actions/request";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = cookie.get("token");
  if (token?.value) throw redirect(302, "/me");
};

export const login = (email: string, password: string): Promise<{ token: string } | null> => {
  return ApiService.post("/api/auth", { email, password }, "", null);
};

export default component$(() => {
  const store = useStore({ email: "", password: "" });

  const submit = $(async () => {
    const res = await login(store.email, store.password);
    if (!res?.token) return console.log("Что-то пошло не так!");

    Cookies.set("token", res.token);
    location.reload();
  });

  useOnDocument(
    "keydown",
    $((e) => (e as KeyboardEvent).key === "Enter" && submit())
  );

  return (
    <div class='text-center'>
      <article class={"prose max-w-none"}>
        <h1>Логин</h1>

        <div class='flex items-stretch'>
          <div class='form-control mx-auto w-96'>
            <label class='input-group input-group-vertical mb-4'>
              <span>Email</span>
              <input
                type={"email"}
                placeholder='example@site.com'
                class='input input-bordered'
                onInput$={(e) => {
                  store.email = (e.target as HTMLInputElement).value;
                }}
              />
            </label>

            <label class='input-group input-group-vertical mb-4'>
              <span>Пароль</span>
              <input
                type={"password"}
                placeholder='ваш pAs$w0rd'
                class='input input-bordered'
                onInput$={(e) => {
                  store.password = (e.target as HTMLInputElement).value;
                }}
              />
            </label>
            <button class='btn btn-info mt-2' onClick$={submit}>
              Info
            </button>
          </div>
        </div>
      </article>
    </div>
  );
});
