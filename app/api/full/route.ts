import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { KeyData } from '@/lib/warp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('KV environment variables missing. Returning 503.');
      return new NextResponse('Service Unavailable: KV not configured', { status: 503 });
    }

    const data = await kv.get<KeyData>('warp_keys_full');
    
    if (!data || !data.keys || data.keys.length === 0) {
      return new NextResponse('No keys found.', { status: 404 });
    }

    const text = data.keys.join('\n');
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching full keys:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
