import { createCookieSessionStorage } from "@remix-run/node"

import constants from "~/utils/constants"

export const authSessionStore = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: constants.AUTH_SESSION_KEY,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    secure: process.env.NODE_ENV === "production"
  }
})

export const { getSession, commitSession, destroySession } = authSessionStore
