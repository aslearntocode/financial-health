import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Forward the request to your actual API
    const response = await fetch('http://172.210.82.112:5000/api/mutual-funds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const recommendations = await response.json()
    return NextResponse.json(recommendations)
    
  } catch (error) {
    console.error('Mutual funds API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mutual fund recommendations' },
      { status: 500 }
    )
  }
} 