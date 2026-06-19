'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedLessonsLight({ lessons = [] }) {
  // Use dynamic lessons data, slice up to 3, fallback to default mock lessons if database has none
  const fallbackLessons = [
    {
      title: "The Art of Graceful Failure",
      description: "Learning how to fail without losing your momentum is perhaps the most critical skill for any entrepreneur.",
      category: "Resilience",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=250&q=80",
      author: {
        name: "Elena Vance",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
      },
      readTime: "8 min read"
    },
    {
      title: "Deep Work in a Shallow World",
      description: "In an age of constant notification, reclaiming your focus is an act of rebellion. Here is how I restructured my day.",
      category: "Focus",
      coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&h=250&q=80",
      author: {
        name: "Marcus Thorne",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
      },
      readTime: "12 min read"
    },
    {
      title: "The Compound Effect of Habit",
      description: "Small decisions don't look like much in the moment, but over a decade, they become your entire destiny.",
      category: "Growth",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&h=250&q=80",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
      },
      readTime: "5 min read"
    }
  ];

  const displayedLessons = lessons.length > 0 ? lessons.slice(0, 3) : fallbackLessons;

  // Category badge color selector
  const getCategoryStyles = (category) => {
    return 'bg-[#E2E8F0] text-[#27374D] border-[#E2E8F0] dark:bg-[#27374D]/40 dark:text-[#9DB2BF] dark:border-[#27374D]/50';
  };

  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div className="space-y-2 text-left">
          <h2 className="text-sm font-extrabold tracking-wider text-[#27374D] uppercase">
            Featured Lessons
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-headline">
            The most impactful insights from the last week.
          </p>
        </div>
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#27374D] dark:text-[#9DB2BF] hover:text-[#526D82] dark:hover:text-white transition-colors self-start sm:self-auto group"
        >
          View All
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedLessons.map((lesson, idx) => (
          <motion.article
            key={lesson._id || idx}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm hover:shadow-xl dark:shadow-none hover:border-zinc-200 dark:hover:border-zinc-700 overflow-hidden group transition-all"
          >
            {/* Cover Image */}
            <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
              <img
                src={lesson.coverImage}
                alt={lesson.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Content Container */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-3 text-left">
                <div>
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getCategoryStyles(lesson.category)}`}>
                    {lesson.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#27374D] dark:group-hover:text-blue-400 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-body leading-relaxed line-clamp-3">
                  {lesson.description}
                </p>
              </div>

              {/* Author & Read Time footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <img
                      src={lesson.author?.avatar}
                      alt={lesson.author?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {lesson.author?.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 font-body">
                  {lesson.readTime}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
