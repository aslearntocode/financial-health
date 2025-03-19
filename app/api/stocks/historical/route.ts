import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const date = searchParams.get('date');

  if (!ticker || !date) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  try {
    const historicalData = await yahooFinance.historical(ticker, {
      period1: new Date(date),
      period2: new Date(date),
    });

    return new Response(JSON.stringify(historicalData[0]?.close || null));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
} 