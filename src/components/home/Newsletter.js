'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import toast from 'react-hot-toast';

export default function Newsletter({ isDark }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast.success('Successfully subscribed to Weekly Wisdom!');
      setEmail('');
    }, 1200);
  };

  const title = isDark ? "Weekly Wisdom in your Inbox" : "Weekly Wisdom in Your In-box";
  const desc = isDark
    ? "Get the most popular life lessons delivered every Monday morning. No spam, just pure growth."
    : "Join 50,000+ subscribers who get our curated 'Life Lesson of the Week' every Sunday morning.";

  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-md p-8 sm:p-12 text-center shadow-lg">
        {/* Glow Behind */}
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
          {isDark ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[100px]" />
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[100px]" />
          )}
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className={`text-2xl sm:text-3xl font-extrabold font-headline ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {title}
          </h2>
          <p className={`text-sm sm:text-base font-body max-w-lg mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {desc}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`flex-grow px-4 py-3 rounded-lg border text-sm font-body focus:outline-none transition-all ${
                isDark
                  ? "bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700"
                  : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400"
              }`}
            />
            <Button
              type="submit"
              isLoading={loading}
              className={`font-semibold px-6 py-3 rounded-lg text-sm shadow-md transition-all active:scale-95 flex items-center justify-center ${
                isDark
                  ? "bg-white text-zinc-950 hover:bg-zinc-100"
                  : "bg-[#27374D] text-white hover:bg-[#1f2b3c]"
              }`}
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
