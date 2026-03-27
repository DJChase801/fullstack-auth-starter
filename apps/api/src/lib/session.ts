import type { Response } from "express";

import { env } from "../config/env.js";
import { sessionCookieName, signAuthToken } from "./jwt.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.COOKIE_SECURE || env.NODE_ENV === "production",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export function setSessionCookie(response: Response, userId: string) {
  response.cookie(sessionCookieName, signAuthToken(userId), cookieOptions);
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(sessionCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieOptions.secure,
    path: "/",
  });
}
