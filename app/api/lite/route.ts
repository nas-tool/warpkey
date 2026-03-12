import { NextResponse } from 'next/server';
import { KeyData } from '@/lib/warp';
import { BLOB_PATHS, readJsonFromBlob } from '@/lib/blob-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await readJsonFromBlob<KeyData>(BLOB_PATHS.lite);

    if (!data) {
      return new NextResponse('Service Unavailable: Blob not configured', { status: 503 });
    }

    if (!data.keys || data.keys.length === 0) {
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
    console.error('Error fetching lite keys:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
