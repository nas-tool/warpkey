'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLocaleChange('en')}
        disabled={isPending}
        className={cn("w-10", locale === 'en' && "bg-primary text-primary-foreground")}
      >
        EN
      </Button>
      <Button
        variant={locale === 'zh' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLocaleChange('zh')}
        disabled={isPending}
        className={cn("w-10", locale === 'zh' && "bg-primary text-primary-foreground")}
      >
        中
      </Button>
    </div>
  );
}
