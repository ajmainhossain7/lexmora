'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { Button } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/40 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1">
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                Life<span className="text-blue-500 dark:text-blue-400 font-semibold">Lessons</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-8 h-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.label} className="relative flex items-center h-full">
                  <Link
                    href={item.href}
                    className={`text-sm font-semibold transition-colors duration-200 ${isActive
                        ? 'text-zinc-950 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-900 dark:bg-blue-500 rounded-t-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions: Theme Toggle & Auth Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
            >
              Login
            </Link>
            <Button
              as={Link}
              href="/signup"
              color="primary"
              className="bg-zinc-900 text-white dark:bg-blue-600 dark:text-white font-semibold text-sm px-5 py-2 h-9 rounded-md transition-all hover:bg-zinc-800 dark:hover:bg-blue-500"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0D1A] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-semibold transition-all ${isActive
                        ? 'text-zinc-950 dark:text-white bg-zinc-50 dark:bg-zinc-900'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col gap-2">
                <Button
                  as={Link}
                  href="/login"
                  variant="bordered"
                  className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-md font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  href="/signup"
                  className="w-full bg-zinc-900 text-white dark:bg-blue-600 dark:text-white rounded-md font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
