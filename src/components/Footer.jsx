'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-50 dark:bg-[#070913] border-t border-zinc-200/50 dark:border-zinc-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo, Description & Contact Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                  Lexmora
                </span>
              </Link>
              <p className="text-sm text-secondary-brand dark:text-tertiary-brand leading-relaxed">
                The intersection of productivity and storytelling. Curating the world's wisdom for those who never stop learning.
              </p>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-2.5 text-sm text-secondary-brand dark:text-tertiary-brand">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400" />
                <a href="mailto:support@lexmora.com" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  support@lexmora.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-400" />
                <a href="tel:+15551234567" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
                <span>123 Wisdom Ave, Silicon Valley, CA</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-headline text-sm font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/lessons" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Public Lessons
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
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
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Terms & Conditions
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
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
              {/* New X (Twitter) Logo */}
              <a
                href="#"
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
                aria-label="Community"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary-brand dark:text-tertiary-brand hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
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
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
