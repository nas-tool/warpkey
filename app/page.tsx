import { kv } from '@vercel/kv';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { formatDistanceToNow } from 'date-fns';

export const revalidate = 60; // Revalidate every minute

interface DiffState {
  added: string[];
  removed: string[];
  kept: string[];
  lastUpdated: number;
}

interface KeyData {
  keys: string[];
  lastUpdated: number;
}

async function getSafeKVData<T>(key: string): Promise<T | null> {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('KV environment variables missing. Returning null.');
      return null;
    }
    return await kv.get<T>(key);
  } catch (error) {
    console.error(`Error fetching KV key ${key}:`, error);
    return null;
  }
}

export default async function Home() {
  const diffState = await getSafeKVData<DiffState>('warp_keys_diff');
  const fullData = await getSafeKVData<KeyData>('warp_keys_full');
  const liteData = await getSafeKVData<KeyData>('warp_keys_lite');

  const lastUpdated = diffState?.lastUpdated || fullData?.lastUpdated || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            WarpKey Monitor
          </h1>
          <p className="text-muted-foreground">
            Automated Warp+ key monitoring and verification.
            {lastUpdated > 0 && (
              <>Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}</>
            )}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Diff Section */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Latest Changes</CardTitle>
              <CardDescription>
                Keys added (green) and removed (red) in the last update.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Added Keys</h3>
                  {diffState?.added && diffState.added.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {diffState.added.map((key) => (
                        <Badge key={key} variant="default" className="bg-green-500 hover:bg-green-600 font-mono">
                          + {key}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No new keys added.</p>
                  )}
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Removed Keys</h3>
                  {diffState?.removed && diffState.removed.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {diffState.removed.map((key) => (
                        <Badge key={key} variant="destructive" className="font-mono">
                          - {key}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No keys removed.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full List */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Full List</CardTitle>
                  <CardDescription>All valid keys ({fullData?.keys?.length || 0})</CardDescription>
                </div>
                <Badge variant="outline">Limit: 100</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-2">
                  {fullData?.keys?.map((key) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded-md bg-muted/50 font-mono text-sm">
                      <span>{key}</span>
                      {diffState?.added.includes(key) && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] h-5">New</Badge>
                      )}
                    </div>
                  ))}
                  {!fullData?.keys?.length && (
                    <div className="text-center text-muted-foreground py-8">
                      No keys available yet. Waiting for cron job...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Lite List */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lite List</CardTitle>
                  <CardDescription>Random selection ({liteData?.keys?.length || 0})</CardDescription>
                </div>
                <Badge variant="outline">Limit: 15</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-2">
                  {liteData?.keys?.map((key) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded-md bg-muted/50 font-mono text-sm">
                      <span>{key}</span>
                    </div>
                  ))}
                  {!liteData?.keys?.length && (
                    <div className="text-center text-muted-foreground py-8">
                      No keys available yet.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
