import { get, put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const ACCESS = 'public' as const;

async function streamToString(stream: ReadableStream | null): Promise<string> {
  if (!stream) return '';
  // Response can consume a ReadableStream in both Node and Edge runtimes
  const res = new Response(stream);
  return res.text();
}

export async function readJsonFromBlob<T>(pathname: string): Promise<T | null> {
  if (!BLOB_TOKEN) {
    console.warn(`[Blob] BLOB_READ_WRITE_TOKEN missing. Unable to read ${pathname}.`);
    return null;
  }

  try {
    const blobRes = await get(pathname, {
      access: ACCESS,
      token: BLOB_TOKEN,
      useCache: false,
    });

    if (!blobRes || !blobRes.stream) {
      return null;
    }

    const text = await streamToString(blobRes.stream);
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`[Blob] Error reading ${pathname}:`, error);
    return null;
  }
}

export async function writeJsonToBlob(pathname: string, data: unknown) {
  if (!BLOB_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN missing. Cannot write to Vercel Blob.');
  }

  const body = JSON.stringify(data);

  await put(pathname, body, {
    access: ACCESS,
    token: BLOB_TOKEN,
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export function blobTokenExists() {
  return Boolean(BLOB_TOKEN);
}

export const BLOB_PATHS = {
  full: 'warp_keys_full.json',
  lite: 'warp_keys_lite.json',
  diff: 'warp_keys_diff.json',
};
