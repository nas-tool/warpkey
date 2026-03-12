import { NextResponse } from 'next/server';
import { fetchLiveData } from '@/lib/warp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchLiveData();
    const keys = data.lite;
    if (!keys || keys.length === 0) {
      return new NextResponse('No keys found.', { status: 404 });
    }

    const text = keys.join('\n');
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 's-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching lite keys:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
