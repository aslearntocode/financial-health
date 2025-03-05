import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get the URL parameters from the request
    const { searchParams } = new URL(request.url)
    
    // Forward the request to the actual API
    const response = await fetch(
      `http://172.210.82.112:5001/analyze?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit report' },
      { status: 500 }
    )
  }
} 