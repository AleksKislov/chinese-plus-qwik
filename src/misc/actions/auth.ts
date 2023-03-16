import Cookies from "js-cookie";
import { BASE_URL } from "./request";

export enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
}

export interface UserFromDB {
  err?: StatusCodes.Unauthorized | StatusCodes.NotFound;
  user?: {
    _id: string;
    name: string;
    avatar: string;
  };
}

export function logout() {
  Cookies.remove("token");
}

export async function getUser(
  token: string,
  controller?: AbortController
): Promise<UserFromDB | null> {
  try {
    const resp = await fetch(BASE_URL + "/api/auth", {
      signal: controller?.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });
    if (resp.status === StatusCodes.Unauthorized) {
      return { err: StatusCodes.Unauthorized };
    }
    return { user: await resp.json() };
  } catch (e) {
    console.warn((e as Error).message);
    return { err: StatusCodes.NotFound };
  }
}
