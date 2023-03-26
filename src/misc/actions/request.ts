export const BASE_URL = "http://localhost:5000";

type ReqHeaders = {
  "Content-Type": string;
  "x-auth-token"?: string;
};

type ReqOptions = {
  method: string;
  headers: ReqHeaders;
  body?: string;
};

const headers: ReqHeaders = {
  "Content-Type": "application/json",
};

function getReqOptions(method: string, body: string | null, token?: string): ReqOptions {
  const options: ReqOptions = {
    headers,
    method,
  };
  if (token) {
    options.headers = { ...headers, "x-auth-token": token };
  }
  if (body) {
    options.body = body;
  }
  return options;
}

async function myFetch(path: string, opts: ReqOptions, defaultVal?: any): Promise<any> {
  try {
    const res = await fetch(BASE_URL + path, opts);
    if (!res.ok) throw new Error(`Error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log(err);
    return defaultVal;
  }
}

export class ApiService {
  static get(path: string, token?: string, defaultVal?: any): Promise<any> {
    const opts = getReqOptions("GET", null, token);
    return myFetch(path, opts, defaultVal);
  }

  static post(path: string, body: Object, token?: string, defaultVal?: any): Promise<any> {
    const opts = getReqOptions("POST", JSON.stringify(body), token);
    return myFetch(path, opts, defaultVal);
  }

  static delete(path: string, token?: string, defaultVal?: any): Promise<any> {
    const opts = getReqOptions("DELETE", null, token);
    return myFetch(path, opts, defaultVal);
  }
}
