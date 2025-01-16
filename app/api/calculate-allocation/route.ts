import { NextResponse } from 'next/server'

// Define interfaces for the data structure
interface ChartDataItem {
  category: string;
  percentage: number;
  fill?: string;
}

interface ApiResponse {
  chartData: ChartDataItem[];
  // Add other properties if they exist in rawData
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('1. Received form data:', data)

    // Build query parameters
    const queryParams = new URLSearchParams({
      name: data.name,
      age: data.age.toString(),
      current_savings: data.current_savings.toString(),
      monthly_savings: data.monthly_savings.toString(),
      investment_horizon_years: data.investment_horizon_years.toString(),
      financial_goal: data.financial_goal.toLowerCase()
    })

    const url = `http://172.210.82.112:5001/api/portfolio-recommendation?${queryParams.toString()}`
    console.log('2. Calling URL:', url)

    const recommendationResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    const responseText = await recommendationResponse.text()
    console.log('3. Raw response:', responseText)

    const rawData = JSON.parse(responseText)
    console.log('4. Parsed data:', rawData)

    // Use the chartData directly from the API response
    const chartData = (rawData as ApiResponse).chartData.map((item: ChartDataItem) => ({
      name: item.category,
      value: item.percentage,
      color: item.fill || getColorForCategory(item.category)
    }))

    console.log('5. Transformed chart data:', chartData)

    return NextResponse.json({ allocation: chartData })

  } catch (error) {
    console.error('Error in calculate-allocation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

// Helper function for getting colors
function getColorForCategory(category: string): string {
  const colorMap: Record<string, string> = {
    'Equity': '#FF6B6B',
    'Debt': '#4ECDC4',
    'Gold': '#FFD93D',
    'Cash': '#95A5A6',
    // Add more categories and colors as needed
  }
  return colorMap[category] || '#000000' // Default color if category not found
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
} 