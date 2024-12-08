export const ROUTE_PATH = '/dashboard'
import { useSubmit } from '@remix-run/react'

import { ROUTE_PATH as LOGOUT_PATH } from '~/routes/auth+/logout'

const Dashboard = () => {
  const submit = useSubmit()
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => submit({}, { action: LOGOUT_PATH, method: 'POST' })}>HA</button>
    </div>
  )
}

export default Dashboard
