import { kv } from '@vercel/kv';

// Constants from main.go
const SOURCES = [
  "https://t.me/s/warpplus",
  "https://t.me/s/warppluscn",
  "https://t.me/s/warpPlusHome",
  "https://t.me/s/warp_veyke",
];

const PATTERN = /<code>([A-Za-z0-9-]+)<\/code>/g;

export interface WarpKey {
  key: string;
  firstSeen: number; // timestamp
  lastSeen: number; // timestamp
  status: 'new' | 'active' | 'removed'; 
}

export interface KeyData {
  keys: string[];
  lastUpdated: number;
}

export async function fetchKeysFromUrl(url: string): Promise<string[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching ${url}: ${response.statusText}`);
      return [];
    }
    const text = await response.text();
    const matches = [...text.matchAll(PATTERN)];
    return matches.map(match => match[1]);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  }
}

export async function getAllKeys(): Promise<string[]> {
  const allKeys = new Set<string>();
  
  const results = await Promise.all(SOURCES.map(url => fetchKeysFromUrl(url)));
  
  results.forEach(keys => {
    keys.forEach(key => allKeys.add(key));
  });

  return Array.from(allKeys);
}

// Helper to shuffle array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function updateKeys() {
  const currentKeys = await getAllKeys();
  const timestamp = Date.now();

  // Get previous state from KV
  const previousData = await kv.get<KeyData>('warp_keys_full');
  const previousKeys = new Set(previousData?.keys || []);
  
  // Calculate diff
  const currentSet = new Set(currentKeys);
  const added = currentKeys.filter(k => !previousKeys.has(k));
  const removed = [...previousKeys].filter(k => !currentSet.has(k));
  const kept = currentKeys.filter(k => previousKeys.has(k));

  // Store new full list
  // Limit full list to 100 as per main.go logic? 
  // main.go: "Generate full file with up to 100 keys"
  let fullList = [...currentKeys];
  if (fullList.length > 100) {
    fullList = fullList.slice(0, 100);
  }

  // Store lite list
  // main.go: "Generate lite file with up to 15 keys, shuffled"
  let liteList = shuffleArray([...fullList]);
  if (liteList.length > 15) {
    liteList = liteList.slice(0, 15);
  }

  // Save to KV
  await kv.set('warp_keys_full', { keys: fullList, lastUpdated: timestamp });
  await kv.set('warp_keys_lite', { keys: liteList, lastUpdated: timestamp });
  
  // Store diff history for the UI
  // We want to show what changed in the *latest* update compared to the previous one.
  // We can store a "diff_log" or just the last diff state.
  const diffState = {
    added,
    removed,
    kept,
    lastUpdated: timestamp
  };
  await kv.set('warp_keys_diff', diffState);

  return {
    full: fullList,
    lite: liteList,
    diff: diffState
  };
}
