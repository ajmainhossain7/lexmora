'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </ThemeProvider>
  );
}
