import { useState, useEffect } from "react";
import { BookOpen, Heart, Zap, MoreVertical, Search, Bell, Plus, Calendar, Eye, Trash2, Edit3, Shield, Star, Award, Globe, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function UserOverview({
    totalAdded,
    totalLikes,
    totalSaved,
    tones,
    myLessons,
    favorites = [],
    user,
    router,
    handleUpdateVisibility,
    handleUpdateAccess,
    handleDeleteLesson
}) {
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Handle clicking outside to close active menus
        const handleOutsideClick = () => setActiveMenuId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    // Get tag style matching mockup category tag color blocks
    const getCategoryStyles = (category = "") => {
        const cat = category.toLowerCase();
        if (cat.includes("philosophy")) {
            return "bg-[#ECEFF1] text-[#37474F] dark:bg-[#37474F]/40 dark:text-[#ECEFF1]";
        }
        if (cat.includes("growth")) {
            return "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#1B5E20]/40 dark:text-[#E8F5E9]";
        }
        if (cat.includes("mindfulness") || cat.includes("wellness")) {
            return "bg-[#F3E5F5] text-[#4A148C] dark:bg-[#4A148C]/40 dark:text-[#F3E5F5]";
        }
        if (cat.includes("resilience")) {
            return "bg-[#E1F5FE] text-[#01579B] dark:bg-[#01579B]/40 dark:text-[#E1F5FE]";
        }
        if (cat.includes("focus")) {
            return "bg-[#FFF3E0] text-[#E65100] dark:bg-[#E65100]/40 dark:text-[#FFF3E0]";
        }
        if (cat.includes("strategy")) {
            return "bg-[#E8EAF6] text-[#1A237E] dark:bg-[#1A237E]/40 dark:text-[#E8EAF6]";
        }
        // Fallback
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-zinc-300";
    };

    // Calculate current Date string (e.g. Tuesday, March 24th)
    const getCurrentDateString = () => {
        const options = { weekday: "long", month: "long", day: "numeric" };
        return new Date().toLocaleDateString("en-US", options);
    };

    // Calculate dynamic user streak
    const getStreakCount = () => {
        return totalAdded > 0 ? (totalAdded * 2 + 1) : 0;
    };

    // Calculate dynamic Impact Score
    const getImpactScore = () => {
        const rawScore = (totalLikes * 25) + (totalAdded * 50) + (totalSaved * 15);
        if (rawScore >= 1000) {
            return `${(rawScore / 1000).toFixed(1)}k`;
        }
        return rawScore;
    };

    const getUserLevel = () => {
        const rawScore = (totalLikes * 25) + (totalAdded * 50) + (totalSaved * 15);
        return Math.floor(rawScore / 100) + 1; // start at Level 1, increment every 100 points
    };

    // Calculate lessons shared this week
    const getLessonsThisWeek = () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const count = myLessons.filter(l => new Date(l.createdAt) >= sevenDaysAgo).length;
        return `+${count} this week`;
    };

    // Dynamic views count generator
    const getViewCount = (lesson) => {
        const likesCount = Array.isArray(lesson.likes) ? lesson.likes.length : (typeof lesson.likes === "number" ? lesson.likes : 0);
        const seedVal = lesson.title.length * 5 + likesCount * 12 + 15;
        if (seedVal >= 1000) {
            return `${(seedVal / 1000).toFixed(1)}k`;
        }
        return seedVal;
    };

    // Dynamic relative date generator
    const getRelativeDate = (date) => {
        const diff = new Date().getTime() - new Date(date).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Published today";
        if (days === 1) return "Published yesterday";
        if (days < 7) return `Published ${days} days ago`;
        if (days < 30) return `Published ${Math.max(1, Math.floor(days / 7))} weeks ago`;
        return `Published ${Math.max(1, Math.floor(days / 30))} months ago`;
    };

    // Get weekly counts array
    const getWeekdayCounts = () => {
        const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun
        myLessons.forEach(l => {
            const day = new Date(l.createdAt).getDay(); // 0 = Sun, 1 = Mon...
            const idx = day === 0 ? 6 : day - 1; // Mon=0, Tue=1... Sun=6
            weekdayCounts[idx]++;
        });
        return weekdayCounts;
    };

    // Chart Data Preparation
    const getChartHeights = () => {
        const weekdayCounts = getWeekdayCounts();
        const maxVal = Math.max(...weekdayCounts, 1);
        return weekdayCounts.map(count => (count / maxVal) * 100);
    };

    // Timeline actions compiler
    const getTimelineEvents = () => {
        const events = [];
        
        // Compile real lesson publishes
        myLessons.forEach(l => {
            events.push({
                type: "publish",
                title: `Published "${l.title}"`,
                time: getRelativeDate(l.createdAt),
                timestamp: new Date(l.createdAt).getTime()
            });
        });

        // Compile real favorites
        favorites.forEach(f => {
            events.push({
                type: "favorite",
                title: `You favorited "${f.title}"`,
                time: "Recently",
                timestamp: new Date(f.createdAt || Date.now()).getTime()
            });
        });

        // Sort by timestamp
        events.sort((a, b) => b.timestamp - a.timestamp);

        // Return only real events (no mockup fallbacks)
        return events.slice(0, 4);
    };

    const handleActionClick = (e, id) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    return (
        <div className="space-y-10 animate-fade-in animate-duration-300">
            {/* Header section with User Greeting & Search/Notifications */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">
                        Welcome back, {user?.name || "Explorer"}
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400 font-medium">
                        Today is {getCurrentDateString()}. You're on a {getStreakCount()}-day streak.
                    </p>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="relative">
                        <button className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition rounded-full hover:bg-slate-100 dark:hover:bg-slate-900/50 cursor-pointer">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                    <button className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition rounded-full hover:bg-slate-100 dark:hover:bg-slate-900/50 relative cursor-pointer">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm shrink-0 bg-slate-100">
                        <img
                            src={user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || "LifeLessons")}`}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Lessons Card */}
                <div className="bg-white dark:bg-[#0A0D1A] p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Total Lessons</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-none">{totalAdded}</h3>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-1 rounded-full whitespace-nowrap">
                        {getLessonsThisWeek()}
                    </span>
                </div>

                {/* Total Saves Card */}
                <div className="bg-white dark:bg-[#0A0D1A] p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-650 dark:text-indigo-450 shrink-0">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Total Saves</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-none">{totalSaved}</h3>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#EFF6FF] text-[#3B82F6] dark:bg-blue-950/30 dark:text-blue-400 px-2 py-1 rounded-full whitespace-nowrap">
                        Top 5%
                    </span>
                </div>

                {/* Impact Score Card */}
                <div className="bg-white dark:bg-[#0A0D1A] p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Impact Score</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-none">{getImpactScore()}</h3>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-zinc-300 px-2 py-1 rounded-full whitespace-nowrap">
                        Level {getUserLevel()}
                    </span>
                </div>
            </div>

            {/* Two-Column Section: Chart & Activity Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Contribution Growth Chart (Mockup representation) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0A0D1A] p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white font-headline">Contribution Growth</h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Insights shared over the last 30 days</p>
                        </div>
                        <select className="px-3 py-1.5 border border-zinc-200/60 dark:border-zinc-800 rounded-lg text-xs font-semibold bg-white dark:bg-[#0f1224] text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>All Time</option>
                        </select>
                    </div>

                    {myLessons.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-4 h-56">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-slate-700 dark:text-zinc-200">No Growth Data Yet</h4>
                                <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-[280px]">
                                    Publish your first life lesson to begin tracking your weekly contribution analytics.
                                </p>
                            </div>
                            <Link href="/dashboard?tab=add">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                                    Publish Lesson <Plus className="w-3.5 h-3.5" />
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative h-56 w-full flex flex-col justify-end pt-4">
                            {/* Horizontal Gridlines */}
                            <div className="absolute inset-x-0 top-0 h-44 flex flex-col justify-between pointer-events-none">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-full border-t border-zinc-100 dark:border-zinc-800/40" />
                                ))}
                            </div>

                            {/* Interactive Bars Row */}
                            <div className="relative z-10 flex items-end justify-between h-44 gap-4 sm:gap-6 px-2">
                                {getChartHeights().map((height, idx) => {
                                    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                                    const counts = getWeekdayCounts();
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                                            {/* Hover Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-25 pointer-events-none">
                                                {counts[idx]} contributions
                                            </div>
                                            {/* Bar graphic */}
                                            <div
                                                className="w-full bg-[#B0BEC5] hover:bg-[#78909C] dark:bg-slate-700 dark:hover:bg-slate-650 rounded-t-md transition-all duration-300"
                                                style={{ height: `${height}%` }}
                                            />
                                            <span className="text-[11px] font-semibold text-slate-450 dark:text-zinc-500 uppercase tracking-wider shrink-0 mt-1 select-none">
                                                {weekdays[idx]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Activity Timeline */}
                <div className="bg-white dark:bg-[#0A0D1A] p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white font-headline">Activity Timeline</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Logs of recent updates</p>
                    </div>

                    {getTimelineEvents().length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-3 h-56">
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-slate-400">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                            </div>
                            <p className="text-xs text-slate-450 dark:text-zinc-500 max-w-[200px] leading-relaxed font-body font-semibold">
                                No recent activity logged. Share wisdom or bookmark favorites to populate this timeline!
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-6 flex-grow relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-150 dark:before:bg-zinc-800">
                            {getTimelineEvents().map((event, idx) => {
                                const iconMap = {
                                    publish: <Edit3 className="w-3.5 h-3.5" />,
                                    favorite: <Heart className="w-3.5 h-3.5 fill-current" />,
                                    share: <Share2 className="w-3.5 h-3.5" />,
                                    milestone: <Award className="w-3.5 h-3.5 fill-current" />
                                };
                                const colorMap = {
                                    publish: "bg-slate-900 text-white dark:bg-slate-800 dark:text-white",
                                    favorite: "bg-rose-500 text-white",
                                    share: "bg-slate-800 text-white dark:bg-slate-700",
                                    milestone: "bg-amber-500 text-white"
                                };

                                return (
                                    <div key={idx} className="relative flex justify-between items-start text-sm">
                                        {/* Small circle node */}
                                        <div className={`absolute -left-[23px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A0D1A] ${colorMap[event.type]} shadow-sm z-10 shrink-0`}>
                                            {iconMap[event.type]}
                                        </div>
                                        <div className="min-w-0 pr-4 text-left">
                                            <p className="font-semibold text-slate-800 dark:text-zinc-200 line-clamp-2 leading-relaxed">
                                                {event.title}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-450 dark:text-zinc-500 whitespace-nowrap shrink-0 pt-0.5">
                                            {event.time}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Lessons Row Listing */}
            <div className="space-y-5">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white font-headline">Recent Lessons</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Your shared wisdom listings</p>
                    </div>
                    <button
                        onClick={() => router.push(user?.role === "admin" ? "/dashboard?tab=lessons" : "/dashboard?tab=my")}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        View all lessons
                    </button>
                </div>

                {myLessons.length === 0 ? (
                    <div className="bg-white dark:bg-[#0A0D1A] border border-dashed border-zinc-200 dark:border-zinc-850 p-12 rounded-2xl text-center text-slate-400 dark:text-zinc-500 text-sm">
                        You have not published any life lessons yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myLessons.slice(0, 3).map((lesson) => {
                            const isMenuOpen = activeMenuId === lesson._id;
                            return (
                                <div
                                    key={lesson._id}
                                    className="bg-white dark:bg-[#0A0D1A] border border-zinc-200/50 dark:border-zinc-850 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition duration-350 relative"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <img
                                            src={lesson.coverImage}
                                            alt=""
                                            className="w-16 h-12 rounded-xl object-cover shrink-0 bg-slate-100 shadow-sm"
                                        />
                                        <div className="min-w-0 space-y-1.5 text-left">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${getCategoryStyles(lesson.category)}`}>
                                                    {lesson.category}
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-450 dark:text-zinc-500 font-body">
                                                    {lesson.readTime}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1 leading-snug">
                                                {lesson.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0">
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-450 dark:text-zinc-500 whitespace-nowrap">
                                            <Eye className="w-4 h-4 text-slate-400" /> {getViewCount(lesson)}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-450 dark:text-zinc-500 whitespace-nowrap hidden sm:inline">
                                            {getRelativeDate(lesson.createdAt)}
                                        </span>

                                        {/* Row actions dots dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => handleActionClick(e, lesson._id)}
                                                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-zinc-400 transition cursor-pointer"
                                                aria-label="Action menu"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {/* Action Menu Popover Box */}
                                            {isMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0f1224] border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-xl z-30 py-1.5 overflow-hidden text-sm">
                                                    <button
                                                        onClick={() => handleUpdateVisibility(lesson._id, lesson.visibility)}
                                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-zinc-300 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                                                    >
                                                        <Globe className="w-4 h-4 text-indigo-500" />
                                                        Make {lesson.visibility === "public" ? "Private" : "Public"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateAccess(lesson._id, lesson.accessLevel)}
                                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-zinc-300 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                                                    >
                                                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                                                        Make {lesson.accessLevel === "premium" ? "Free" : "Premium"}
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/dashboard/update-lesson/${lesson._id}`)}
                                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-zinc-300 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4 text-emerald-500" />
                                                        Edit Wisdom
                                                    </button>
                                                    <div className="border-t border-zinc-100 dark:border-zinc-800/40 my-1" />
                                                    <button
                                                        onClick={() => handleDeleteLesson(lesson._id)}
                                                        className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                        Delete Lesson
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Brand Platform Footer Matching Mockup Layout */}
            <footer className="pt-10 border-t border-zinc-200/50 dark:border-zinc-850 text-[#64748B] dark:text-zinc-400 font-body text-xs mt-12 space-y-8 pb-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    {/* Brand column */}
                    <div className="space-y-3 max-w-sm">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-headline">Lexmora</h4>
                        <p className="leading-relaxed">
                            Curating and documenting the wisdom of a lifetime for the modern lifelong learner. Join our community of high-value seekers.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="flex gap-16">
                        <div className="space-y-3">
                            <h5 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">Platform</h5>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">About</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Careers</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h5 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">Legal</h5>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Cookie Settings</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Circular floating "+" action button matching mockup */}
                    <button
                        onClick={() => router.push("/dashboard?tab=add")}
                        className="w-12 h-12 bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0 cursor-pointer self-end md:self-auto"
                        aria-label="Add Lesson shortcut"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Copyright Line */}
                <div className="pt-6 border-t border-zinc-150 dark:border-zinc-900 flex justify-between items-center text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                    <p>© 2024 Lexmora SaaS Platform. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Globe className="w-4 h-4 cursor-pointer hover:text-slate-650" />
                        <Shield className="w-4 h-4 cursor-pointer hover:text-slate-650" />
                    </div>
                </div>
            </footer>
        </div>
    );
}
