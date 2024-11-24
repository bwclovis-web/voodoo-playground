import { Note, User } from "@prisma/client"

import { prisma } from "~/db.server"

export const getAllCustomerNotes = async (userId: string) => (
  await prisma.note.findMany({
    where: { userId }
  })
)

export const createNote = async ({ body, title, userId }: Pick<Note, "body" | "title"> & {
  userId: User["id"];
}) => (
  await prisma.note.create({
    data: {
      body,
      title,
      user: {
        connect: { id: userId }
      }
    }
  })
)


