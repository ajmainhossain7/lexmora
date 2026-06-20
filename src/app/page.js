'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Modular Home Sections
import FeaturedLessons from '../components/home/FeaturedLessons';
import WhyLearning from '../components/home/WhyLearning';
import ContributorsAndSaved from '../components/home/ContributorsAndSaved';
import UpgradeCTA from '../components/home/UpgradeCTA';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import Newsletter from '../components/home/Newsletter';

const slidesData = [
  {
    darkTitle: "Wisdom for the Modern Professional.",
    lightTitle: "Every Lesson Shapes a Better Life",
    darkDesc: "Curated life lessons from global thinkers, condensed into actionable insights for your personal and professional growth.",
    lightDesc: "Capture wisdom, preserve experiences, and grow through shared lessons. Join a community dedicated to intentional living and lifelong learning.",
    darkBtnPrimary: "Start Reading",
    lightBtnPrimary: "Start Writing",
    btnPrimaryHref: "/lessons",
    darkBtnSecondary: "Explore Feed",
    lightBtnSecondary: "Explore Lessons",
    btnSecondaryHref: "/lessons",
    badgeLabel: "New Lesson",
    badgeTitle: "Deep Work Rituals",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    badgeIconType: "zap"
  },
  {
    darkTitle: "Learn from Real Experiences.",
    lightTitle: "Insights from Real Creators",
    darkDesc: "Discover raw, unfiltered perspectives from founders, artists, and creators who have walked the path of growth before you.",
    lightDesc: "Unlock the real stories, major failures, and key breakthroughs shared by thinkers, builders, and artists around the globe.",
    darkBtnPrimary: "Explore Feed",
    lightBtnPrimary: "Share Lesson",
    btnPrimaryHref: "/lessons",
    darkBtnSecondary: "Join Community",
    lightBtnSecondary: "Join Free",
    btnSecondaryHref: "/signup",
    badgeLabel: "Trending Now",
    badgeTitle: "The Art of Essentialism",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badgeIconType: "sparkles"
  },
  {
    darkTitle: "Elevate Your Growth Journey.",
    lightTitle: "Track Your Cognitive Progress",
    darkDesc: "Track your cognitive and emotional evolution with our analytics dashboard, curated wisdom paths, and private reflection vaults.",
    lightDesc: "Visualize your personal growth over time with integrated reflection metrics, saved wisdom bookmarks, and streak achievements.",
    darkBtnPrimary: "Go to Dashboard",
    lightBtnPrimary: "View Analytics",
    btnPrimaryHref: "/dashboard",
    darkBtnSecondary: "Start Free",
    lightBtnSecondary: "Explore Features",
    btnSecondaryHref: "/pricing",
    badgeLabel: "Weekly Progress",
    badgeTitle: "85% Completed",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badgeIconType: "trendingUp"
  }
];

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef(null);

  // Dynamic Featured Lessons State
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchFeaturedLessons() {
      try {
        const res = await fetch('http://localhost:5000/api/lessons/featured');
        if (res.ok) {
          const data = await res.json();
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

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000); // Change slide every 6 seconds
  };

  // Auto-play mechanism
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [currentSlide]);

  // Default to dark theme for server rendering to maintain consistency with dark mode layout
  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const currentSlideData = slidesData[currentSlide];

  // Helper to render dynamic badges
  const renderBadgeIcon = (type) => {
    switch (type) {
      case 'zap':
        return <Zap className="w-5 h-5 fill-blue-400/20" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 fill-amber-400/20" />;
      case 'trendingUp':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Carousel Section */}
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-transparent overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          {isDark ? (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
            </>
          ) : (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/20 blur-[120px]" />
            </>
          )}
        </div>

        {/* Main Slider Content Area */}
        <div 
          className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex-grow flex items-center relative"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full border border-zinc-200/50 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all shadow-lg hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full border border-zinc-200/50 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all shadow-lg hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Carousel Container */}
          <div className="w-full relative px-8 sm:px-12">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide + '_' + (isDark ? 'dark' : 'light')}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full"
              >
                {/* Left Column: Content */}
                <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8 text-left">
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-zinc-tight leading-tight text-zinc-900 dark:text-white font-headline">
                      {isDark ? (
                        <>
                          {currentSlideData.darkTitle.split(' ').slice(0, -2).join(' ')}{' '}
                          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {currentSlideData.darkTitle.split(' ').slice(-2).join(' ')}
                          </span>
                        </>
                      ) : (
                        <>
                          {currentSlideData.lightTitle.split(' ').slice(0, -2).join(' ')}{' '}
                          <span className="bg-gradient-to-r from-[#27374D] to-[#526D82] bg-clip-text text-transparent">
                            {currentSlideData.lightTitle.split(' ').slice(-2).join(' ')}
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-body max-w-xl leading-relaxed">
                      {isDark ? currentSlideData.darkDesc : currentSlideData.lightDesc}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <Button
                      as={Link}
                      href={currentSlideData.btnPrimaryHref}
                      className={`font-semibold px-8 py-6 rounded-lg text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        isDark
                          ? "bg-white text-zinc-950 hover:bg-zinc-100 shadow-white/5 hover:scale-[1.02]"
                          : "bg-[#27374D] text-white hover:bg-[#1f2b3c] shadow-zinc-900/10 hover:scale-[1.02]"
                      }`}
                    >
                      {isDark ? currentSlideData.darkBtnPrimary : currentSlideData.lightBtnPrimary}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      as={Link}
                      href={currentSlideData.btnSecondaryHref}
                      variant="bordered"
                      className={`font-semibold px-8 py-6 rounded-lg text-base transition-all duration-300 border-2 ${
                        isDark
                          ? "border-zinc-800 text-white hover:bg-zinc-900/40 hover:border-zinc-700"
                          : "border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                      }`}
                    >
                      {isDark ? currentSlideData.darkBtnSecondary : currentSlideData.lightBtnSecondary}
                    </Button>
                  </div>

                  {/* Social Proof (Light Mode Only) */}
                  {!isDark && (
                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                      <div className="flex -space-x-3">
                        {[
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                        ].map((src, i) => (
                          <div key={i} className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-zinc-100 flex items-center justify-center">
                            <img
                              src={src}
                              alt="User avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-zinc-500 font-body">
                        Trusted by <span className="text-zinc-900 font-bold">50,000+</span> lifelong learners
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Column: Visual Hero Artwork */}
                <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl bg-zinc-100 dark:bg-zinc-900/20">
                    <Image
                      src={isDark ? "/hero_dark.png" : "/hero_light.png"}
                      alt="Lexmora wisdom artwork"
                      fill
                      priority
                      sizes="(max-w-7xl) 100vw, 480px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Floating Badge (Dark Mode Only) */}
                    {isDark && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="absolute bottom-6 left-6 p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md shadow-2xl flex items-center gap-3.5"
                      >
                        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${currentSlideData.badgeColor}`}>
                          {renderBadgeIcon(currentSlideData.badgeIconType)}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${currentSlideData.badgeColor.split(' ')[0]}`}>
                            {currentSlideData.badgeLabel}
                          </span>
                          <span className="text-sm font-bold text-white font-headline mt-0.5">
                            {currentSlideData.badgeTitle}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-zinc-900 dark:bg-white"
                  : "w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

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
