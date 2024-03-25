"use server";

import { Inventory, Token, UserData } from "@/lib/types";

export async function getToken(
  username: string,
  password: string
): Promise<Token> {
  return makeApiRequest("/token/", "POST", undefined, {
    username: username,
    password: password,
  });
}

export async function getRefreshToken(token: string): Promise<Token> {
  return makeApiRequest("/token/refresh/", "POST", undefined, {
    refresh: token,
  });
}

export async function getUserData(token: string): Promise<UserData> {
  return makeApiRequest("/users/data/", "GET", token, undefined);
}

export async function getInventory(token: string): Promise<Inventory[]> {
  return makeApiRequest("/inventory/", "GET", token, undefined);
}

export async function updateInventory(
  token: string,
  id: number,
  body: object
): Promise<Inventory> {
  return makeApiRequest(`/inventory/${id}/`, "PATCH", token, body);
}

export async function getUsers(token: string): Promise<UserData[]> {
  return makeApiRequest("/users/", "GET", token, undefined);
}

export async function updateUser(
  token: string,
  id: number,
  body: object
): Promise<UserData> {
  return makeApiRequest(`/users/${id}/update/`, "PATCH", token, body);
}

async function makeApiRequest<T>(
  endpoint: string,
  method: string,
  token?: string,
  body?: object
): Promise<T> {
  /* Wrapper for calling fetch on our API */
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${process.env.API_BASE_URL}${endpoint}`,
    config
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const data: T = await response.json();
  return data;
}
