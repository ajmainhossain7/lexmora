"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Star, ArrowRight, BookOpen, LayoutDashboard, Award, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setVerifying(false);
            return;
        }

        let isMounted = true;
        const verifyPayment = async () => {
            try {
                const res = await fetch(`/api/checkout_sessions?session_id=${sessionId}`);
                if (!res.ok) {
                    throw new Error("Server verification error");
                }
                const data = await res.json();
                if (data.success) {
                    // Update Better Auth client-side session cache
                    await authClient.getSession({ force: true });
                    if (isMounted) {
                        toast.success("Premium membership activated successfully!");
                        router.refresh();
                    }
                } else {
                    if (isMounted) {
                        setError(data.error || "Stripe checkout session not fully completed.");
                    }
                }
            } catch (err) {
                console.error("Verification error:", err);
                if (isMounted) {
                    setError("Failed to verify payment session. Please refresh or contact support.");
                }
            } finally {
                if (isMounted) {
                    setVerifying(false);
                }
            }
        };

        verifyPayment();

        return () => {
            isMounted = false;
        };
    }, [sessionId, router]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-zinc-100 flex flex-col items-center justify-center py-16 px-4 transition-colors duration-300 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 relative z-10"
                >
                    <Loader2 className="w-12 h-12 stroke-[1.5] text-indigo-500 animate-spin mx-auto" />
                    <div className="space-y-2">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Verifying Payment...
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                            Please wait while we secure your upgrade status. This will only take a moment.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-zinc-100 flex flex-col items-center justify-center py-16 px-4 transition-colors duration-300 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-500/10 dark:bg-rose-500/5 blur-[120px]" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 relative z-10"
                >
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-500 mx-auto">
                        <ShieldAlert className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Verification Failed
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                            {error}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 transition cursor-pointer"
                        >
                            Retry Verification
                        </Button>
                        <Button
                            onClick={() => router.push("/plans")}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-zinc-300 rounded-xl py-3.5 font-semibold hover:border-slate-450 dark:hover:border-slate-500 transition cursor-pointer"
                        >
                            Return to Pricing
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-zinc-100 flex flex-col items-center justify-center py-16 px-4 transition-colors duration-300 relative overflow-hidden">
            {/* Background glowing gradients */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 relative z-10"
            >
                {/* Glowing Success Badge */}
                <div className="relative w-20 h-20 mx-auto">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                        className="w-full h-full rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-505"
                    >
                        <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white border-2 border-white dark:border-slate-900 shadow-md"
                    >
                        <Star className="w-3.5 h-3.5 fill-white" />
                    </motion.div>
                </div>

                {/* Celebration Typography */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">
                        Premium Activated!
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-body leading-relaxed max-w-xs mx-auto">
                        Thank you for upgrading. Your lifetime membership is now active, unlocking the ultimate wisdom experience on Lexmora.
                    </p>
                </div>

                {/* Details card */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 text-left space-y-4 font-body">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/50 dark:border-slate-900">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">Plan Status</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Paid & Active
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/50 dark:border-slate-900">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">Account Level</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Lifetime Premium</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">Contributor Badge</span>
                        <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                            <Award className="w-3.5 h-3.5 fill-current" /> Verified Contributor
                        </span>
                    </div>
                </div>

                {/* CTA Navigation Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4" />
                    </Button>

                    <Button
                        onClick={() => router.push("/lessons")}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 text-slate-705 dark:text-zinc-300 rounded-xl py-3.5 font-semibold hover:border-slate-400 dark:hover:border-slate-500 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <BookOpen className="w-4 h-4" />
                        Explore Lessons
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
                <p className="mt-4 text-slate-500 dark:text-zinc-400 text-sm">Loading success details...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
