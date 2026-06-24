'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, CornerDownRight, ArrowRight, Frown, Sparkles, Heart, Lock } from 'lucide-react';
import { Button, Pagination } from '@heroui/react';
import Link from 'next/link';
import { getLessons } from '@/lib/api/lessons';
import { useSession } from '@/lib/auth-client';

const categories = ['All', 'Resilience', 'Focus', 'Growth', 'Strategy', 'Relationships', 'Finance'];
const emotionalTones = ['All', 'Hopeful', 'Resilient', 'Reflective', 'Motivated', 'Grateful'];

export default function Lessons() {
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTone, setSelectedTone] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title-asc, title-desc
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    if (mounted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, mounted]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedTone]);

  // Fetch lessons when search, category, tone, sortBy, or page changes
  useEffect(() => {
    async function fetchLessonsData() {
      setLoading(true);
      try {
        const data = await getLessons({
          search,
          category: selectedCategory,
          emotionalTone: selectedTone,
          sortBy,
          page,
          perPage,
        });
        if (data && data.lessons) {
          setLessons(data.lessons);
          setTotal(data.total);
        } else {
          setLessons(Array.isArray(data) ? data : []);
          setTotal(Array.isArray(data) ? data.length : 0);
        }
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setLessons([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search input to avoid hitting backend on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchLessonsData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedTone, sortBy, page]);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  // Lessons are sorted server-side
  const sortedLessons = lessons;

  const totalPages = Math.ceil(total / perPage);

  const getCategoryStyles = (category) => {
    return 'bg-[#E2E8F0] text-[#27374D] border-[#E2E8F0] dark:bg-[#27374D]/40 dark:text-[#9DB2BF] dark:border-[#27374D]/50';
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedTone('All');
    setSortBy('newest');
  };

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-transparent">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/20 blur-[120px]" />
          </>
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Header */}
        <div className="space-y-4 mb-12 text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#27374D]/10 dark:bg-blue-500/10 text-[#27374D] dark:text-blue-400 border border-[#27374D]/20 dark:border-blue-500/20 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Wisdom
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white font-headline tracking-tight">
            The Public <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Lessons Feed</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            Browse through insights, experiences, and breakthroughs shared by thinkers, creators, and professionals worldwide.
          </p>
        </div>

        {/* Controls: Search, Category pills, Sorting */}
        <div className="bg-white/60 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-6 mb-10 shadow-sm backdrop-blur-md space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-grow max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="search-lessons"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lessons by title or keyword..."
                aria-label="Search lessons by title or keyword"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-sm font-body text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-450 dark:focus:border-zinc-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <label htmlFor="sort-select" className="flex items-center gap-1.5 text-zinc-500 text-sm font-semibold cursor-pointer">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-sm font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-saved">Most Saved</option>
                <option value="title-asc">Title: A-Z</option>
                <option value="title-desc">Title: Z-A</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-left">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter by Category
            </div>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 active:scale-95 ${isActive
                      ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600 dark:text-white dark:border-blue-600 shadow-md shadow-zinc-900/10 dark:shadow-blue-500/10'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/30'
                      }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotional Tone Filter Pills */}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-left">
              <CornerDownRight className="w-3.5 h-3.5" />
              Filter by Tone
            </div>
            <div className="flex flex-wrap gap-2.5">
              {emotionalTones.map((tone) => {
                const isActive = selectedTone === tone;
                const toneColorMap = {
                  Hopeful: 'hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400',
                  Resilient: 'hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400',
                  Reflective: 'hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400',
                  Motivated: 'hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400',
                  Grateful: 'hover:border-pink-400 hover:text-pink-600 dark:hover:text-pink-400',
                };
                const activeColorMap = {
                  Hopeful: 'bg-emerald-600 text-white border-emerald-600',
                  Resilient: 'bg-blue-600 text-white border-blue-600',
                  Reflective: 'bg-purple-600 text-white border-purple-600',
                  Motivated: 'bg-orange-500 text-white border-orange-500',
                  Grateful: 'bg-pink-500 text-white border-pink-500',
                  All: 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100',
                };
                return (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 active:scale-95 ${isActive
                      ? (activeColorMap[tone] || 'bg-zinc-900 text-white border-zinc-900')
                      : `bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800/80 ${toneColorMap[tone] || ''}`
                      }`}
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Section: Cards Grid or Skeletons / Empty state */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <LessonsGridSkeleton key="skeleton" />
            ) : sortedLessons.length > 0 ? (
              <>
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {sortedLessons.map((lesson, idx) => {
                    const isPremiumUser = session?.user?.plan === 'user_premium' || session?.user?.role === 'admin';
                    const isPremiumLesson = lesson.isPremium === true || (lesson.accessLevel && lesson.accessLevel.toLowerCase() === 'premium');
                    const isCardLocked = isPremiumLesson && !isPremiumUser;

                    return (
                      <motion.article
                        key={lesson._id || idx}
                        whileHover={isCardLocked ? {} : { y: -6 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm hover:shadow-xl dark:shadow-none hover:border-zinc-200 dark:hover:border-zinc-700 overflow-hidden group transition-all relative"
                      >
                        {isCardLocked && (
                          <div 
                            onClick={() => router.push('/plans')}
                            className="absolute inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 z-10 text-white select-none cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                              <Lock className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <span className="font-extrabold text-sm uppercase tracking-wide text-amber-400 font-headline text-center max-w-[220px]">
                              Premium Lesson – Upgrade to view
                            </span>
                            <button
                              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 rounded-lg text-xs font-extrabold transition shadow-md shadow-amber-500/20 font-headline cursor-pointer"
                            >
                              Upgrade Plan
                            </button>
                          </div>
                        )}

                        {/* Cover Image */}
                        <Link href={`/lessons/${lesson._id}`} className="block">
                          <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                            <img
                              src={lesson.coverImage}
                              alt={lesson.title}
                              className={`w-full h-full object-cover ${isCardLocked ? 'filter blur-sm' : 'group-hover:scale-105'} transition-transform duration-500`}
                              loading="lazy"
                            />
                            {/* Premium badge */}
                            {isPremiumLesson && (
                              <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                                <span>⭐</span> Premium
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Content Container */}
                        <div className={`p-6 flex-grow flex flex-col justify-between space-y-6 ${isCardLocked ? 'filter blur-[3px] select-none pointer-events-none' : ''}`}>
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
                            <div className="flex items-center gap-3">
                              {((typeof lesson.likes === 'number' && lesson.likes > 0) || (Array.isArray(lesson.likes) && lesson.likes.length > 0)) && (
                                <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                                  <Heart className="w-3.5 h-3.5" /> {typeof lesson.likes === 'number' ? lesson.likes : lesson.likes.length}
                                </span>
                              )}
                              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 font-body">
                                {lesson.readTime}
                              </span>
                            </div>
                          </div>

                          {/* CTA */}
                          <Link
                            href={`/lessons/${lesson._id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all group/cta"
                          >
                            Read Lesson <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>

                {/* Image-17acd8.png & Image-175a03.png Custom Split Pagination Alignment Footer */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 mb-6 w-full px-2 font-body">
                    {/* Left side info block - Fixed responsive wrap */}
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                      Showing {Math.min((page - 1) * perPage + 1, total)}-{Math.min(page * perPage, total)} of {total} results
                    </div>

                    {/* Right side pagination structure - Fixed React Aria DOM Prop leak */}
                    <Pagination
                      value={page}
                      onChange={(p) => setPage(p)}
                      className="bg-transparent"
                    >
                      <Pagination.Content className="gap-1 bg-transparent shadow-none">
                        {/* Previous Button */}
                        <Pagination.Item>
                          <Pagination.Previous
                            isDisabled={page === 1}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="bg-transparent text-zinc-600 dark:text-zinc-400 border-none shadow-none hover:bg-transparent text-sm px-2 font-semibold"
                          />
                        </Pagination.Item>

                        {/* Pagination Items & Truncation logic block */}
                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageNumber = index + 1;

                          // Sliding window config for ellipsis representation
                          if (
                            totalPages > 5 &&
                            pageNumber !== 1 &&
                            pageNumber !== totalPages &&
                            Math.abs(pageNumber - page) > 1
                          ) {
                            if (pageNumber === 2 && page > 3) {
                              return (
                                <Pagination.Item key="ellipsis-start">
                                  <span className="text-zinc-400 dark:text-zinc-600 text-sm min-w-6 text-center select-none">...</span>
                                </Pagination.Item>
                              );
                            }
                            if (pageNumber === totalPages - 1 && page < totalPages - 2) {
                              return (
                                <Pagination.Item key="ellipsis-end">
                                  <span className="text-zinc-400 dark:text-zinc-600 text-sm min-w-6 text-center select-none">...</span>
                                </Pagination.Item>
                              );
                            }
                            return null;
                          }

                          return (
                            <Pagination.Item key={pageNumber}>
                              <Pagination.Link
                                isActive={page === pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`min-w-9 h-9 transition-colors rounded-full font-semibold text-sm flex items-center justify-center cursor-pointer ${page === pageNumber
                                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold"
                                    : "bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                                  }`}
                              >
                                {pageNumber}
                              </Pagination.Link>
                            </Pagination.Item>
                          );
                        })}

                        {/* Next Button */}
                        <Pagination.Item>
                          <Pagination.Next
                            isDisabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className="bg-transparent text-zinc-600 dark:text-zinc-400 border-none shadow-none hover:bg-transparent text-sm px-2 font-semibold"
                          />
                        </Pagination.Item>
                      </Pagination.Content>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center text-center p-12 sm:p-20 bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/40 dark:border-zinc-900/60 rounded-3xl backdrop-blur-sm max-w-xl mx-auto space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <Frown className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white font-headline">
                    No Lessons Found
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 font-body text-sm max-w-xs mx-auto leading-relaxed">
                    We couldn't find any lessons matching "{search}" in the category "{selectedCategory}".
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={handleClearFilters}
                    className="bg-zinc-900 text-white dark:bg-blue-600 dark:text-white font-semibold text-sm px-6 py-5 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Skeletons for Loading Grid State
function LessonsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden h-[420px] space-y-6 p-6">
          <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
}