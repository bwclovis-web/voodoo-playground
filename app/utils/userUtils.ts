/* eslint-disable complexity */
import { User } from "@prisma/client"
import { useMatches } from "@remix-run/react"
import { useMemo } from "react"

export function useMatchesData(routeId: string):
  Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find(route => route.id === routeId),
    [matchingRoutes, routeId]
  )
  return route?.data as Record<string, unknown>
}

const isUser = (user: unknown) => (
  user !== null &&
  typeof user === "object" &&
  "email" in user &&
  typeof user.email === "string"
)

export const useOptionalUser = (): User | undefined => {
  const data = useMatchesData("root")
  console.log(`%c data`, 'background: #0047ab; color: #fff; padding: 2px:', data)
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user as User
}
