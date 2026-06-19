'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@heroui/react';

export default function FeaturedLessonsDark({ lessons = [] }) {
  // Use the first featured lesson from dynamic data, fallback to mockup if none
  const mainLesson = lessons[0] || {
    category: "Deep Strategy",
    title: "The Art of Essentialism",
    description: "How to say no to the trivial many and yes to the vital few. A guide to ruthless prioritization."
  };

  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-2 mb-12 text-left">
        <h2 className="text-sm font-bold tracking-wider text-blue-400 uppercase">
          Featured Lessons
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
          Dive into high-value insights from our community.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Main Lesson (2/3 width) */}
        <motion.div
          whileHover={{ y: -4, scale: 1.005 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-8 relative rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden p-8 sm:p-10 flex flex-col justify-between min-h-[320px] group"
        >
          {/* Wavy Background Graphic */}
          <div className="absolute inset-0 -z-10 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 800 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-100 300 C 150 250, 200 380, 450 300 C 700 220, 750 350, 950 280 L 950 450 L -100 450 Z"
                fill="url(#wave-gradient)"
              />
              <defs>
                <linearGradient id="wave-gradient" x1="400" y1="200" x2="400" y2="450" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e1b4b" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#312e81" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#1e3a8a" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          </div>

          <div className="space-y-4 max-w-xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
              {mainLesson.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {mainLesson.title}
            </h3>
            <p className="text-zinc-400 font-body leading-relaxed text-base sm:text-lg">
              {mainLesson.description}
            </p>
          </div>

          <div className="pt-6">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-400 transition-colors group/link"
            >
              Read Lesson
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Growth Metrics (1/3 width) */}
        <motion.div
          whileHover={{ y: -4, scale: 1.005 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md p-8 flex flex-col justify-between min-h-[320px]"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Growth Metrics</h3>
              <p className="text-zinc-400 text-sm font-body leading-relaxed">
                Track your cognitive growth with personalized analytics.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-zinc-900">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-medium">Weekly Progress</span>
              <span className="text-white font-bold">85%</span>
            </div>
            <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Testimonial Card (1/3 width) */}
        <motion.div
          whileHover={{ y: -4, scale: 1.005 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md p-8 flex flex-col justify-between min-h-[320px]"
        >
          <p className="text-zinc-300 italic font-body leading-relaxed text-base">
            "LifeLessons changed how I approach my morning routine. The insights are pure signal, no noise."
          </p>

          <div className="flex items-center gap-4 pt-6 border-t border-zinc-900">
            <div className="w-11 h-11 rounded-full border-2 border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Sarah Jenkins"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-sm">Sarah Jenkins</span>
              <span className="text-zinc-500 text-xs font-body">Product Lead @ TechFlow</span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Join Community (2/3 width) */}
        <motion.div
          whileHover={{ y: -4, scale: 1.005 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md p-8 sm:p-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-8 min-h-[320px] relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8 z-10 flex-grow">
            {/* Glowing Network Graphic */}
            <div className="w-24 h-24 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center relative flex-shrink-0">
              <Users className="w-10 h-10 text-indigo-400" />
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl animate-pulse" />
              {/* Outer nodes */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-400 border border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-indigo-400 border border-white" />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Join the Community</h3>
              <p className="text-zinc-400 text-sm font-body leading-relaxed max-w-sm">
                Connect with 50k+ learners sharing lessons daily.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end z-10">
            <Button
              as={Link}
              href="/signup"
              className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold px-8 py-5 rounded-lg text-sm shadow-lg shadow-white/5 transition-all hover:scale-[1.02] flex items-center justify-center"
            >
              Join Now
            </Button>
          </div>

          {/* Background Glow */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
