import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get the URL parameters from the request
    const { searchParams } = new URL(request.url)
    
    // Forward the request to the actual API
    const response = await fetch(
      `http://172.210.82.112:5001/get-audio?${searchParams.toString()}`,
      {
        method: 'GET',
        // Since we're expecting audio, we should accept appropriate content types
        headers: {
          'Accept': 'audio/*'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Forward the audio response
    const audioData = await response.arrayBuffer()
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg'
      }
    })
  } catch (error) {
    console.error('Audio proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audio summary' },
      { status: 500 }
    )
  }
} 