'use client';

import { motion } from 'framer-motion';
import { PenTool, Users, TrendingUp, Shield } from 'lucide-react';

export default function WhyLearning() {
  const points = [
    {
      title: "Crystallize Thought",
      description: "Turn fleeting moments into permanent, searchable records of wisdom.",
      icon: PenTool
    },
    {
      title: "Collective Insight",
      description: "Access a global library of experiences shared by thinkers worldwide.",
      icon: Users
    },
    {
      title: "Track Growth",
      description: "Visualize your evolution over time with integrated reflection analytics.",
      icon: TrendingUp
    },
    {
      title: "Private Safekeeping",
      description: "State-of-the-art encryption ensures your private reflections stay yours.",
      icon: Shield
    }
  ];

  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-zinc-950/20 rounded-3xl border border-zinc-100 dark:border-zinc-900/60 my-10">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-headline">
          Why Learning From Life Matters
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-body leading-relaxed text-base sm:text-lg">
          Traditional education ends, but life lessons are continuous. We help you synthesize experience into actionable wisdom.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {points.map((point, index) => {
          const IconComponent = point.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-center flex flex-col items-center space-y-4"
            >
              <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-[#27374D] dark:text-[#9DB2BF] shadow-sm">
                <IconComponent className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {point.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-body leading-relaxed max-w-[220px]">
                {point.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
