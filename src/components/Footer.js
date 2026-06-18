'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-50 dark:bg-[#070913] border-t border-zinc-200/50 dark:border-zinc-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                Lexmora
              </span>
            </Link>
            <p className="text-sm text-secondary-brand dark:text-tertiary-brand max-w-xs leading-relaxed">
              The intersection of productivity and storytelling. Curating the world's wisdom for those who never stop learning.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-headline text-sm font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/feed" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-headline text-sm font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us / Social Icons */}
          <div>
            <h3 className="font-headline text-sm font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              Follow Us
            </h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="Community"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-zinc-200/50 dark:border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-custom dark:text-zinc-500">
            &copy; {currentYear} Lexmora. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-custom dark:text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}