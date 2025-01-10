import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    console.log('1. Received form data:', formData)

    // Build query parameters
    const queryParams = new URLSearchParams({
      name: formData.name,
      age: formData.age.toString(),
      current_savings: formData.current_savings.toString(),
      monthly_savings: formData.monthly_savings.toString(),
      investment_horizon_years: formData.investment_horizon_years.toString(),
      financial_goal: formData.financial_goal.toLowerCase()
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
    const chartData = rawData.chartData.map(item => ({
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

// Fallback colors if fill is not provided
function getColorForCategory(category: string): string {
  const colorMap: Record<string, string> = {
    'Equity': 'hsl(var(--chart-1))',
    'Mutual Funds': 'hsl(var(--chart-2))',
    'Bonds': 'hsl(var(--chart-3))',
    'Real Estate': 'hsl(var(--chart-4))',
    'Gold ETFs': 'hsl(var(--chart-5))'
  }
  return colorMap[category] || 'hsl(var(--chart-1))'
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