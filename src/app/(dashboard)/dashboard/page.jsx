"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("@/components/dashboard/AdminDashboard"), {
    loading: () => (
        <div className="flex items-center justify-center p-12 min-h-[50vh]">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
    )
});

const UserDashboard = dynamic(() => import("@/components/dashboard/UserDashboard"), {
    loading: () => (
        <div className="flex items-center justify-center p-12 min-h-[50vh]">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
    )
});

function DashboardContent() {
    const { data: session, isPending } = useSession();
    const searchParams = useSearchParams();
    const view = searchParams.get("view");

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12 min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const isAdmin = session.user.role === "admin";
    const isUserView = view === "user";

    if (isAdmin && !isUserView) {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-12 min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
