'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return <Button isIconOnly variant="light" className="w-10 h-10 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full" aria-label="Loading Theme" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      isIconOnly
      variant="light"
      className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -15, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 15, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-650" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
