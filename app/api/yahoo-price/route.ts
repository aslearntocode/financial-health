import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const period1 = searchParams.get('period1')
  const period2 = searchParams.get('period2')

  if (!symbol || !period1 || !period2) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    // Add a small buffer to the date range
    const start = parseInt(period1) - (24 * 60 * 60) // One day before
    const end = parseInt(period2) + (24 * 60 * 60) // One day after

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${start}&period2=${end}&interval=1d`
    
    console.log('Fetching from Yahoo Finance:', {
      url,
      symbol,
      startDate: new Date(start * 1000).toISOString(),
      endDate: new Date(end * 1000).toISOString()
    })

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.error('Yahoo Finance API error:', {
        status: response.status,
        statusText: response.statusText
      })
      return NextResponse.json({ error: 'Failed to fetch data from Yahoo Finance' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Yahoo Finance API error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
} 