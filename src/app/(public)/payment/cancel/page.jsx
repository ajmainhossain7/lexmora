"use client";

import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 relative overflow-hidden transition-colors duration-300">
            {/* Glowing background gradient */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-500/10 dark:bg-rose-500/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 relative z-10"
            >
                {/* Glowing Cancel Badge */}
                <div className="relative w-20 h-20 mx-auto">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                        className="w-full h-full rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-500"
                    >
                        <XCircle className="w-12 h-12 stroke-[1.5]" />
                    </motion.div>
                </div>

                {/* Typography */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">
                        Payment Cancelled
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-body leading-relaxed max-w-xs mx-auto">
                        Your checkout session has been cancelled. No charges were made to your account. Feel free to upgrade whenever you are ready!
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                    <Button
                        as={Link}
                        href="/plans"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-indigo-650/20 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>

                    <Button
                        as={Link}
                        href="/"
                        className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 text-slate-700 dark:text-zinc-300 rounded-xl py-3.5 font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
