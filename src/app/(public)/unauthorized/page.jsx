"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@heroui/react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
            <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 mb-6">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Access Denied
                </h1>
                
                <p className="mt-3 text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
                    You do not have the required permissions or subscription plan to access this resource. Please upgrade your plan or sign in with another account.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                        as={Link}
                        href="/"
                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-300 rounded-xl py-3 font-semibold text-sm transition"
                    >
                        <Home className="w-4 h-4 mr-2" /> Home
                    </Button>
                    <Button
                        as={Link}
                        href="/plans"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold text-sm transition shadow-lg shadow-indigo-650/20"
                    >
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
