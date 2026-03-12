import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">About WarpKey Monitor</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>
                This application monitors various Telegram channels and sources for Warp+ keys.
                It automatically fetches, validates, and updates the list of available keys every hour.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fetches from multiple sources</li>
                <li>Deduplicates keys</li>
                <li>Tracks added and removed keys</li>
                <li>Provides Full (100 keys) and Lite (15 random keys) lists</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Full List</h3>
                <code className="bg-muted px-2 py-1 rounded">GET /api/full</code>
                <p className="text-sm text-muted-foreground mt-1">Returns up to 100 unique keys, newline separated.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Lite List</h3>
                <code className="bg-muted px-2 py-1 rounded">GET /api/lite</code>
                <p className="text-sm text-muted-foreground mt-1">Returns 15 random keys, newline separated.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legacy Support</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                The original Go implementation (<code>main.go</code>) is preserved in the repository as a backup reference.
                The current system runs on Vercel Edge/Serverless infrastructure using Next.js and Vercel KV.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
