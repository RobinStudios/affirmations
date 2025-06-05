import type { ReactNode } from 'react';
import { Header } from './header';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built with ❤️ by Firebase Studio.
          </p>
        </div>
      </footer>
    </>
  );
}
