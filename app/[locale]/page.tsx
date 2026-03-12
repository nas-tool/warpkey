import { kv } from '@vercel/kv';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { getTranslations, getFormatter } from 'next-intl/server';
import { CopyButton } from '@/components/CopyButton';
import { ShieldCheck, Activity, Zap, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
      // console.warn('KV environment variables missing. Returning null.');
      return null;
    }
    return await kv.get<T>(key);
  } catch (error) {
    console.error(`Error fetching KV key ${key}:`, error);
    return null;
  }
}

export default async function Home() {
  const t = await getTranslations('Home');
  const format = await getFormatter();
  
  const diffState = await getSafeKVData<DiffState>('warp_keys_diff');
  const fullData = await getSafeKVData<KeyData>('warp_keys_full');
  const liteData = await getSafeKVData<KeyData>('warp_keys_lite');

  const lastUpdated = diffState?.lastUpdated || fullData?.lastUpdated || 0;
  const activeKeysCount = fullData?.keys?.length || 0;
  const newKeysCount = diffState?.added?.length || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 mb-4">
            v1.0.0
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            {lastUpdated > 0 ? (
              <Tooltip>
                <TooltipTrigger className="cursor-help decoration-dashed underline-offset-4 hover:underline">
                  {t('lastUpdated', { time: format.relativeTime(lastUpdated) })}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{format.dateTime(lastUpdated, { dateStyle: 'full', timeStyle: 'medium' })}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span>Initializing...</span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('status.active')}
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeKeysCount}</div>
              <p className="text-xs text-muted-foreground">
                +0% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('status.new')}
              </CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newKeysCount}</div>
              <p className="text-xs text-muted-foreground">
                In the latest update
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('status.total')}
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">~100</div>
              <p className="text-xs text-muted-foreground">
                Capacity limit per cycle
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Updates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t('latestChanges')}</h2>
          </div>
          <Card>
            <CardHeader>
              <CardDescription>{t('latestChangesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {t('addedKeys')}
                  </h3>
                  {diffState?.added && diffState.added.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {diffState.added.map((key) => (
                        <div key={key} className="group relative">
                          <Badge variant="outline" className="pl-2 pr-8 py-1 font-mono text-sm border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors">
                            {key}
                          </Badge>
                          <CopyButton value={key} className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t('noNewKeys')}</p>
                  )}
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {t('removedKeys')}
                  </h3>
                  {diffState?.removed && diffState.removed.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {diffState.removed.map((key) => (
                        <Badge key={key} variant="secondary" className="font-mono text-sm text-muted-foreground line-through opacity-70">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t('noRemovedKeys')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lists Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Full List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">{t('fullList')}</h2>
              <Badge variant="secondary">{t('limit', { limit: 100 })}</Badge>
            </div>
            <Card className="h-[600px] flex flex-col border-2 border-muted/40">
              <CardHeader className="pb-3">
                <CardDescription>{t('fullListDesc', { count: fullData?.keys?.length || 0 })}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-2 pt-2">
                    {fullData?.keys?.map((key, i) => (
                      <div key={key} className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground w-6 text-xs font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                          <span className="font-mono text-sm font-medium">{key}</span>
                          {diffState?.added.includes(key) && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-[10px] h-5 px-1.5">{t('new')}</Badge>
                          )}
                        </div>
                        <CopyButton value={key} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {!fullData?.keys?.length && (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <RefreshCw className="h-8 w-8 mb-2 opacity-20 animate-spin" />
                        <p>{t('noKeysYet')}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Lite List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">{t('liteList')}</h2>
              <Badge variant="secondary">{t('limit', { limit: 15 })}</Badge>
            </div>
            <Card className="h-[600px] flex flex-col border-2 border-primary/10 bg-primary/5">
              <CardHeader className="pb-3">
                <CardDescription>{t('liteListDesc', { count: liteData?.keys?.length || 0 })}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-2 pt-2">
                    {liteData?.keys?.map((key, i) => (
                      <div key={key} className="group flex items-center justify-between p-3 rounded-lg border bg-background/80 hover:bg-background transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground w-6 text-xs font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                          <span className="font-mono text-sm font-medium text-primary">{key}</span>
                        </div>
                        <CopyButton value={key} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {!liteData?.keys?.length && (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <p>{t('noKeys')}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
