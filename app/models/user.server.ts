/* eslint-disable max-statements */
import { Password, User } from '@prisma/client'
import { redirect } from '@remix-run/node'
import bcrypt from "bcryptjs"

import { prisma } from "~/db.server"
import { auth } from '~/modules/auth/auth.server'

export const verifyUserLogin = async (email: User["email"], password: Password["hash"]) => {
  const userWithPassword = await prisma.user.findUnique({
    include: { password: true },
    where: { email }
  })

  if (!userWithPassword || !userWithPassword.password) {
    throw new Error('Customer not found')
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  )

  if (!isPasswordValid) {
    throw new Error('Password is not Valid')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
}

export async function fetchSessionUser(request: Request, redirectUrl: string) {
  const sessionUser = await auth.isAuthenticated(request)
  if (!sessionUser) {
    if (!redirectUrl) {
      throw redirect("/")
    } else {
      throw redirect(redirectUrl)
    }
  }
  return sessionUser
}

export const fetchUser = async (request: Request, redirectUrl: string) => {
  const sessionUser = await auth.isAuthenticated(request)
  const user = sessionUser?.id ?
    await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { password: true }
    }) :
    null

  if (!user) {
    if (!redirectUrl) {
      throw redirect("/")
    } else {
      throw redirect(redirectUrl)
    }
  }

  return user
}
