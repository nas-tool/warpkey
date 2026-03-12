import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { Terminal, ExternalLink, CloudDownload } from 'lucide-react';
import { CopyButton } from '@/components/CopyButton';

export default async function ApiDocs() {
  const t = await getTranslations('API');


  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://warpkey.vercel.app';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Terminal className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <CloudDownload className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t('endpoints')}</h2>
              <p className="text-sm text-muted-foreground">{t('endpointsDesc')}</p>
            </div>
          </div>
          
          <div className="grid gap-8">
            {/* Full List Endpoint */}
            <Card className="border-l-4 border-l-primary shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {t('full')}
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">GET</span>
                    </CardTitle>
                    <CardDescription className="text-base">{t('fullDesc')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <code className="font-mono text-sm text-primary break-all">
                      {baseUrl}/api/full
                    </code>
                    <div className="flex items-center gap-2 shrink-0">
                      <CopyButton value={`${baseUrl}/api/full`} />
                      <Button variant="ghost" size="icon" asChild>
                        <a href="/api/full" target="_blank" aria-label="Open">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('usage')}</h4>
                  <div className="bg-zinc-950 text-zinc-50 rounded-lg p-4 font-mono text-sm relative group">
                    <code>{t('curl', { url: `${baseUrl}/api/full` })}</code>
                    <CopyButton 
                      value={`curl -sL ${baseUrl}/api/full > keys.txt`} 
                      className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lite List Endpoint */}
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {t('lite')}
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">GET</span>
                    </CardTitle>
                    <CardDescription className="text-base">{t('liteDesc')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <code className="font-mono text-sm text-primary break-all">
                      {baseUrl}/api/lite
                    </code>
                    <div className="flex items-center gap-2 shrink-0">
                      <CopyButton value={`${baseUrl}/api/lite`} />
                      <Button variant="ghost" size="icon" asChild>
                        <a href="/api/lite" target="_blank" aria-label="Open">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('usage')}</h4>
                  <div className="bg-zinc-950 text-zinc-50 rounded-lg p-4 font-mono text-sm relative group">
                    <code>{t('curl', { url: `${baseUrl}/api/lite` })}</code>
                    <CopyButton 
                      value={`curl -sL ${baseUrl}/api/lite > keys.txt`} 
                      className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
