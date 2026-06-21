'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: "Is LifeLessons free to use?",
      answer: "Yes, you can read public lessons and share your own experiences for free. We also offer a premium plan with advanced features like AI insights, private journals, and offline reading."
    },
    {
      question: "Can I keep my lessons private?",
      answer: "Absolutely. You can choose to save lessons as private drafts or in your private reflection vault, encrypted so only you can access them. You control your level of sharing."
    },
    {
      question: "How do I export my data?",
      answer: "You can download all your written lessons, bookmarks, and account analytics at any time from your settings dashboard in standard formats like JSON or Markdown."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-headline">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-[#F8FAFC] dark:bg-zinc-900/40 shadow-sm overflow-hidden"
            >
              <button
                id={`faq-btn-${idx}`}
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${idx}`}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-base sm:text-lg text-zinc-900 dark:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:z-10 cursor-pointer"
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-zinc-500"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-content-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-zinc-500 dark:text-zinc-400 font-body text-sm sm:text-base leading-relaxed border-t border-zinc-50 dark:border-zinc-900/60">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
