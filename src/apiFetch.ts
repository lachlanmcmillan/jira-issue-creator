import fetch from "node-fetch";
import { readFile, writeFile } from "./filesystem";

export interface IAPIFetch {
  url: string;
  method?: string;
  apiUsername: string;
  apiPassword: string;
  cacheKey?: string; // omit cacheKey to turn off cacheing
  body?: string;
}

export const apiFetch = async ({
  url,
  apiUsername,
  apiPassword,
  cacheKey,
  method = "GET",
  body,
}: IAPIFetch): Promise<any> => {
  const cachedData = cacheKey && readFile(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: makeBasicAuthHeader(apiUsername, apiPassword),
    },
    body,
  });

  const bodyText = await response.text();

  if (!response.ok) {
    console.error(`API fetch responded with ${response.status}`);
    console.error(bodyText);
    throw new Error("response not ok");
  }

  let data;
  try {
    data = JSON.parse(bodyText);
  } catch (err) {
    console.error("Failed to parse API response data as JSON");
    console.error("URL: ", url);
    console.error("Response: ");
    console.error(bodyText);
    throw err;
  }

  if (cacheKey) {
    writeFile(cacheKey, data);
  }

  return data;
};

/**
 * HTTP Authorization header
 */
const makeBasicAuthHeader = (username: string, password: string): string => {
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${token}`;
};
