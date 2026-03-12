import { NextResponse } from 'next/server';
import { fetchLiveData } from '@/lib/warp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchLiveData();
    return NextResponse.json({
      added: [],
      removed: [],
      kept: data.full,
      lastUpdated: data.lastUpdated,
      note: 'Real-time mode: diff history disabled'
    });
  } catch (error) {
    console.error('Error fetching diff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
