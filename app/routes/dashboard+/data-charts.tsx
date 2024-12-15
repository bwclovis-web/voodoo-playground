
/* eslint-disable max-statements */
import { Chart as ChartJS } from 'chart.js/auto'
import localforage from "localforage"
import { useContext, useEffect, useRef, useState } from "react"
import { Chart as ReactChartJs } from "react-chartjs-2"

import { Button } from "~/components/Atoms/Button/Button"
import ChartIndicator from '~/components/Molecules/ChartIndicator/ChartIndicator'
import ChartOptions from '~/components/Molecules/ChartOptions/ChartOptions'
import ChartContext from '~/providers/chartCtx'
import { generateReport } from "~/utils/reportTemplate"

import useSocket from "../../hooks/useSocket"
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart'
    },
    zoom: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey: 'ctrl'
        },
        drag: {
          enabled: true
        },
        pinch: {
          enabled: true
        }
      }
    }
  }
}


const Charts = () => {
  const { isConnected,
    transport,
    usage,
    onDisconnect,
    connectSocket } = useSocket()
  const [reportData, setReportData] = useState<any>(null)
  const { chartType } = useContext(ChartContext)
  const buttonText = isConnected ? "Disconnect" : "Connect"
  const ref = useRef()

  const chartData = {
    labels: usage.map(item => item.memUse.toFixed(2)),
    datasets: [
      {
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        data: usage.map(item => item.cpuUse),
        label: 'Dataset 1'
      }
    ]
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("chartjs-plugin-zoom").then(plugin => {
        ChartJS.register(plugin.default)
      })
    }
  }, [])


  const handleClick = () => {
    if (isConnected) {
      onDisconnect()
    } else {
      connectSocket()
    }
  }

  const getReport = () => {
    setReportData(generateReport(usage))
  }

  const saveDataset = async evt => {
    localforage.setItem('key=1', JSON.stringify(usage))
  }

  return (
    <div className='flex gap-7 w-full'>
      <div className='w-1/3'>
        <ChartIndicator transport={transport} isConnected={isConnected} />
        <ChartOptions />
        <div className="flex w-2/3 justify-start gap-4 items-start mb-6">
          <Button size='sm' type="primary" onClick={() => handleClick()}>{buttonText}</Button>
          <Button size="sm" type="primary" disabled={isConnected} onClick={evt => getReport(evt)}>Get Report</Button>
          <Button size="sm" type="submit" onClick={evt => saveDataset(evt)} disabled={isConnected}>Save Data</Button>
        </div>
        {reportData && !isConnected &&
          <div className="bg-blue-900 rounded-md px-3 py-4 text-sky-200 font-semibold tracking-wide text-lg">
            <p>Max: {reportData.maxUse}</p>
            <p>Min: {reportData.minUse}</p>
            <p>Avg: {reportData.avgUse}</p>
            <Button size="lg" type="success" onClick={() => getFullData(null)} className="mt-6 mx-auto block">Full Data</Button>
          </div>
        }
      </div>
      <div className='w-full'>
        <ReactChartJs
          width={500}
          height={200}
          options={options}
          ref={ref}
          type={chartType}
          data={chartData}
        />
      </div>
    </div>
  )
}
export default Charts
