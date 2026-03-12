import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          WarpKey
        </Link>
        <nav className="flex gap-4">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
            Home
          </Link>
          <Link href="/about" className={cn(buttonVariants({ variant: "ghost" }))}>
            About
          </Link>
          <Link href="/api/full" target="_blank" className={cn(buttonVariants({ variant: "outline" }))}>
            API (Full)
          </Link>
        </nav>
      </div>
    </header>
  );
}
