'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MutualFundsChart = () => {
  const data = {
    labels: [
      '03 Mar', '04 Mar', '05 Mar', '06 Mar', '07 Mar', '10 Mar', '11 Mar',
      '12 Mar', '13 Mar', '17 Mar', '18 Mar', '19 Mar', '20 Mar', '21 Mar', '24 Mar'
    ],
    datasets: [
      {
        label: 'Equity Net Investment',
        data: [7229.16, 3371.36, 1922.81, 264.35, 728.88, -329.26, 2344.66,
          791.62, 496.34, 4567.73, 547.73, 1005.75, -3010.26, -4555.19, -962.34],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Debt Net Investment',
        data: [-3534.66, -2836.81, -5561.77, -3463.87, -3240.01, -2620.37, -6656.60,
          -2120.72, -3535.87, -1935.71, -7776.90, -7557.03, -11713.36, 708.24, -7003.10],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'SEBI Mutual Funds Net Investment Trends (March 2025)',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Net Investment (Rs Crore)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <Line options={options} data={data} />
      <div className="text-sm text-gray-500 mt-4 text-center">
        Data source: SEBI (Securities and Exchange Board of India)
      </div>
    </div>
  );
};

export default MutualFundsChart;