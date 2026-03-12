// Constants from main.go
const SOURCES = [
  "https://t.me/s/warpplus",
  "https://t.me/s/warppluscn",
  "https://t.me/s/warpPlusHome",
  "https://t.me/s/warp_veyke",
];

const PATTERN = /<code>([A-Za-z0-9-]+)<\/code>/g;

export interface KeyData {
  keys: string[];
  lastUpdated: number;
}

export interface LiveData {
  full: string[];
  lite: string[];
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

export async function fetchLiveData(): Promise<LiveData> {
  const currentKeys = await getAllKeys();
  const timestamp = Date.now();

  let fullList = [...currentKeys];
  if (fullList.length > 100) {
    fullList = fullList.slice(0, 100);
  }

  let liteList = shuffleArray([...fullList]);
  if (liteList.length > 15) {
    liteList = liteList.slice(0, 15);
  }

  return {
    full: fullList,
    lite: liteList,
    lastUpdated: timestamp
  };
}
