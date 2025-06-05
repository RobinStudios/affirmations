"use client";

import React, { type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AppProvider } from '@/contexts/app-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>
  );
}
