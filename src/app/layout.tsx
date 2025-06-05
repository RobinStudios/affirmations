import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Affirmation Oasis',
  description: 'Your daily dose of positivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
