import { Await, NavLink, data, useLoaderData, useParams } from "@remix-run/react"
import { Suspense } from "react"

let cache: any
export const loader = async ({ request }) => data({ characters: fetch('https://starwars-databank-server.vercel.app/api/v1/characters?page=15').then(res => res.json()) })


export const clientLoader = async ({ serverLoader }) => {
  if (cache) {
    return { characters: cache }
  }
  const promise = await serverLoader()
  const characters = await promise.characters
  cache = characters
  return { characters }
}
const LongCall = () => {
  const { characters } = useLoaderData<typeof loader>()
  return (
    <section className="h-full">
      <h1>Long Call</h1>

      <Suspense fallback={<div>Loading...</div>} key={useParams().id} >
        <Await resolve={characters}>
          {characters => <div className="grid grid-cols-3 gap-10 pr-6">
            {characters.data.map(character => (
              <NavLink className="text-indigo-100" key={character._id} to={`/dashboard/character/${character._id}`} viewTransition prefetch="intent">
                {({ isTransitioning }) => (
                  <div className="rounded bg-indigo-900 grid grid-cols-2 h-40 gap-4 border-t border-b border-r border-violet-400 transition-shadow hover:shadow-2xl hover:shadow-black/40">
                    <div className="h-full relative">
                      <img style={isTransitioning ? {
                        viewTransitionName: 'test-image'
                      } : undefined}
                        src={character.image} width={300} height={400} alt={character.name} className="object-cover border-r-4 border-indigo-100 h-full w-full absolute rounded-tr-full object-right" />
                    </div>
                    <div className="py-4 pr-6">
                      <h2 className="text-indigo-100 text-2xl text-center">{character.name}</h2>
                      <p className="overflow-hidden truncate">{character.description}</p>
                    </div>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
          }
        </Await>

      </Suspense>
    </section >
  )
}
export default LongCall
