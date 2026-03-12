import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const diff = await kv.get('warp_keys_diff');
    return NextResponse.json(diff || { added: [], removed: [], kept: [], lastUpdated: 0 });
  } catch (error) {
    console.error('Error fetching diff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
