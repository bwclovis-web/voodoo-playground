import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Outlet, useActionData, useFetcher, useLoaderData } from "@remix-run/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"

import { Button, CustomLink } from "~/components/Atoms/Button/Button"
import Input from "~/components/Atoms/Input/Input"
import DashboardNav from "~/components/Molecules/DashboardNav/DashboardNav"
import { createNote, getAllCustomerNotes } from "~/models/notes.server"
import { fetchUser } from "~/models/user.server"
import { requireSessionUser } from "~/modules/auth/auth-session.server"
import { validateCSRF } from "~/utils/server/csrf.server"
import { checkHoneypot } from "~/utils/server/honeypot.server"

import { VerifyNoteSchema } from "../auth+/Forms/validationUtils"
import { ROUTE_PATH as ACCOUNT_SETUP_PATH } from "../onboarding+/setup"
export const ROUTE_PATH = '/dashboard' as const

const createNewNote = (data: FormData, userID: string) => {
  const title = data.get('title') as string
  const body = data.get('body') as string
  createNote({ body, title, userId: userID })

  return {}
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await fetchUser(request, '')
  if (!user.password) {
    return redirect(ACCOUNT_SETUP_PATH)
  }
  const notes = await getAllCustomerNotes(user.id)

  return { notes, user }
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireSessionUser(request)
  const formData = await request.formData()
  await validateCSRF(formData, request.headers)
  checkHoneypot(formData)
  if (user) {
    return createNewNote(formData, user.id)
  }
  return {}
}
const DashboardLayout = () => {
  const { notes, user } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)
  const actionData = useActionData<{ errors?: { [key: string]: string } }>()
  const { t } = useTranslation()

  const [notesForm, { title, body }] = useForm({
    constraint: getZodConstraint(VerifyNoteSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyNoteSchema })
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur'
  })

  return (
    <div className="bg-slate-200 h-full">
      <DashboardNav />
      <div className="mx-auto flex gap-6 h-full">
        <aside className="border-r-2 border-slate-50 pr-6 h-full p-6 bg-slate-300 max-w-1/5">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <details className="my-4">
            <summary className="cursor-pointer">{t("notes.viewNote")}</summary>
            {notes.length ? <ul>
              {notes.map(note => (
                <li key={note.id}>
                  <CustomLink variant="link" url={{ pathname: `/dashboard/note/${note.id}` }}>
                    {note.title}
                  </CustomLink>
                </li>
              ))}
            </ul> : <p>{t("notes.noNotes")}</p>}
          </details>
          <Button popovertarget="my-popover" size='sm' variant="primary">{t("notes.createNote")}</Button>
          <div popover="auto" id="my-popover" className="opacity-0 transition-discrete duration-200 open:opacity-100 starting:open:opacity-0 relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-96 sm:p-6">
            <fetcher.Form method="POST" {...getFormProps(notesForm)}>
              <AuthenticityTokenInput />
              <HoneypotInputs />
              <Input action={title} inputType={"text"} inputRef={inputRef} inputId="noteTitle" actionData={actionData} />
              <textarea className="block w-full resize-none border border-slate-500 rounded-sm my-4 field-sizing-content p-6" {...getInputProps(body, {
                ariaAttributes: true,
                type: "text"
              })} />

              <Button type="submit">
                {t("global.login")}
              </Button>
            </fetcher.Form>
          </div>
        </aside>
        <div className="py-6 overflow-hidden w-full pr-24">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
