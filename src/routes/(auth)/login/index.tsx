import { component$, useStore, $, useOnDocument, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import { userContext } from "~/root";
import { apiPostReq } from "~/misc/actions/request";

export const login = async (
  email: string,
  password: string
): Promise<{ token: string } | undefined> => {
  try {
    return await apiPostReq("/api/auth", { email, password });
  } catch (err) {
    console.log(err);
  }
};

export default component$(() => {
  const nav = useNavigate();
  const store = useStore({ email: "", password: "" });
  const state = useContext(userContext);

  const submit = $(async () => {
    const res = await login(store.email, store.password);
    if (!res?.token) return console.log("Что-то пошло не так!");

    Cookies.set("token", res.token);
    location.reload();
  });

  useOnDocument(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Enter") submit();
    })
  );

  if (state.name) nav("/");

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
