// Add proper typing instead of any
interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function PieChart({ data }: { data: ChartData[] }) {
  // ... rest of the component
} 