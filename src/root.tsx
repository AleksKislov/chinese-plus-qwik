import {
  component$,
  useStyles$,
  useVisibleTask$,
  createContextId,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import Cookies from "js-cookie";
import { logout, getUser, StatusCodes } from "./misc/actions/auth";

import globalStyles from "./global.css?inline";

export interface User {
  _id: string;
  name: string;
  avatar: string;
  loggedIn: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  email: string;
}

export interface Alert {
  bg: string;
  text: string;
}

export const userContext = createContextId<User>("user-context");
export const alertsContext = createContextId<Alert[]>("alerts-context");

export default component$(() => {
  useStyles$(globalStyles);
  const userState = useStore<User>({
    name: "",
    avatar: "",
    loggedIn: false,
    _id: "",
    isAdmin: false,
    isModerator: false,
    email: "",
  });
  const alertsState = useStore<Alert[]>([]);

  useVisibleTask$(async () => {
    const cntrlr = new AbortController();
    const token = Cookies.get("token");
    if (!token) return;
    const resp = await getUser(token, cntrlr);
    // console.log(resp?.user);
    if (resp?.err === StatusCodes.Unauthorized) {
      logout();
    }
    if (resp?.user) {
      userState._id = resp.user._id;
      userState.avatar = resp.user.avatar;
      userState.name = resp.user.name;
      userState.email = resp.user.email;
      userState.loggedIn = true;
      userState.isAdmin = resp.user.role === "admin";
      userState.isModerator = resp.user.role === "moderator";
    }
    return cntrlr.abort;
  });

  useContextProvider(userContext, userState);
  useContextProvider(alertsContext, alertsState);
  return (
    <QwikCityProvider>
      <head>
        <meta charSet='utf-8' />
        <link rel='manifest' href='/manifest.json' />
        <RouterHead />
      </head>
      <body lang='en'>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
