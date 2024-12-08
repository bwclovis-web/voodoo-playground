import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import metaUtil, { MetaData } from "~/components/Utility/metaUtil"
import { getAllFeatures } from "~/models/feature.server"
import i18nServer from "~/modules/i18n/i18n.server"
import { useOptionalUser } from "~/utils/userUtils"

import banner from "../../images/rush.webp"
import { ROUTE_PATH as LOGIN_PATH } from "../auth+/login"
import { ROUTE_PATH as DASHBOARD_PATH } from "../dashboard+/_index"

export const meta: MetaFunction = ({ data }) => (
  metaUtil(data as MetaData)
)

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request)
  const features = await getAllFeatures()
  return {
    description: t("home.meta.description"),
    features,
    title: t("home.meta.title")
  }
}

export default function Index() {
  const { t } = useTranslation()
  const { features } = useLoaderData<typeof loader>()
  const user = useOptionalUser()

  return (
    <div className="flex flex-col gap-8 items-center h-full bg-purple-900 px-4">
      <img src={banner} alt="" className="absolute object-cover w-full h-full opacity-40" />
      <section className="content mt-20 z-4 w-full md:w-3/4 xl:w-2/4 mx-auto border border-pink-600 py-5 px-3 rounded-md bg-primary-100 text-pink-900 text-center">
        <Link to={{
          pathname: user ? DASHBOARD_PATH : LOGIN_PATH
        }} className="flex">
          <span className="text-lg uppercase font-semibold">{t("global.login")}</span>
        </Link>
        <h1 className="font-black tracking-wide text-6xl pb-3">{t("home.heading")}</h1>
        <p className="text-xl font-semibold tracking-wide mb-5">{t("home.subTitle")}</p>
        <Form className="flex justify-evenly">
          <button type="submit" name="lng" value="es" className="bg-accent-600 p-2 rounded-2xl cursor-pointer text-accent-100 text-xl uppercase font-bold">
            Español
          </button>
          <button type="submit" name="lng" value="en" className="bg-accent-600 p-2 rounded-2xl cursor-pointer text-accent-100 text-xl uppercase font-bold">
            English
          </button>
        </Form>

        <div className="mt-5 pt-5 border-t-2 border-primary-200">
          <h2 className="text-center text-5xl font-black">{t("home.featuresHeading")}</h2>
          {features.map(feature => (
            <details key={feature.id} className="flex flex-col gap-3 text-left">
              <summary className="cursor-pointer py-3 px-3 text-xl font-black uppercase">{feature.summary}</summary>
              <p className="text-xl" dangerouslySetInnerHTML={{ __html: feature.detail }} />
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
