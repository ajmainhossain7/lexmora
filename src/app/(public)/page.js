'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { getFeaturedLessons } from '@/lib/api/lessons';

// Modular Home Sections
import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedLessons from '@/components/home/FeaturedLessons';

const WhyLearning = dynamic(() => import('@/components/home/WhyLearning'), {
  loading: () => <div className="py-12 text-center text-slate-500 animate-pulse">Loading benefits...</div>
});
const ContributorsAndSaved = dynamic(() => import('@/components/home/ContributorsAndSaved'), {
  loading: () => <div className="py-12 text-center text-slate-500 animate-pulse">Loading stats...</div>
});
const UpgradeCTA = dynamic(() => import('@/components/home/UpgradeCTA'), {
  loading: () => <div className="py-12 text-center text-slate-500 animate-pulse">Loading...</div>
});
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="py-12 text-center text-slate-500 animate-pulse">Loading testimonials...</div>
});
const FAQ = dynamic(() => import('@/components/home/FAQ'), {
  loading: () => <div className="py-12 text-center text-slate-500 animate-pulse">Loading FAQ...</div>
});
const Newsletter = dynamic(() => import('@/components/home/Newsletter'), {
  loading: () => <div className="py-12 text-center text-slate-500 animate-pulse">Loading newsletter...</div>
});

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Dynamic Featured Lessons State
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchFeaturedLessons() {
      try {
        const data = await getFeaturedLessons();
        if (data) {
          setLessons(data);
        }
      } catch (err) {
        console.error('Error fetching featured lessons:', err);
      } finally {
        setLoadingLessons(false);
      }
    }
    fetchFeaturedLessons();
  }, []);

  // Default to dark theme for server rendering to maintain consistency
  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <div className="w-full flex flex-col">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Dynamic Content Sections */}
      {mounted && (
        <div className="w-full transition-colors duration-300">
          {loadingLessons ? (
            <LessonsSkeleton />
          ) : (
            <FeaturedLessons lessons={lessons} />
          )}
          <WhyLearning />
          <ContributorsAndSaved />
          <UpgradeCTA />
          <Testimonials />
          <FAQ />
          <Newsletter isDark={isDark} />
        </div>
      )}
    </div>
  );
}

// Skeletons for Loading State
function LessonsSkeleton() {
  return (
    <div className="py-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-10 w-96 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
        <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden h-[420px] space-y-6 p-6">
            <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
