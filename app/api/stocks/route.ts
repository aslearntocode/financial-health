import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Stocks API request data:', data)
    
    // Try both ports in case of server configuration changes
    const urls = [
      'http://172.210.82.112:5000/api/stocks',
      'http://172.210.82.112:5001/api/stocks'
    ]
    
    let response = null
    let lastError = null
    
    for (const url of urls) {
      try {
        console.log('Trying stocks URL:', url)
        
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
          console.log('Success with stocks URL:', url)
          break
        } else {
          const errorText = await response.text()
          console.error(`Stocks API Error for ${url}:`, errorText)
          lastError = errorText
        }
      } catch (error) {
        console.error(`Stocks Network error for ${url}:`, error)
        lastError = error instanceof Error ? error.message : 'Network error'
      }
    }

    // If all URLs failed, provide fallback response
    if (!response || !response.ok) {
      console.error('All stocks API endpoints failed, providing fallback response')
      
      // Provide fallback stock recommendations based on user profile
      const age = parseInt(data.age)
      const riskTolerance = age < 30 ? 'high' : age < 50 ? 'medium' : 'low'
      const hasExperience = data.has_investment_experience?.toLowerCase() === 'y'
      const financialGoal = data.financial_goal?.toLowerCase()
      
      let fallbackRecommendations = []
      
      if (riskTolerance === 'high' && hasExperience) {
        fallbackRecommendations = [
          {
            symbol: "RELIANCE",
            name: "Reliance Industries Ltd",
            sector: "Energy",
            risk_level: "High",
            expected_return: "15-20%",
            current_price: 2500,
            description: "Diversified conglomerate with strong fundamentals"
          },
          {
            symbol: "TCS",
            name: "Tata Consultancy Services Ltd",
            sector: "IT",
            risk_level: "Moderate",
            expected_return: "12-15%",
            current_price: 3500,
            description: "Leading IT services company with global presence"
          },
          {
            symbol: "HDFC",
            name: "HDFC Bank Ltd",
            sector: "Banking",
            risk_level: "Moderate",
            expected_return: "10-13%",
            current_price: 1500,
            description: "Leading private sector bank with strong asset quality"
          }
        ]
      } else if (riskTolerance === 'medium') {
        fallbackRecommendations = [
          {
            symbol: "INFY",
            name: "Infosys Ltd",
            sector: "IT",
            risk_level: "Moderate",
            expected_return: "10-12%",
            current_price: 1800,
            description: "Stable IT company with consistent performance"
          },
          {
            symbol: "ITC",
            name: "ITC Ltd",
            sector: "FMCG",
            risk_level: "Low",
            expected_return: "8-10%",
            current_price: 400,
            description: "Diversified FMCG company with strong brands"
          },
          {
            symbol: "HINDUNILVR",
            name: "Hindustan Unilever Ltd",
            sector: "FMCG",
            risk_level: "Low",
            expected_return: "7-9%",
            current_price: 2500,
            description: "Leading FMCG company with defensive characteristics"
          }
        ]
      } else {
        fallbackRecommendations = [
          {
            symbol: "SBIN",
            name: "State Bank of India",
            sector: "Banking",
            risk_level: "Low",
            expected_return: "6-8%",
            current_price: 600,
            description: "Largest public sector bank with government backing"
          },
          {
            symbol: "NTPC",
            name: "NTPC Ltd",
            sector: "Power",
            risk_level: "Low",
            expected_return: "5-7%",
            current_price: 200,
            description: "Leading power generation company with stable returns"
          },
          {
            symbol: "ONGC",
            name: "Oil and Natural Gas Corporation Ltd",
            sector: "Energy",
            risk_level: "Low",
            expected_return: "6-8%",
            current_price: 150,
            description: "Government-owned oil and gas company"
          }
        ]
      }
      
      return NextResponse.json({
        data: fallbackRecommendations,
        fallback: true,
        message: 'Using fallback stock recommendations due to API unavailability'
      })
    }

    const recommendations = await response.json()
    console.log('Stocks API response:', recommendations)
    return NextResponse.json(recommendations)
    
  } catch (error) {
    console.error('Stocks API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock recommendations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 