import { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { getNoteById } from "~/models/notes.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Error("Note ID is required")
  }
  const note = await getNoteById(params.id)

  return { note }
}

const Note = () => {
  const { note } = useLoaderData<typeof loader>()
  if (!note) {
    return null
  }

  return (
    <section>
      <h1>{note.title}</h1>
      <p>{note.body}</p>
    </section>
  )
}

export default Note
