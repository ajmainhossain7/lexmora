'use client';

import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function UpgradeCTA() {
  return (
    <section className="py-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        whileHover={{ scale: 1.002 }}
        className="rounded-2xl bg-gradient-to-r from-[#0B0F19] via-[#111827] to-[#1E1B4B] border border-zinc-900 p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-left shadow-2xl"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

        <div className="space-y-4 max-w-2xl z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Limited Offer
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
            Unlock Infinite Wisdom
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-body leading-relaxed">
            Join 15,000+ premium members and get access to exclusive lessons, offline reading, and AI-powered journaling assistants.
          </p>
        </div>

        <div className="z-10 flex-shrink-0">
          <Button
            as={Link}
            href="/plans"
            className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold px-8 py-6 rounded-lg text-base shadow-xl shadow-white/5 transition-all hover:scale-[1.02] flex items-center justify-center"
          >
            Upgrade to Pro
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
