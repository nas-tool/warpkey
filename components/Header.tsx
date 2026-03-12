import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  const t = useTranslations('Header');

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          {t('title')}
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
              {t('home')}
            </Link>
            <Link href="/about" className={cn(buttonVariants({ variant: "ghost" }))}>
              {t('about')}
            </Link>
            <Link href="/api" className={cn(buttonVariants({ variant: "ghost" }))}>
              {t('api')}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
