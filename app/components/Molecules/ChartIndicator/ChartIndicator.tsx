import { VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { FC, HTMLProps } from "react"

import { chartIndicatorVariants } from "./chartIndicator-variants"

interface ChartIndicatorProps extends HTMLProps<HTMLDivElement>,
  VariantProps<typeof chartIndicatorVariants> {
  transport: string
  isConnected: boolean
}

const ChartIndicator: FC<ChartIndicatorProps> =
  ({ transport, isConnected }) => {
    const onlineIndicator = clsx({
      'bg-green-500': isConnected,
      'bg-red-500': !isConnected,
      'w-3 h-3 rounded-full inline-block': true
    })
    return (
      <div className="bg-sky-500/30 rounded p-2 mb-4">
        <p>Status <span className={onlineIndicator}></span></p>
        <p>Transport: {transport}</p>
      </div>
    )
  }
export default ChartIndicator  
