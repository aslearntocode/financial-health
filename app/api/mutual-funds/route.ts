import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Mutual funds API request data:', data)
    
    // Try both ports in case of server configuration changes
    const urls = [
      'http://172.210.82.112:5000/api/mutual-funds',
      'http://172.210.82.112:5001/api/mutual-funds'
    ]
    
    let response = null
    let lastError = null
    
    for (const url of urls) {
      try {
        console.log('Trying mutual funds URL:', url)
        
        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          console.log('Success with mutual funds URL:', url)
          break
        } else {
          const errorText = await response.text()
          console.error(`Mutual funds API Error for ${url}:`, errorText)
          lastError = errorText
        }
      } catch (error) {
        console.error(`Mutual funds Network error for ${url}:`, error)
        lastError = error instanceof Error ? error.message : 'Network error'
      }
    }

    // If all URLs failed, provide fallback response
    if (!response || !response.ok) {
      console.error('All mutual funds API endpoints failed, providing fallback response')
      
      // Provide fallback mutual fund recommendations based on user profile
      const age = parseInt(data.age)
      const riskTolerance = age < 30 ? 'high' : age < 50 ? 'medium' : 'low'
      const hasExperience = data.has_investment_experience?.toLowerCase() === 'y'
      const financialGoal = data.financial_goal?.toLowerCase()
      
      let fallbackRecommendations = []
      
      if (riskTolerance === 'high' && hasExperience) {
        fallbackRecommendations = [
          {
            name: "HDFC Top 100 Fund",
            category: "Large Cap",
            risk_level: "Moderate",
            expected_return: "12-15%",
            min_investment: 5000,
            description: "Large cap fund with consistent performance"
          },
          {
            name: "SBI Bluechip Fund",
            category: "Large Cap",
            risk_level: "Moderate",
            expected_return: "11-14%",
            min_investment: 5000,
            description: "Bluechip companies focused fund"
          },
          {
            name: "Axis Midcap Fund",
            category: "Mid Cap",
            risk_level: "High",
            expected_return: "15-18%",
            min_investment: 5000,
            description: "Mid cap growth opportunities"
          }
        ]
      } else if (riskTolerance === 'medium') {
        fallbackRecommendations = [
          {
            name: "HDFC Balanced Advantage Fund",
            category: "Hybrid",
            risk_level: "Moderate",
            expected_return: "10-13%",
            min_investment: 5000,
            description: "Balanced equity and debt allocation"
          },
          {
            name: "ICICI Prudential Value Discovery Fund",
            category: "Value",
            risk_level: "Moderate",
            expected_return: "9-12%",
            min_investment: 5000,
            description: "Value investing approach"
          },
          {
            name: "SBI Magnum Midcap Fund",
            category: "Mid Cap",
            risk_level: "High",
            expected_return: "12-15%",
            min_investment: 5000,
            description: "Mid cap growth potential"
          }
        ]
      } else {
        fallbackRecommendations = [
          {
            name: "HDFC Short Term Debt Fund",
            category: "Debt",
            risk_level: "Low",
            expected_return: "6-8%",
            min_investment: 5000,
            description: "Low risk debt fund"
          },
          {
            name: "SBI Conservative Hybrid Fund",
            category: "Hybrid",
            risk_level: "Low",
            expected_return: "7-9%",
            min_investment: 5000,
            description: "Conservative equity-debt mix"
          },
          {
            name: "ICICI Prudential Corporate Bond Fund",
            category: "Debt",
            risk_level: "Low",
            expected_return: "6-7%",
            min_investment: 5000,
            description: "Corporate bond focused"
          }
        ]
      }
      
      return NextResponse.json({
        data: fallbackRecommendations,
        fallback: true,
        message: 'Using fallback mutual fund recommendations due to API unavailability'
      })
    }

    const recommendations = await response.json()
    console.log('Mutual funds API response:', recommendations)
    return NextResponse.json(recommendations)
    
  } catch (error) {
    console.error('Mutual funds API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mutual fund recommendations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 