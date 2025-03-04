import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Forward the request to the actual API
    const body = await request.json()
    
    const response = await fetch('http://172.210.82.112:5001/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze credit report' },
      { status: 500 }
    )
  }
} 