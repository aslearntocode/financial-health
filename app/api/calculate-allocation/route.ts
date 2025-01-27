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

    // Build query parameters - ensure approximate_debt is properly formatted
    const queryParams = new URLSearchParams({
      name: data.name,
      age: data.age.toString(),
      current_savings: data.current_savings.toString(),
      monthly_savings: data.monthly_savings.toString(),
      investment_horizon_years: data.investment_horizon_years.toString(),
      financial_goal: data.financial_goal.toLowerCase(),
      needs_money_during_horizon: data.needs_money_during_horizon.toLowerCase(),
      has_investment_experience: data.has_investment_experience.toLowerCase(),
      // Ensure approximate_debt is a valid number and convert to string
      approximate_debt: (parseFloat(data.approximate_debt) || 0).toString()
    })

    const url = `http://172.210.82.112:5000/api/portfolio-recommendation?${queryParams.toString()}`
    console.log('2. Calling URL:', url)

    const recommendationResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    // Add error handling for non-200 responses
    if (!recommendationResponse.ok) {
      const errorText = await recommendationResponse.text()
      console.error('API Error:', errorText)
      return NextResponse.json(
        { error: `API Error: ${errorText}` },
        { status: recommendationResponse.status }
      )
    }

    const responseText = await recommendationResponse.text()
    console.log('3. Raw response:', responseText)

    let rawData
    try {
      rawData = JSON.parse(responseText)
      // Remove unwanted fields
      delete rawData.risk
      delete rawData.totalPercentage
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText)
      return NextResponse.json(
        { error: 'Invalid JSON response from API' },
        { status: 500 }
      )
    }

    console.log('4. Parsed data:', rawData)

    if (!rawData || !Array.isArray(rawData.chartData)) {
      console.error('Invalid data structure:', rawData)
      return NextResponse.json(
        { error: 'Invalid data structure received from API' },
        { status: 500 }
      )
    }

    const chartData = rawData.chartData.map((item: ChartDataItem) => ({
      name: item.category,
      value: item.percentage,
      color: item.fill || getColorForCategory(item.category)
    }))

    console.log('5. Transformed chart data:', chartData)

    // Extract metrics from full_response with updated parsing
    let risk_score = 0
    let expected_return = 0

    if (rawData.full_response) {
      try {
        const fullResponseString = rawData.full_response
          .replace(/```json\n|\n```/g, '')
          .split('\n')
          .filter(Boolean)

        console.log('Parsed response strings:', fullResponseString);

        // Find the risk and expected return from the array of strings
        for (const line of fullResponseString) {
          try {
            // Remove the % symbol before parsing
            const cleanLine = line.replace(/%/g, '');
            const obj = JSON.parse(cleanLine);
            
            if (obj.risk !== undefined) {
              risk_score = Number(obj.risk);
            }
            if (obj.expected_return !== undefined) {
              expected_return = Number(obj.expected_return);
            }
          } catch (e) {
            console.error('Error parsing line:', line, e);
          }
        }

        console.log('Extracted metrics:', { risk_score, expected_return });
      } catch (parseError) {
        console.error('Error parsing metrics:', parseError)
      }
    }

    const response = { 
      allocation: chartData,
      risk_score,
      expected_return
    };

    console.log('Final response:', response);

    return NextResponse.json(response);

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
