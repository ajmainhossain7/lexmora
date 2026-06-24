"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X, ShieldAlert, Sparkles, Star, Zap, CheckCircle2, Globe, Shield, Award } from "lucide-react";
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

    const handleUpgrade = async () => {
        if (!session) {
            toast.error("Please log in or sign up first to upgrade!");
            router.push("/signin");
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

    const comparisonFeatures = [
        { name: "Reading Experience", free: "Standard", premium: "Ad-Free", isHighlight: true },
        { name: "Daily Lesson Limit", free: "3 Lessons", premium: "Unlimited", isHighlight: true },
        { name: "Publishing Lessons", free: false, premium: true },
        { name: "Priority Support", free: false, premium: true },
        { name: "Advanced Analytics", free: false, premium: true },
        { name: "Custom Domain Integration", free: "-", premium: "Soon", isHighlight: true },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-808 dark:text-zinc-100 py-20 px-4 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">
                        Invest in your wisdom, for life.
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 font-body leading-relaxed max-w-xl mx-auto">
                        Join a community of lifelong learners and professional insights. Choose the plan that fuels your growth journey.
                    </p>
                </div>

                {/* Plan Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-3xl mx-auto items-stretch">
                    
                    {/* Free Card */}
                    <div className="bg-white dark:bg-[#0A0D1A] border border-zinc-200/50 dark:border-zinc-850 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-headline">Free</h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-body">Explore the essentials of life sharing.</p>
                            </div>
                            
                            <div className="flex items-baseline gap-1 py-2 border-b border-zinc-100 dark:border-zinc-900">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">৳0</span>
                                <span className="text-slate-450 dark:text-zinc-500 text-sm font-semibold">/month</span>
                            </div>

                            <ul className="space-y-4 text-sm font-semibold text-slate-700 dark:text-zinc-300 text-left font-body">
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span>Read basic lessons</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span>Community feed access</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400 dark:text-zinc-650">
                                    <X className="w-5 h-5 shrink-0" />
                                    <span className="line-through">Verified Badge</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-10">
                            <button
                                onClick={() => router.push("/lessons")}
                                className="w-full py-3.5 border border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-750 text-slate-808 dark:text-zinc-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 font-bold rounded-xl text-sm transition duration-200 cursor-pointer shadow-sm text-center"
                            >
                                Start Learning
                            </button>
                        </div>
                    </div>

                    {/* Premium Card */}
                    <div className="bg-[#1E293B] text-white dark:bg-[#0E1629] border-2 border-zinc-800 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                        
                        {/* Most Popular Pill */}
                        <div className="absolute top-4 right-4 bg-white text-slate-900 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            Most Popular
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-extrabold font-headline">Premium Lifetime</h3>
                                <p className="text-xs text-slate-300 dark:text-zinc-400 mt-1 font-body">Unlock the full wisdom engine forever.</p>
                            </div>
                            
                            <div className="flex items-baseline gap-1 py-2 border-b border-zinc-700/60 dark:border-zinc-800">
                                <span className="text-4xl font-extrabold text-white">৳1500</span>
                                <span className="text-slate-350 dark:text-zinc-500 text-sm font-semibold ml-1">One-time payment</span>
                            </div>

                            <ul className="space-y-4 text-sm font-semibold text-slate-200 dark:text-zinc-300 text-left font-body">
                                <li className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-amber-400 fill-current shrink-0" />
                                    <span>Premium lesson access</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-indigo-400 fill-current shrink-0" />
                                    <span>Verified creator badge</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-emerald-400 fill-current shrink-0" />
                                    <span>Priority visibility in feed</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-blue-450 shrink-0" />
                                    <span>Full publishing capabilities</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-blue-450 shrink-0" />
                                    <span>Ad-free reading experience</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-10">
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-xl text-sm transition duration-200 cursor-pointer shadow-md disabled:bg-slate-200 text-center"
                            >
                                {loading ? "Processing..." : isPremium ? "You are Premium!" : "Go Premium Now"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feature Comparison Table Section */}
                <div className="space-y-8 mb-24 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center font-headline">
                        Feature Comparison
                    </h2>
                    
                    <div className="bg-white dark:bg-[#0A0D1A] border border-zinc-200/50 dark:border-zinc-855 rounded-2xl shadow-sm overflow-hidden font-body">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-zinc-150 dark:border-zinc-850">
                                        <th className="py-4.5 px-6">Capabilities</th>
                                        <th className="py-4.5 px-6 text-center">FREE</th>
                                        <th className="py-4.5 px-6 text-center">PREMIUM</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850/80 text-sm">
                                    {comparisonFeatures.map((feature, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10">
                                            <td className="py-4 px-6 font-semibold text-slate-800 dark:text-zinc-250">
                                                {feature.name}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {typeof feature.free === "boolean" ? (
                                                    feature.free ? (
                                                        <Check className="w-5 h-5 text-indigo-500 mx-auto" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-rose-500 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className="text-slate-500 dark:text-zinc-400 font-semibold text-xs">{feature.free}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center font-bold">
                                                {typeof feature.premium === "boolean" ? (
                                                    feature.premium ? (
                                                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-rose-500 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">{feature.premium}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Testimonial Box Banner */}
                <div className="bg-slate-100/50 dark:bg-slate-900/30 border border-zinc-200/50 dark:border-zinc-850 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-10 mb-24 max-w-4xl mx-auto shadow-sm">
                    {/* Left: Laptop Illustration / Workspace Image */}
                    <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md border border-zinc-200/40 dark:border-zinc-800">
                        <img
                            src="https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80"
                            alt="Lexmora dashboard on workspace desk"
                            className="w-full h-48 sm:h-64 object-cover"
                        />
                    </div>

                    {/* Right: Testimonial content */}
                    <div className="w-full md:w-1/2 space-y-4 text-left font-body">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                            WHY LEXMORA?
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-headline leading-tight">
                            Join 10,000+ creators curating the world's most valuable insights.
                        </h3>
                        <p className="text-sm text-slate-650 dark:text-zinc-400 leading-relaxed italic">
                            "This platform changed how I document my growth. The premium features gave me the reach I needed to turn my experiences into an impact."
                        </p>
                        <p className="text-xs font-bold text-slate-808 dark:text-white pt-2">
                            — Sarah J., Growth Expert
                        </p>
                    </div>
                </div>

                {/* Premium Mockup Brand Footer */}
                <footer className="pt-10 border-t border-zinc-200/50 dark:border-zinc-850 text-[#64748B] dark:text-zinc-400 font-body text-xs space-y-8 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        {/* Brand column */}
                        <div className="space-y-3 max-w-sm text-left">
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-headline">Lexmora</h4>
                            <p className="leading-relaxed">
                                Curating high-value insights for the lifelong learner.
                            </p>
                        </div>

                        {/* Navigation Columns */}
                        <div className="flex gap-16">
                            <div className="space-y-3 text-left">
                                <h5 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">Platform</h5>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Feed</a></li>
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Write</a></li>
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Topics</a></li>
                                </ul>
                            </div>
                            <div className="space-y-3 text-left">
                                <h5 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">Legal</h5>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Refunds</a></li>
                                </ul>
                            </div>
                            <div className="space-y-3 text-left">
                                <h5 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">Connect</h5>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Twitter</a></li>
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Newsletter</a></li>
                                    <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
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
