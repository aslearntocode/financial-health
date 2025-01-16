import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ChartProps {
  data: ChartData[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name} ${value}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
} 