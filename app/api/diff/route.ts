import { NextResponse } from 'next/server';
import { BLOB_PATHS, readJsonFromBlob } from '@/lib/blob-storage';
import { DiffState } from '@/lib/warp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const diff = await readJsonFromBlob<DiffState>(BLOB_PATHS.diff);
    return NextResponse.json(diff || { added: [], removed: [], kept: [], lastUpdated: 0 });
  } catch (error) {
    console.error('Error fetching diff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
