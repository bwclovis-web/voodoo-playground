import { LoaderFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

export async function loader({
  params
}: LoaderFunctionArgs) {
  const res = await (await fetch(`https://starwars-databank-server.vercel.app/api/v1/characters/${params.id}`)).json()
  return { character: res }
}

const CharacterPage = () => {
  const { character } = useLoaderData<typeof loader>()
  return (
    <section className="flex flex-col gap-4 w-4/5">
      <div className="relative w-full h-full">
        <img
          width={300}
          height={400}
          src={character.image}
          alt={character.name}
          className="object-cover w-full overflow-hidden h-[500px] object-center"
          style={{ viewTransitionName: 'test-image' }}
        />
        <h1 className=" absolute top-0 z-30 bg-amber-100/30 max-w-max p-5 backdrop-blur-lg text-amber-950 text-4xl font-bold">{character.name}</h1>
      </div>
      <p className="text-lg">{character.description}</p>
      <Link to="/dashboard/long-call" viewTransition prefetch="intent">Back</Link>
    </section>
  )
}

export default CharacterPage
