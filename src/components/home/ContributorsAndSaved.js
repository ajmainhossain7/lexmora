'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function ContributorsAndSaved() {
  const contributors = [
    {
      name: "Julian Casablancas",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      lessonsShared: 42,
      verified: true
    },
    {
      name: "Margot Robbie",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      lessonsShared: 38,
      verified: true
    },
    {
      name: "Dr. Andrew Huberman",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
      lessonsShared: 31,
      verified: false
    },
    {
      name: "Sahar Rose",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
      lessonsShared: 29,
      verified: false
    }
  ];

  const savedLessons = [
    {
      saves: "2.4K",
      title: "10 Simple Truths About Human Nature"
    },
    {
      saves: "1.9K",
      title: "The Weekend Recovery Protocol"
    },
    {
      saves: "1.7K",
      title: "Financial Wisdom I Wish I Knew at 20"
    }
  ];

  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

        {/* Left Column: Top Contributors */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
              Top Contributors
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-body">
              Active curators who have shared the most wisdom in our collective database.
            </p>
          </div>

          <div className="space-y-4 flex-grow pt-4">
            {contributors.map((c, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/10 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-950 dark:text-white text-base">
                        {c.name}
                      </span>
                      {c.verified && (
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white p-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-zinc-500 text-xs font-body">
                      {c.lessonsShared} Lessons Shared
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Most Saved Lessons */}
        <div className="lg:col-span-6 flex">
          <div className="w-full rounded-2xl bg-[#0B0F19] dark:bg-zinc-950/40 border border-zinc-900 dark:border-zinc-800/80 p-8 sm:p-10 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white font-headline">
                  Most Saved Lessons
                </h2>
                <p className="text-zinc-500 text-sm font-body">
                  The highest value lessons saved by community members for reference.
                </p>
              </div>

              <div className="space-y-6 pt-4 border-t border-zinc-900">
                {savedLessons.map((l, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 flex-shrink-0">
                      <Bookmark className="w-4 h-4 fill-zinc-400/10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
                        SAVED {l.saves} TIMES
                      </span>
                      <span className="text-base font-bold text-white mt-1 hover:text-blue-400 transition-colors cursor-pointer">
                        {l.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-900 mt-6">
              <Link
                href="/lessons"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-400 transition-colors group/link"
              >
                View Leaderboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
