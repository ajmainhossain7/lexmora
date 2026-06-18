'use client';

import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </>
  );
}
