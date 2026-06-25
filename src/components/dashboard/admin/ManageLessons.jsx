'use client';

import { BookOpen, EyeOff, Flag, Star, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@heroui/react';

export default function ManageLessons({
  lessonsList,
  reportsList,
  lessonCategoryFilter,
  setLessonCategoryFilter,
  lessonVisibilityFilter,
  setLessonVisibilityFilter,
  lessonStatusFilter,
  setLessonStatusFilter,
  handleToggleFeatured,
  handleToggleReviewed,
  handleDeleteLesson
}) {
  const publicLessonsCount = lessonsList.filter(l => l.visibility === "public").length;
  const privateLessonsCount = lessonsList.filter(l => l.visibility === "private").length;
  const flaggedLessonsCount = [...new Set(reportsList.map(r => r.lessonId))].length;

  const filteredLessons = lessonsList.filter((lesson) => {
    if (lessonCategoryFilter !== "All" && lesson.category !== lessonCategoryFilter) {
      return false;
    }
    if (lessonVisibilityFilter !== "All" && lesson.visibility !== lessonVisibilityFilter) {
      return false;
    }
    if (lessonStatusFilter === "Reviewed" && !lesson.isReviewed) {
      return false;
    }
    if (lessonStatusFilter === "Not Reviewed" && lesson.isReviewed) {
      return false;
    }
    if (lessonStatusFilter === "Flagged") {
      const isFlagged = reportsList.some((report) => report.lessonId === lesson._id);
      if (!isFlagged) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Public Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{publicLessonsCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-650 dark:text-zinc-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Private Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{privateLessonsCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Flagged Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{flaggedLessonsCount}</h3>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Filter & Search Lessons</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Category</label>
            <select
              value={lessonCategoryFilter}
              onChange={(e) => setLessonCategoryFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="All">All Categories</option>
              {["Resilience", "Focus", "Growth", "Strategy", "Relationships", "Finance", "Wellness"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Visibility</label>
            <select
              value={lessonVisibilityFilter}
              onChange={(e) => setLessonVisibilityFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="All">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Status</label>
            <select
              value={lessonStatusFilter}
              onChange={(e) => setLessonStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Not Reviewed">Not Reviewed</option>
              <option value="Flagged">Flagged / Reported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lessons List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Wisdom Lesson Index ({filteredLessons.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/50 dark:border-zinc-850">
                <th className="py-4 px-6">Lesson Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">Featured status</th>
                <th className="py-4 px-6 text-center">Moderation Review</th>
                <th className="py-4 px-6 text-center">Access</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredLessons.map((lesson) => {
                const isFlagged = reportsList.some(r => r.lessonId === lesson._id);
                return (
                  <tr key={lesson._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={lesson.coverImage}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{lesson.title}</h4>
                            {isFlagged && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                                Flagged 🚩
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">By {lesson.authorName || lesson.author?.name || lesson.authorEmail || 'Anonymous'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                        className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          lesson.isFeatured 
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-650"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${lesson.isFeatured ? "fill-current" : ""}`} />
                        {lesson.isFeatured ? "Featured" : "Feature me"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleReviewed(lesson._id, lesson.isReviewed)}
                        className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          lesson.isReviewed 
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-650"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lesson.isReviewed ? "Reviewed" : "Mark Reviewed"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center text-xs font-semibold capitalize">
                      {lesson.accessLevel}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
