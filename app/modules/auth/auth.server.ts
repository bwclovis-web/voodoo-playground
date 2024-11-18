import { User } from "@prisma/client"
import { Authenticator } from 'remix-auth'
import { TOTPStrategy } from 'remix-auth-totp'

import { prisma } from "~/db.server"

import { sendAuthEmail } from "../email/templates/auth-email"

import { authSessionStore } from "./auth-session.server"
export const auth = new Authenticator<User>(authSessionStore)

auth.use(new TOTPStrategy(
  {
    secret: process.env.ENCRYPTION_SECRET || 'NOT_A_STRONG_SECRET',

    sendTOTP: async ({ email, code, magicLink }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ Dev-Only ] TOTP Code:', code)
        if (email.startsWith('admin')) {
          console.log('Not sending email for admin user.')
          return
        }
      }
      await sendAuthEmail({ email, code, magicLink })
    }
  },
  async ({ email }) => {
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email
        }

      })
      if (!user) {
        throw new Error('Unable to create user')
      }
    }
    return user
  }
))
