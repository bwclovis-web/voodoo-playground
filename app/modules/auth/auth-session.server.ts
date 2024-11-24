import { User } from "@prisma/client"
import { createCookieSessionStorage, redirect } from "@remix-run/node"

import constants from "~/utils/constants"

import { auth } from "./auth.server"

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

export async function requireSessionUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {}
) {
  const sessionUser = await auth.isAuthenticated(request)
  if (!sessionUser) {
    if (!redirectTo) {
      throw redirect("/")
    } else {
      throw redirect(redirectTo)
    }
  }
  return sessionUser
}

export async function getTestSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return await authSessionStore.getSession(cookie)
}

export async function getUserId(request: Request): Promise<User["id"] | undefined> {
  const session = await getTestSession(request)
  console.log(`%c session`, 'background: #0047ab; color: #fff; padding: 2px:', session.get(USER_SESSION_KEY))
  return await session.get(constants.AUTH_SESSION_KEY)
}


export const { getSession, commitSession, destroySession } = authSessionStore
