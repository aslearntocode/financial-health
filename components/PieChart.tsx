"use client"

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { useRouter } from 'next/navigation'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const router = useRouter()

  console.log('PieChart received data:', data);

  if (!Array.isArray(data) || data.length === 0) {
    console.log('No valid data for PieChart');
    return null;
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const radian = Math.PI / 180
    const x = cx + radius * Math.cos(-midAngle * radian)
    const y = cy + radius * Math.sin(-midAngle * radian)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm md:text-lg font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const renderColorfulLegendText = (value: string) => {
    return <span className="text-base">{value}</span>
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-center mb-6 max-w-[600px] text-gray-700 font-medium leading-relaxed italic bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
        Allocate your lumpsum savings in the proposed allocation and for monthly savings, start SIPs to invest proportinally.
      </p>
      <div 
        className="w-[470px] h-[470px] cursor-pointer relative group hover:scale-[1.02] transition-all duration-300"
        onClick={() => router.push('/recommendations')}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg z-10">
          <p className="font-medium text-lg bg-white/90 text-gray-800 px-6 py-3 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
            Click to Get More Details
          </p>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={156}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              formatter={renderColorfulLegendText}
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '40px' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 