import { NextRequest, NextResponse } from 'next/server';

interface ParsedPdfData {
  sections?: {
    equities?: Array<{
      [key: string]: any;  // or define specific properties if known
    }>;
    mutualFunds?: Array<{
      [key: string]: any;  // or define specific properties if known
    }>;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Add your PDF parsing logic here
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only accepts POST requests' },
    { status: 405 }
  );
}