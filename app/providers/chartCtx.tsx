/* eslint-disable no-empty-function */
import { createContext, useState } from "react"

const ctxDefaults = {
  chart: null,
  chartType: 'bar' as string | null,
  data: null,
  options: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setChartType: (type: string) => { },
  update: () => { }
}

const ChartContext = createContext(ctxDefaults)

export const ChartProvider = ({ children }) => {
  const [chartType, setChartType] = useState('line')
  return (
    <ChartContext.Provider value={{
      ...ctxDefaults,
      chartType,
      setChartType
    }}>
      {children}
    </ChartContext.Provider >
  )
}

export default ChartContext
