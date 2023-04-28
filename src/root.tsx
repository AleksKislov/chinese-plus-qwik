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
import { logout, StatusCodes, getUser } from "./misc/actions/auth";

import globalStyles from "./global.css?inline";
import { getUserWords, type UserWord } from "./misc/actions/get-user-words";

export interface User {
  _id: ObjectId;
  name: string;
  avatar: string;
  loggedIn: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  email: string;
  finishedTexts: string[];
  seenVideos: string[];
  words: UserWord[];
}

export interface Alert {
  bg: AlertBgUnion;
  text: string;
}

type AlertBgUnion = "alert-info" | "alert-success" | "alert-warning" | "alert-error";

export const userContext = createContextId<User>("user-context");
export const alertsContext = createContextId<Alert[]>("alerts-context");

export default component$(() => {
  useStyles$(globalStyles);
  const userState = useStore<User>({
    _id: "",
    name: "",
    avatar: "",
    loggedIn: false,
    isAdmin: false,
    isModerator: false,
    email: "",
    finishedTexts: [],
    seenVideos: [],
    words: [],
  });
  const alertsState = useStore<Alert[]>([]);

  useVisibleTask$(async () => {
    const cntrlr = new AbortController();
    const token = Cookies.get("token");
    if (!token) return;
    const [userResp, userWords] = await Promise.allSettled([
      getUser(token, cntrlr),
      getUserWords(token),
    ]);
    // console.log(userWords);

    if (userResp.status === "rejected") return cntrlr.abort;
    const resp = userResp.value;
    if (resp.err === StatusCodes.Unauthorized) {
      logout();
    }
    if (resp.user) {
      userState._id = resp.user._id;
      userState.avatar = resp.user.avatar;
      userState.name = resp.user.name;
      userState.email = resp.user.email;
      userState.loggedIn = true;
      userState.isAdmin = resp.user.role === "admin";
      userState.isModerator = resp.user.role === "moderator";
      userState.finishedTexts = resp.user.finished_texts ? resp.user.finished_texts : [];
      userState.seenVideos = resp.user.seenVideos ? resp.user.seenVideos : [];
      userState.words = userWords.status === "fulfilled" ? userWords.value : [];
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
