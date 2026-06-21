"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X, ShieldAlert, Sparkles, Star, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

function PlansContent() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const isPremium = session?.user?.plan === "user_premium" || session?.user?.role === "admin";

    useEffect(() => {
        if (searchParams.get("canceled") === "true") {
            toast.error("Payment checkout was canceled. Feel free to upgrade whenever you are ready!", {
                duration: 4000,
            });
            router.replace("/plans");
        }
    }, [searchParams, router]);

    const features = [
        { name: "Browse Public Free Lessons", free: true, premium: true },
        { name: "Unlimited Daily Wisdom Access", free: "3 lessons / day", premium: "Unlimited" },
        { name: "Save to Favorites & Bookmarks", free: true, premium: true },
        { name: "Access to Premium Exclusive Lessons", free: false, premium: true },
        { name: "Verified Premium Contributor Badge", free: false, premium: true },
        { name: "Export Lessons as PDF", free: false, premium: true },
        { name: "100% Ad-Free Experience", free: false, premium: true },
        { name: "Priority Support & Requests", free: false, premium: true },
    ];

    const handleUpgrade = async () => {
        if (!session) {
            toast.error("Please log in or sign up first to upgrade!");
            router.push("/auth/signin");
            return;
        }

        if (isPremium) {
            toast.success("You are already a Premium member!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan_id: "user_premium" }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Something went wrong. Please try again.");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Failed to initiate Stripe Checkout.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-zinc-100 py-16 px-4 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Pricing Options
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Unlock Unlimited Wisdom
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
                        Choose the plan that fits your personal development and wisdom sharing journey.
                    </p>
                </div>

                {/* Plan Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col relative overflow-hidden transition hover:shadow-lg dark:hover:shadow-indigo-950/20">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Starter</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Begin your self-discovery journey</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">৳0</span>
                                <span className="text-slate-500 dark:text-zinc-400 ml-2">/ lifetime</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm">Read public free lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm">Limit of 3 lessons daily</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm">Save to your Favorites list</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-600">
                                <X className="w-5 h-5 shrink-0" />
                                <span className="text-sm">No premium lessons access</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button
                                disabled
                                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-zinc-400 rounded-xl py-3 font-semibold cursor-not-allowed"
                            >
                                Current Plan
                            </Button>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900/50 dark:to-slate-900 border-2 border-indigo-500 dark:border-indigo-400 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold tracking-wide uppercase py-1 px-4 rounded-bl-xl flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Popular
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Lifetime Premium <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/30" />
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Ultimate wisdom, lifetime ownership</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">৳1,500</span>
                                <span className="text-slate-500 dark:text-zinc-400 ml-2">/ lifetime</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm font-medium">Access all Premium exclusive lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm font-medium">Unlimited daily reads</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm font-medium">Verified Contributor Badge</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm font-medium">Export wisdom lessons as PDF</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-sm font-medium">100% Ad-Free reading interface</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button
                                onClick={handleUpgrade}
                                isLoading={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/35 transition cursor-pointer"
                            >
                                {isPremium ? "You are Premium!" : "Upgrade to Premium"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Feature Comparison</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6">Feature</th>
                                    <th className="py-4 px-6 text-center">Free Starter</th>
                                    <th className="py-4 px-6 text-center">Lifetime Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                                {features.map((feature, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                                        <td className="py-4 px-6 font-medium text-slate-800 dark:text-zinc-200">
                                            {feature.name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {typeof feature.free === "boolean" ? (
                                                feature.free ? (
                                                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                                ) : (
                                                    <X className="w-5 h-5 text-rose-500 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-slate-500 dark:text-zinc-400 text-xs">{feature.free}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {typeof feature.premium === "boolean" ? (
                                                feature.premium ? (
                                                    <Check className="w-5 h-5 text-indigo-500 mx-auto" />
                                                ) : (
                                                    <X className="w-5 h-5 text-rose-500 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs">{feature.premium}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PlansPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-16 px-4">
                <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
                <p className="mt-4 text-slate-500 dark:text-zinc-400 text-sm">Loading pricing plans...</p>
            </div>
        }>
            <PlansContent />
        </Suspense>
    );
}
