/* eslint-disable max-statements */
import { Password, User } from '@prisma/client'
import bcrypt from "bcryptjs"

import { prisma } from "~/db.server"

export const verifyUserLogin = async (email: User["email"], password: Password["hash"]) => {
  const userWithPassword = await prisma.user.findUnique({
    include: { password: true },
    where: { email }
  })

  if (!userWithPassword || !userWithPassword.password) {
    throw new Error('User not found')
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
