import { BookOpen, Heart, Smile, Award } from "lucide-react";
import { Button } from "@heroui/react";

export default function UserOverview({
    totalAdded,
    totalLikes,
    totalSaved,
    tones,
    myLessons,
    user,
    router
}) {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Lessons Shared</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalAdded}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <Smile className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Likes Received</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalLikes}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Saved Favorites</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalSaved}</h3>
                    </div>
                </div>
            </div>

            {/* Analytics Section & CTA */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Emotional Tone Distribution</h3>
                    {totalAdded === 0 ? (
                        <div className="h-48 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-slate-400">
                            No lesson data to visualize yet. Share a lesson!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tones.map((tone) => {
                                const count = myLessons.filter(l => l.emotionalTone === tone).length;
                                const pct = totalAdded > 0 ? (count / totalAdded) * 100 : 0;
                                return (
                                    <div key={tone} className="space-y-1">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-slate-700 dark:text-zinc-300">{tone}</span>
                                            <span className="text-slate-500">{count} ({pct.toFixed(0)}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Plan and Badge Status */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Member Profile</h3>
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-850">
                                <span className="text-sm text-slate-500">Plan</span>
                                <span className="text-sm font-semibold capitalize">{user?.plan === "user_premium" ? "Premium" : "Free"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-850">
                                <span className="text-sm text-slate-500">Badge</span>
                                {user?.plan === "user_premium" || user?.role === "admin" ? (
                                    <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                        <Award className="w-3 h-3 fill-current" /> Verified Contributor
                                    </span>
                                ) : (
                                    <span className="text-sm text-slate-400">None</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {user?.plan !== "user_premium" && user?.role !== "admin" && (
                        <div className="mt-8 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">Upgrade to Lifetime Premium</h4>
                            <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Write premium wisdom, get badges, and export to PDF.</p>
                            <Button
                                onClick={() => router.push("/plans")}
                                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer"
                            >
                                Upgrade now (৳1500)
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
