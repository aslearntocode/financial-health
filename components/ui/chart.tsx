"use client"

import * as React from "react"
import { TooltipProps } from "recharts"
import { 
  Bar, 
  Cell, 
  Line, 
  Pie, 
  PieChart as RePieChart, 
  ResponsiveContainer 
} from "recharts"

import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    color?: string
    label: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue>({
  config: {},
})

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement
}

export function Chart({ children, className, ...props }: ChartProps) {
  return (
    <ChartContext.Provider value={{ config: {} }}>
      <div className={cn("", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipProps<T extends string | number | Array<string | number>> extends Omit<TooltipProps<T, string>, "content"> {
  content?: React.ReactNode
}

export function ChartTooltip<T extends string | number | Array<string | number>>({ 
  content, 
  ...props 
}: ChartTooltipProps<T>) {
  if (!content) {
    return null
  }

  return (
    <div
      className="rounded-lg border bg-background p-2 shadow-sm"
      style={{
        backgroundColor: "white",
      }}
    >
      {content}
    </div>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      category: string
      percentage: number
      fill: string
    }
  }>
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  hideLabel = false,
}: ChartTooltipContentProps) {
  const { config } = React.useContext(ChartContext)

  if (!active || !payload?.length) {
    return null
  }

  const { category, percentage } = payload[0].payload

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold">{category}</span>
      <span className="text-sm font-bold">{percentage}%</span>
    </div>
  )
} 