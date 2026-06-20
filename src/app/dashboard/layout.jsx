"use client";

import { useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LayoutDashboard, BookOpen, PlusCircle, Heart, Shield, Settings, Loader2 } from "lucide-react";
import Link from "next/link";

function SidebarNav({ sidebarItems, pathname }) {
    const searchParams = useSearchParams();
    return (
        <nav className="space-y-1.5 flex-1">
            {sidebarItems.map((item, idx) => {
                const Icon = item.icon;
                const isTabActive = (() => {
                    if (item.href.includes("?")) {
                        const [path, query] = item.href.split("?");
                        const params = new URLSearchParams(query);
                        return pathname === path && searchParams.get("tab") === params.get("tab");
                    }
                    return pathname === item.href && !searchParams.get("tab");
                })();
                return (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                            isTabActive
                                ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <Icon className="w-4.5 h-4.5" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function DashboardLayout({ children }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/auth/signin");
        }
    }, [session, isPending, router]);

    if (isPending || !session) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="mt-4 text-slate-500 dark:text-zinc-400 text-sm">Verifying session...</p>
            </div>
        );
    }

    const isAdmin = session.user.role === "admin";
    const sidebarItems = isAdmin
        ? [
              { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
              { label: "All Lessons", href: "/dashboard/admin?tab=lessons", icon: BookOpen },
          ]
        : [
              { label: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
              { label: "Add Lesson", href: "/dashboard/user?tab=add", icon: PlusCircle },
              { label: "My Lessons", href: "/dashboard/user?tab=my", icon: BookOpen },
              { label: "Favorites", href: "/dashboard/user?tab=fav", icon: Heart },
          ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-zinc-100 flex flex-col md:flex-row transition-colors duration-300">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white dark:bg-[#0A0D1A] border-b md:border-b-0 md:border-r border-zinc-200/50 dark:border-zinc-800/40 p-6 flex flex-col shrink-0">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <img
                            src={session.user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(session.user.name)}`}
                            alt={session.user.name}
                            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-850"
                        />
                        <div className="truncate">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {session.user.name}
                            </h4>
                            <span className="inline-flex items-center gap-1 mt-0.5 py-0.5 px-2 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 capitalize">
                                {session.user.plan === "user_premium" ? "Premium" : session.user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg" />}>
                    <SidebarNav sidebarItems={sidebarItems} pathname={pathname} />
                </Suspense>

                {isAdmin && (
                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-850">
                        <Link
                            href="/dashboard/user"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition"
                        >
                            <Shield className="w-4.5 h-4.5 text-amber-500" />
                            Go to User View
                        </Link>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
                {children}
            </main>
        </div>
    );
}

