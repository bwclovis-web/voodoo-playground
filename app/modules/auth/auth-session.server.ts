import { User } from "@prisma/client"
import { createCookieSessionStorage } from "@remix-run/node"

import constants from "~/utils/constants"

const USER_SESSION_KEY = "userId"

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

export async function getTestSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return await authSessionStore.getSession(cookie)
}

export async function getUserId(request: Request): Promise<User["id"] | undefined> {
  const session = await getTestSession(request)
  return await session.get(USER_SESSION_KEY)
}


export const { getSession, commitSession, destroySession } = authSessionStore
