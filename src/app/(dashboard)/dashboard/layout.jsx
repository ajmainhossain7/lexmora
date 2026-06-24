"use client";

import { useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LayoutDashboard, BookOpen, PlusCircle, Heart, Shield, Settings, Loader2, Flag, Home as HomeIcon, Globe, LogOut, BarChart2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function SidebarNav({ sidebarItems, pathname }) {
    const searchParams = useSearchParams();
    return (
        <nav aria-label="Dashboard Sidebar Navigation" className="space-y-1.5 flex-1">
            {sidebarItems.map((item, idx) => {
                const Icon = item.icon;
                const isTabActive = (() => {
                    const itemUrl = new URL(item.href, "http://localhost");
                    const itemTab = itemUrl.searchParams.get("tab");
                    const itemView = itemUrl.searchParams.get("view");
                    
                    const currentTab = searchParams.get("tab");
                    const currentView = searchParams.get("view");
                    
                    const normalizedItemTab = itemTab === "overview" ? null : itemTab;
                    const normalizedCurrentTab = currentTab === "overview" ? null : currentTab;
                    
                    return normalizedCurrentTab === normalizedItemTab && currentView === itemView;
                })();
                
                return (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
                            isTabActive
                                ? "bg-[#1E293B] text-white dark:bg-slate-800 dark:text-white"
                                : "text-slate-650 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
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

function SidebarContainer({ session }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const view = searchParams.get("view");
    
    const isAdmin = session.user.role === "admin";
    const isUserView = view === "user";

    const sidebarItems = (isAdmin && !isUserView)
        ? [
              { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
              { label: "All Lessons", href: "/dashboard?tab=lessons", icon: BookOpen },
              { label: "Moderation Reports", href: "/dashboard?tab=reports", icon: Flag },
              { label: "Admin Profile", href: "/dashboard?tab=profile", icon: Settings },
          ]
        : [
              { label: "My Lessons", href: isUserView ? "/dashboard?view=user&tab=my" : "/dashboard?tab=my", icon: BookOpen },
              { label: "Favorites", href: isUserView ? "/dashboard?view=user&tab=fav" : "/dashboard?tab=fav", icon: Heart },
              { label: "Analytics", href: isUserView ? "/dashboard?view=user" : "/dashboard", icon: BarChart2 },
              { label: "My Profile", href: isUserView ? "/dashboard?view=user&tab=profile" : "/dashboard?tab=profile", icon: Settings },
              { label: "Add Lesson", href: isUserView ? "/dashboard?view=user&tab=add" : "/dashboard?tab=add", icon: PlusCircle },
          ];

    const handleSignOut = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Successfully logged out");
                        router.push("/");
                        router.refresh();
                    }
                }
            });
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    return (
        <div className="flex flex-col flex-grow h-full justify-between">
            <SidebarNav sidebarItems={sidebarItems} pathname={pathname} />

            {/* Upgrade banner if user is free */}
            {session.user.plan !== "user_premium" && session.user.role !== "admin" && (
                <div className="mt-8 mb-6 bg-[#0E1629] text-white p-5 rounded-xl relative overflow-hidden shadow-md">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Upgrade to Pro</h4>
                    <p className="text-[10px] text-slate-350 mt-1.5 leading-normal">
                        Get unlimited insights and private journaling.
                    </p>
                    <Link
                        href="/plans"
                        className="w-full block text-center mt-4 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                        Go Premium
                    </Link>
                </div>
            )}

            <div className="mt-auto pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                >
                    <HomeIcon className="w-4 h-4 text-blue-500" />
                    Go to Home
                </Link>
                <Link
                    href="/lessons"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                >
                    <Globe className="w-4 h-4 text-emerald-500" />
                    Public Lessons
                </Link>

                {isAdmin && (
                    <div className="pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40 pb-2">
                        {isUserView ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                            >
                                <Shield className="w-4 h-4 text-indigo-500" />
                                Go to Admin View
                            </Link>
                        ) : (
                            <Link
                                href="/dashboard?view=user"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                            >
                                <Shield className="w-4 h-4 text-amber-500" />
                                Go to User View
                            </Link>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition outline-none text-left cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/signin");
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-zinc-100 flex flex-col md:flex-row transition-colors duration-300">
            {/* Sidebar Navigation */}
            <aside aria-label="Dashboard Sidebar" className="w-full md:w-64 bg-white dark:bg-[#0A0D1A] border-b md:border-b-0 md:border-r border-zinc-200/50 dark:border-zinc-800/40 p-6 flex flex-col shrink-0">
                <div className="mb-6">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline focus-visible:outline-none mb-5 block">
                        Lexmora
                    </Link>
                    
                    {/* Restored top profile block */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-zinc-200/40 dark:border-zinc-800/30">
                        <img
                            src={session.user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(session.user.name)}`}
                            alt={session.user.name}
                            className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover bg-slate-100"
                        />
                        <div className="truncate">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">
                                {session.user.name}
                            </h4>
                            <span className="inline-flex items-center gap-0.5 mt-1 py-0.5 px-2 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-450 capitalize">
                                {session.user.plan === "user_premium" ? "Premium" : session.user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg" />}>
                    <SidebarContainer session={session} />
                </Suspense>
            </aside>

            {/* Main Content Area */}
            <main id="main-content" tabIndex="-1" className="flex-grow flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto outline-none">
                {children}
            </main>
        </div>
    );
}
