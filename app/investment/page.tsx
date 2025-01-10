'use client'

import { useRouter } from 'next/navigation'
import Header from "@/components/Header"
import { InvestmentForm } from "@/components/InvestmentForm"
import { useState, useEffect } from "react"
import { Pie, PieChart } from "recharts"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AuthWrapper } from "@/components/AuthWrapper"

interface ChartConfig {
  [key: string]: {
    color: string;
    label: string;
  };
}

interface ChartDataItem {
  category: string;
  fill: string;
  percentage: number;
}

interface ApiResponse {
  chartConfig: ChartConfig;
  chartData: ChartDataItem[];
  full_response: string;
  totalPercentage: number;
}

export default function InvestmentPage() {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleFormSubmit = async (data: any) => {
    try {
      console.log('Received response:', data);
      setApiResponse(data);
      setShowResults(true);
      setError('');
    } catch (error) {
      console.error('Error handling response:', error);
      setError('Failed to process investment data');
    }
  };

  const transformDataForChart = (chartData: ChartDataItem[]) => {
    return chartData.map(item => ({
      category: item.category,
      percentage: item.percentage,
      fill: item.fill
    }))
  }

  const createChartConfig = (chartConfig: ChartConfig) => {
    const config = {
      percentage: {
        label: "Percentage",
      },
    } as any

    Object.entries(chartConfig).forEach(([key, value]) => {
      if (key !== 'percentage') {
        config[key.toLowerCase()] = {
          label: value.label,
          color: value.color,
        }
      }
    })

    return config
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-r from-blue-600 to-blue-700" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left side form */}
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <InvestmentForm onSubmit={handleFormSubmit} />
                {error && (
                  <div className="mt-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Right side results */}
              {showResults && apiResponse ? (
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold">Your Investment Allocation</CardTitle>
                    <p className="text-xl text-gray-700 mt-4">
                      Based on your profile, here&apos;s your recommended investment allocation:
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-16">
                      {/* Pie Chart */}
                      <ChartContainer
                        config={createChartConfig(apiResponse.chartConfig)}
                        className="w-[500px] aspect-square"
                      >
                        <PieChart width={500} height={500}>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                          />
                          <Pie
                            data={transformDataForChart(apiResponse.chartData)}
                            dataKey="percentage"
                            nameKey="category"
                            innerRadius={60}
                            outerRadius={200}
                          />
                        </PieChart>
                      </ChartContainer>

                      {/* Legend */}
                      <div className="flex flex-col space-y-6">
                        {apiResponse.chartData.map((item) => (
                          <div key={item.category} className="flex items-center justify-between">
                            <div className="flex items-center gap-4 mr-16">
                              <div 
                                className="w-5 h-5 rounded-full"
                                style={{ backgroundColor: item.fill }}
                              />
                              <span className="text-2xl">
                                {item.category.includes(' ') ? (
                                  <div>
                                    {item.category.split(' ').map((word, i) => (
                                      <div key={i}>{word}</div>
                                    ))}
                                  </div>
                                ) : (
                                  item.category
                                )}
                              </span>
                            </div>
                            <span className="text-2xl font-medium">{item.percentage}%</span>
                          </div>
                        ))}
                        
                        {/* Total with border */}
                        <div className="pt-6 mt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold mr-16">Total</span>
                            <span className="text-2xl font-bold">{apiResponse.totalPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <div className="text-center text-gray-400">
                    Submit form to see your personalized allocation
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
} 