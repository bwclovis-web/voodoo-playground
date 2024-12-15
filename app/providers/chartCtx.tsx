/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */
import { data } from "@remix-run/node"
import { createContext, useState } from "react"

const ctxDefaults = {
  chart: null,
  chartOptions: {
    title: 'Chart Title',
    dataset: 'Dataset'
  },
  chartType: 'bar' as string | null,
  data: null,
  setChartType: (type: string) => { },
  setOptions: (options: { title: string, dataset: string }) => { },
  update: () => { }
}

const ChartContext = createContext(ctxDefaults)

export const ChartProvider = ({ children }) => {
  const [chartType, setChartType] = useState('line')
  const [chartOptions, setOptions] = useState({ dataset: 'Dataset', title: 'Chart Title' })
  return (
    <ChartContext.Provider value={{
      ...ctxDefaults,
      chartOptions,
      chartType,
      setChartType,
      setOptions
    }}>
      {children}
    </ChartContext.Provider >
  )
}

export default ChartContext
