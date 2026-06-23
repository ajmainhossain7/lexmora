'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { getTopContributors, getMostSavedLessons } from '@/lib/api/lessons';

export default function ContributorsAndSaved() {
  const [contributors, setContributors] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contributorsData, savedLessonsData] = await Promise.all([
          getTopContributors(),
          getMostSavedLessons()
        ]);
        if (contributorsData) setContributors(contributorsData);
        if (savedLessonsData) setSavedLessons(savedLessonsData);
      } catch (err) {
        console.error('Error fetching homepage dynamic data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/10 animate-pulse">
                  <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800/80 flex-shrink-0" />
                  <div className="flex-grow space-y-2">
                    <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-855/80 rounded" />
                    <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-855/80 rounded" />
                  </div>
                </div>
              ))
            ) : contributors.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">No contributors found.</p>
            ) : (
              contributors.map((c, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/10 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold uppercase text-lg">
                          {c.name ? c.name[0] : '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-950 dark:text-white text-base">
                          {c.name}
                        </span>
                        {c.verified && (
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white p-0.5" title="Verified Contributor">
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
              ))
            )}
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
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start animate-pulse">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex-shrink-0" />
                      <div className="flex-grow space-y-2">
                        <div className="h-3 w-1/4 bg-zinc-800 rounded" />
                        <div className="h-5 w-3/4 bg-zinc-800 rounded" />
                      </div>
                    </div>
                  ))
                ) : savedLessons.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic">No saved lessons found.</p>
                ) : (
                  savedLessons.map((l, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 flex-shrink-0">
                        <Bookmark className="w-4 h-4 fill-zinc-400/10" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
                          SAVED {l.savesCount !== undefined ? l.savesCount : (l.saves || 0)} TIMES
                        </span>
                        <Link href={`/lessons/${l._id}`}>
                          <span className="text-base font-bold text-white mt-1 hover:text-blue-400 transition-colors cursor-pointer block">
                            {l.title}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
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
