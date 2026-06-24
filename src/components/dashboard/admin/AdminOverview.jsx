'use client';

import { useState } from 'react';
import { Users, BookOpen, Award, DollarSign, Sparkles, Flag } from 'lucide-react';

export default function AdminOverview({ stats }) {
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Category Donut Chart calculations
  const totalCategoryLessons = stats?.lessonsByCategory?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  
  const categoryColors = [
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#F97316'  // Orange
  ];

  const donutData = stats?.lessonsByCategory?.map((c, idx) => {
    const percent = totalCategoryLessons > 0 ? Math.round((c.count / totalCategoryLessons) * 100) : 0;
    return {
      name: c._id,
      count: c.count,
      percent,
      color: categoryColors[idx % categoryColors.length]
    };
  }) || [];

  // Helper functions for SVG Arc Drawing
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  // Monthly Growth Chart calculations
  const monthsSet = new Set();
  stats?.userGrowth?.forEach(g => monthsSet.add(g._id));
  stats?.lessonGrowth?.forEach(g => monthsSet.add(g._id));
  const sortedMonths = Array.from(monthsSet).sort();

  const chartData = sortedMonths.map(month => {
    const userCount = stats?.userGrowth?.find(g => g._id === month)?.count || 0;
    const lessonCount = stats?.lessonGrowth?.find(g => g._id === month)?.count || 0;
    return {
      month,
      userCount,
      lessonCount
    };
  });

  const maxChartVal = Math.max(...chartData.map(d => Math.max(d.userCount, d.lessonCount)), 1);

  const formatMonth = (mStr) => {
    if (!mStr) return "";
    const parts = mStr.split("-");
    if (parts.length < 2) return mStr;
    const yearShort = parts[0].slice(-2);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const monthName = months[monthIdx] || parts[1];
    return `${monthName} '${yearShort}`;
  };

  let currentAccumulatedAngle = 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Users</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-655 dark:text-indigo-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalLessons || 0}</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">{stats?.publicLessons || 0} Pub / {stats?.privateLessons || 0} Priv</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Premium Members</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.premiumUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Revenue</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">৳{stats?.totalRevenue || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-655 dark:text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Today's Lessons</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.todayLessons || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-650 dark:text-rose-400 shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Reported Flags</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalReports || 0}</h3>
          </div>
        </div>
      </div>

      {/* Center Section: SVG Growth Chart & Active Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-headline">User Registration & Lessons Growth Trend</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Platform growth analytics over time</p>
          </div>

          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-slate-400 mt-6">
              No growth trend data available yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {/* Tooltip & Legend Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 h-auto text-xs px-1 select-none">
                {hoveredMonthIdx !== null ? (
                  <div className="flex items-center gap-3 bg-slate-55/60 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 font-semibold font-body animate-fade-in shadow-sm">
                    <span className="text-slate-550 dark:text-zinc-400">{formatMonth(chartData[hoveredMonthIdx].month)}:</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span className="text-slate-900 dark:text-white">{chartData[hoveredMonthIdx].userCount} Users</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      <span className="text-slate-900 dark:text-white">{chartData[hoveredMonthIdx].lessonCount} Lessons</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 font-semibold font-body">Hover over chart bars for monthly details</span>
                )}
                
                <div className="flex items-center gap-4 font-semibold font-body">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400">
                    <span className="w-3 h-1.5 rounded-full bg-blue-500"></span> Users
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400">
                    <span className="w-3 h-1.5 rounded-full bg-indigo-500"></span> Lessons
                  </span>
                </div>
              </div>

              {/* Responsive SVG */}
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 600 240" className="w-full min-w-[500px] h-auto overflow-visible">
                  <defs>
                    <linearGradient id="blueBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                    <linearGradient id="indigoBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = 20 + ratio * 160;
                    const val = Math.round(maxChartVal * (1 - ratio));
                    return (
                      <g key={i} className="opacity-40 dark:opacity-20">
                        <line x1="50" y1={y} x2="570" y2={y} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
                        <text x="40" y={y + 4} textAnchor="end" className="text-[10px] font-bold fill-slate-450 dark:fill-zinc-550">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Columns rendering */}
                  {chartData.map((d, idx) => {
                    const N = chartData.length;
                    const step = 520 / N;
                    const startX = 50 + idx * step;
                    
                    const barWidth = Math.max(8, step * 0.28);
                    const gap = step * 0.08;
                    
                    const hUser = (d.userCount / maxChartVal) * 160;
                    const hLesson = (d.lessonCount / maxChartVal) * 160;
                    
                    const xUser = startX + (step - (barWidth * 2 + gap)) / 2;
                    const xLesson = xUser + barWidth + gap;
                    
                    const yUser = 180 - hUser;
                    const yLesson = 180 - hLesson;

                    return (
                      <g 
                        key={idx}
                        onMouseEnter={() => setHoveredMonthIdx(idx)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                        className="cursor-pointer"
                      >
                        {/* Column Hover BG */}
                        <rect 
                          x={startX} 
                          y="10" 
                          width={step} 
                          height="185" 
                          fill="currentColor" 
                          className="opacity-0 hover:opacity-[0.03] text-slate-900 dark:text-white transition-opacity duration-150 rounded-lg"
                        />

                        {/* User Bar */}
                        <rect
                          x={xUser}
                          y={yUser}
                          width={barWidth}
                          height={Math.max(4, hUser)}
                          fill="url(#blueBarGrad)"
                          rx="3"
                          className="transition-all duration-300 hover:brightness-110"
                        />

                        {/* Lesson Bar */}
                        <rect
                          x={xLesson}
                          y={yLesson}
                          width={barWidth}
                          height={Math.max(4, hLesson)}
                          fill="url(#indigoBarGrad)"
                          rx="3"
                          className="transition-all duration-300 hover:brightness-110"
                        />

                        {/* Month label text */}
                        <text 
                          x={startX + step / 2} 
                          y="205" 
                          textAnchor="middle" 
                          className={`text-[10px] font-bold transition-colors ${hoveredMonthIdx === idx ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold' : 'fill-slate-400 dark:fill-zinc-550'}`}
                        >
                          {formatMonth(d.month)}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Axis Baseline */}
                  <line x1="50" y1="180" x2="570" y2="180" stroke="#E2E8F0" className="dark:stroke-zinc-800" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Top Active Contributors List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-headline">Top Active Contributors</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Most active wisdom authors</p>
          </div>
          
          {(!stats?.activeContributors || stats.activeContributors.length === 0) ? (
            <div className="flex-grow flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-slate-400 py-12 mt-6">
              No contributor stats found.
            </div>
          ) : (
            <div className="space-y-4 flex-grow mt-6">
              {stats.activeContributors.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-zinc-150 dark:border-zinc-800/40 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={c.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name || "contributor")}`} 
                      alt="" 
                      className="w-9 h-9 rounded-full bg-slate-100 shrink-0 object-cover border border-zinc-200/50 dark:border-zinc-800/60 shadow-xs" 
                    />
                    <div className="truncate text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name || c._id}</p>
                      <p className="text-[10px] text-slate-450 dark:text-zinc-500 truncate">{c._id}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                    {c.count} Lessons
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Lessons Distribution SVG Donut Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-headline">Lessons Distribution By Category</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">WISDOM content categories break-up</p>
        </div>

        {totalCategoryLessons === 0 ? (
          <div className="p-8 text-center text-slate-450 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl font-body">No lessons category data.</div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-2">
            {/* SVG Donut */}
            <div className="relative w-[220px] h-[220px] shrink-0">
              <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                {/* Background Track Circle */}
                <circle 
                  cx="110" 
                  cy="110" 
                  r="60" 
                  fill="none" 
                  stroke="#F1F5F9" 
                  className="dark:stroke-zinc-800/80" 
                  strokeWidth="20" 
                />

                {/* Slices Group */}
                {donutData.map((d, idx) => {
                  const sweepAngle = (d.count / totalCategoryLessons) * 360;
                  const startAngle = currentAccumulatedAngle;
                  const endAngle = startAngle + sweepAngle;
                  currentAccumulatedAngle += sweepAngle;

                  const isHovered = hoveredCategory?.name === d.name;
                  const strokeWidth = isHovered ? "24" : "20";
                  const radius = isHovered ? 62 : 60;

                  if (sweepAngle >= 359.9) {
                    return (
                      <circle
                        key={idx}
                        cx="110"
                        cy="110"
                        r={radius}
                        fill="none"
                        stroke={d.color}
                        strokeWidth={strokeWidth}
                        onMouseEnter={() => setHoveredCategory(d)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="transition-all duration-200 cursor-pointer"
                      />
                    );
                  }

                  return (
                    <path
                      key={idx}
                      d={describeArc(110, 110, radius, startAngle, endAngle)}
                      fill="none"
                      stroke={d.color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredCategory(d)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  );
                })}

                {/* Center Labels text */}
                <text x="110" y="98" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 dark:fill-zinc-550 uppercase tracking-widest">
                  {hoveredCategory ? hoveredCategory.name : "Total Lessons"}
                </text>
                <text x="110" y="123" textAnchor="middle" className="text-2xl font-black fill-slate-900 dark:fill-white font-headline">
                  {hoveredCategory ? hoveredCategory.count : totalCategoryLessons}
                </text>
                <text x="110" y="140" textAnchor="middle" className="text-[10px] font-bold fill-indigo-650 dark:fill-indigo-400">
                  {hoveredCategory ? `${hoveredCategory.percent}%` : "All Categories"}
                </text>
              </svg>
            </div>

            {/* Color coded legends grid */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {donutData.map((d, idx) => {
                const isHovered = hoveredCategory?.name === d.name;
                return (
                  <div 
                    key={idx}
                    onMouseEnter={() => setHoveredCategory(d)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isHovered 
                        ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-zinc-700 shadow-xs scale-[1.02]" 
                        : "bg-slate-50/40 dark:bg-slate-950/20 border-zinc-150 dark:border-zinc-800/50 hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800/20 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate">{d.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 whitespace-nowrap ml-2">
                      {d.count} ({d.percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
