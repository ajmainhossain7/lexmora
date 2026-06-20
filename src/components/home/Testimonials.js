'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      stars: 5,
      quote: "LifeLessons changed how I think about my daily commute. Instead of scrolling social media, I'm reflecting on what the day taught me. It's the most high-ROI app on my phone.",
      name: "Alex Rivera",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      stars: 5,
      quote: "The community here is unlike any other platform. It's focused, respectful, and incredibly deep. I've learned more about emotional intelligence here than in ten years of corporate training.",
      name: "Samantha Reed",
      role: "Clinical Psychologist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-headline">
          What Learners Are Saying
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((r, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="p-8 bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between space-y-6 text-left relative"
          >
            {/* Quote marks and stars */}
            <div className="space-y-4">
              <div className="flex gap-1 text-[#27374D] dark:text-[#9DB2BF]">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#27374D] dark:fill-[#9DB2BF] stroke-none" />
                ))}
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 font-body leading-relaxed text-base sm:text-lg italic">
                &ldquo;{r.quote}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-zinc-50 dark:border-zinc-800/80">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-950 dark:text-white font-bold text-sm">
                  {r.name}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-body">
                  {r.role}
                </span>
              </div>
            </div>

            {/* Corner Decorative Brackets (from Figma style) */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-zinc-200 dark:border-zinc-800 pointer-events-none rounded-tl-sm" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-zinc-200 dark:border-zinc-800 pointer-events-none rounded-br-sm" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
