import { Chart as ChartJS } from 'chart.js/auto'
import localforage from "localforage"
import { useEffect, useRef, useState } from "react"
import { Chart as ReactChartJs } from "react-chartjs-2"

import { Button } from '~/components/Atoms/Button/Button'
import Select from "~/components/Atoms/Select/Select"
import { storeToSelect } from "~/components/Utility/storeToSelect"

import { options } from "./data-charts"

const DataAnalysis = () => {
  const [allExperiments, getAllExperiments] = useState([])
  const [selectedExperiment, setSelectedExperiment] = useState([])
  const ref = useRef()
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("chartjs-plugin-zoom").then(plugin => {
        ChartJS.register(plugin.default)
      })
    }
    localforage.keys().then(keys => {
      getAllExperiments(storeToSelect(keys))
    }).catch(err => {
      console.log(err)
    })
  }, [])

  const getExperiment = async e => {
    localforage.getItem(e.target.value).then(value => {
      const parsedValue = JSON.parse(value)
      const chartData = {
        labels: parsedValue?.map(item => item.memUse.toFixed(2)),
        datasets: [
          {
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: parsedValue?.map(item => item.cpuUse),
            label: e.target.value
          }
        ]
      }
      setSelectedExperiment(chartData)
    }).catch(err => {
      console.log(err)
    })
  }

  const deleteRecord = async () => {

    localforage.removeItem(selectedExperiment.datasets[0].label).then(() => {
      localforage.keys().then(keys => {
        getAllExperiments(storeToSelect(keys))
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log
    })
  }


  return (
    <div>
      <h1>Unknown Route</h1>
      <Select options={allExperiments} label="Recent Things" onChange={getExperiment} />
      {selectedExperiment?.datasets?.length &&
        <div>
          <ReactChartJs
            width={500}
            height={200}
            options={options}
            ref={ref}
            type="line"
            data={selectedExperiment}
          />
          <Button size="sm" type="primary" onClick={() => ref?.current?.resetZoom()}>Reset Zoom</Button>
          <Button size="sm" type="primary" onClick={() => deleteRecord()}>Delete this</Button>
        </div>
      }
    </div>
  )
}
export default DataAnalysis
