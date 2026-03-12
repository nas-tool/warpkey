import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { Server, ShieldCheck, Activity, Terminal, ExternalLink, Code, CloudDownload, History } from 'lucide-react';
import Link from 'next/link';
import { CopyButton } from '@/components/CopyButton';

export default async function About() {
  const t = await getTranslations('About');

  const features = [
    {
      icon: <CloudDownload className="h-6 w-6 text-blue-500" />,
      title: t('features.fetch'),
      desc: t('features.fetchDesc')
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
      title: t('features.dedup'),
      desc: t('features.dedupDesc')
    },
    {
      icon: <Activity className="h-6 w-6 text-orange-500" />,
      title: t('features.track'),
      desc: t('features.trackDesc')
    },
    {
      icon: <Terminal className="h-6 w-6 text-purple-500" />,
      title: t('features.api'),
      desc: t('features.apiDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-2">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-muted hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Direct Access (API) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CloudDownload className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">{t('directAccess')}</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {t('directAccessDesc')} <span className="font-medium text-primary">（实时抓取，不落盘存储）</span>
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-muted/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  {t('fullList')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-background border rounded-md p-3 font-mono text-sm flex items-center justify-between group relative">
                  <code className="text-primary truncate mr-8">/api/full</code>
                  <div className="flex items-center gap-1 absolute right-2">
                    <CopyButton value={`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/full`} className="h-7 w-7" />
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <a href="/api/full" target="_blank" aria-label="Open API">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t('fullListApiDesc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  {t('liteList')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-background border rounded-md p-3 font-mono text-sm flex items-center justify-between group relative">
                  <code className="text-primary truncate mr-8">/api/lite</code>
                  <div className="flex items-center gap-1 absolute right-2">
                    <CopyButton value={`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/lite`} className="h-7 w-7" />
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <a href="/api/lite" target="_blank" aria-label="Open API">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t('liteListApiDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Deployment & Legacy */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('deployment')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{t('deploymentDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('legacySupport')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{t('legacySupportDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Author Section */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-8 border-t">
          <p className="text-lg font-medium">{t('author')}</p>
          <Button variant="outline" className="gap-2 rounded-full px-6" asChild>
            <Link href="https://www.wanghaoyu.com.cn" target="_blank">
              {t('visitWebsite')}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
