import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { getAllFeatures } from "~/models/feature.server"
import i18nServer from "~/modules/i18n/i18n.server"
interface MetaData {
  title: string;
  description: string;
}

import banner from "../../images/voodoo.webp"

export const meta: MetaFunction = ({ data }: { data: MetaData }) => [
  { title: data?.title },
  { content: data?.description, name: "description" }
]

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
  const container = useRef<HTMLDivElement>(null)
  const { features } = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col gap-8 items-center h-full bg-purple-900" ref={container}>
      <img src={banner} alt="" className="absolute object-cover w-full h-full opacity-90" />
      <section className="content z-4 w-2/4 mx-auto border border-pink-600 py-5 px-3 rounded-md bg-pink-200/60 backdrop-blur text-pink-900 text-center">
        {/* <Link url="/auth/login" className="flex" intent="home">
          <FaGlobe />
          <span className="text-lg uppercase font-semibold">{t("common.login")}</span>
        </Link> */}
        <h1 className="font-black tracking-wide text-6xl pb-3">{t("home.heading")}</h1>
        <p className="text-xl font-semibold tracking-wide mb-5">{t("home.subTitle")}</p>
        {/* <Form className="flex justify-evenly">
          <details>
            <summary className="cursor-pointer py-3 px-3 text-xl font-black">SELECT A LANGUAGE</summary>
            <Button type="submit" name="lng" value="es">
              Español
            </Button>
            <Button type="submit" name="lng" value="fr">
              Français
            </Button>
            <Button type="submit" name="lng" value="en">
              English
            </Button>
          </details>
        </Form> */}
      </section>
      <section className="features text-pink-900  min-h-max relative z-4 w-2/4 mx-auto border border-pink-600 py-5 px-3 rounded-md bg-pink-200/60 backdrop-blur ">
        <h2 className="text-center text-5xl font-black">{t("home.featuresHeading")}</h2>
        {features.map(feature => (
          <details key={feature.id} className="flex flex-col gap-3">
            <summary className="cursor-pointer py-3 px-3 text-xl font-black uppercase">{feature.summary}</summary>
            <p className="text-xl" dangerouslySetInnerHTML={{ __html: feature.detail }} />
          </details>
        ))}
      </section>
    </div>
  )
}

