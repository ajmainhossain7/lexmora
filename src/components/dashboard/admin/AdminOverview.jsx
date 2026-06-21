'use client';

import { Users, BookOpen, Award, DollarSign, Sparkles, Flag } from 'lucide-react';

export default function AdminOverview({ stats }) {
  return (
    <div className="space-y-8">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Users</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalLessons || 0}</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">{stats?.publicLessons || 0} Pub / {stats?.privateLessons || 0} Priv</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Premium Members</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.premiumUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Revenue</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">৳{stats?.totalRevenue || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-650 dark:text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Today's Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.todayLessons || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 animate-fade-in animate-duration-300">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-450 shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Reported Flags</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalReports || 0}</h3>
          </div>
        </div>
      </div>

      {/* Center Section: Charts and Active Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Trends Chart (User & Lesson) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-6">User Registration & Lessons Growth Trend</h3>
          {(!stats?.userGrowth || stats.userGrowth.length === 0) ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-slate-400">
              No growth trend data available yet.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Users monthly bars */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Registrations (Monthly)</h4>
                <div className="flex items-end gap-3 h-28 pt-2">
                  {stats.userGrowth.map((g, idx) => {
                    const maxVal = Math.max(...stats.userGrowth.map(x => x.count), 1);
                    const heightPercent = (g.count / maxVal) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-7 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                          {g.count} users
                        </div>
                        <div 
                          className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-500" 
                          style={{ height: `${Math.max(8, heightPercent)}%` }}
                        />
                        <span className="text-[10px] text-slate-450 dark:text-zinc-500 mt-1 truncate max-w-full">
                          {g._id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lessons monthly bars */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lessons Uploads (Monthly)</h4>
                <div className="flex items-end gap-3 h-28 pt-2">
                  {stats.lessonGrowth.map((g, idx) => {
                    const maxVal = Math.max(...stats.lessonGrowth.map(x => x.count), 1);
                    const heightPercent = (g.count / maxVal) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-7 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                          {g.count} lessons
                        </div>
                        <div 
                          className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all duration-500" 
                          style={{ height: `${Math.max(8, heightPercent)}%` }}
                        />
                        <span className="text-[10px] text-slate-450 dark:text-zinc-500 mt-1 truncate max-w-full">
                          {g._id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Contributors List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">Top Active Contributors</h3>
          {(!stats?.activeContributors || stats.activeContributors.length === 0) ? (
            <div className="flex-grow flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-slate-400 py-12">
              No contributor stats found.
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              {stats.activeContributors.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-zinc-100 dark:border-zinc-800/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={c.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name || "contributor")}`} 
                      alt="" 
                      className="w-8 h-8 rounded-full bg-slate-100 shrink-0 object-cover" 
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name || c._id}</p>
                      <p className="text-[10px] text-slate-450 dark:text-zinc-500 truncate">{c._id}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400">
                    {c.count} Lessons
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Lessons By Category Distribution */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">Lessons Distribution By Category</h3>
        {(!stats?.lessonsByCategory || stats.lessonsByCategory.length === 0) ? (
          <div className="p-8 text-center text-slate-400">No lessons category data.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.lessonsByCategory.map((c, idx) => {
              const totalLessons = stats.totalLessons || 1;
              const pct = (c.count / totalLessons) * 100;
              return (
                <div key={idx} className="space-y-1 p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-zinc-150 dark:border-zinc-800/60 rounded-xl">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-zinc-350">{c._id}</span>
                    <span className="text-indigo-650 dark:text-indigo-400">{c.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800/60 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
