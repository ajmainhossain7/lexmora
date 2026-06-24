"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { getAdminUsers, getAdminStats } from "@/lib/api/users";
import { getLessons } from "@/lib/api/lessons";
import { getReports } from "@/lib/api/reports";
import { updateUserRoleOrPlan, deleteUser } from "@/lib/actions/users";
import { updateLesson, deleteLesson } from "@/lib/actions/lessons";
import { deleteReport, dismissReportsForLesson } from "@/lib/actions/reports";
import { ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

import dynamic from "next/dynamic";

// Admin Dashboard Subcomponents (Dynamically Imported for Performance Optimization)
const AdminOverview = dynamic(() => import("@/components/dashboard/admin/AdminOverview"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading overview...</div>
});
const ManageUsers = dynamic(() => import("@/components/dashboard/admin/ManageUsers"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading users...</div>
});
const ManageLessons = dynamic(() => import("@/components/dashboard/admin/ManageLessons"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading lessons...</div>
});
const ReportsModeration = dynamic(() => import("@/components/dashboard/admin/ReportsModeration"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading moderation...</div>
});
const AdminProfile = dynamic(() => import("@/components/dashboard/admin/AdminProfile"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading profile...</div>
});

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [lessonsList, setLessonsList] = useState([]);
    const [reportsList, setReportsList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeSection = searchParams.get("tab") || "overview";

    // Profile States
    const [profileName, setProfileName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Lessons Filters
    const [lessonCategoryFilter, setLessonCategoryFilter] = useState("All");
    const [lessonVisibilityFilter, setLessonVisibilityFilter] = useState("All");
    const [lessonStatusFilter, setLessonStatusFilter] = useState("All");

    useEffect(() => {
        if (session?.user) {
            setProfileName(session.user.name || "");
            setProfileImage(session.user.image || "");
        }
    }, [session]);

    useEffect(() => {
        if (session?.user?.role === "admin") {
            fetchAdminData();
        }
    }, [session]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const adminStats = await getAdminStats();
            setStats(adminStats);
            const users = await getAdminUsers();
            setUsersList(users || []);
            const allLessons = await getLessons({ visibility: 'all' });
            setLessonsList(allLessons || []);
            const reports = await getReports();
            setReportsList(reports || []);
        } catch (err) {
            console.error("Error loading admin dashboard data:", err);
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAdminProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const { error } = await authClient.user.update({
                name: profileName,
                image: profileImage,
            });
            if (error) {
                toast.error(error.message || "Failed to update admin profile.");
            } else {
                toast.success("Admin profile updated successfully!");
                router.refresh();
            }
        } catch (err) {
            console.error("Profile update error:", err);
            toast.error("An error occurred during update.");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleDismissReport = async (reportId) => {
        const result = await deleteReport(reportId);
        if (result) {
            toast.success("Report dismissed successfully");
            fetchAdminData();
        } else {
            toast.error("Failed to dismiss report");
        }
    };

    const handleIgnoreReports = async (lessonId) => {
        if (!confirm("Are you sure you want to dismiss all reports for this lesson? This will keep the lesson live.")) return;
        const result = await dismissReportsForLesson(lessonId);
        if (result) {
            toast.success("Reports ignored and cleared successfully");
            fetchAdminData();
        } else {
            toast.error("Failed to ignore reports");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        const result = await updateUserRoleOrPlan(userId, { role: newRole });
        if (result) {
            toast.success("User role updated successfully!");
            fetchAdminData();
        } else {
            toast.error("Failed to update user role");
        }
    };

    const handlePlanChange = async (userId, newPlan) => {
        const result = await updateUserRoleOrPlan(userId, { plan: newPlan });
        if (result) {
            toast.success("User plan updated successfully!");
            fetchAdminData();
        } else {
            toast.error("Failed to update user plan");
        }
    };

    const handleToggleFeatured = async (lessonId, currentFeatured) => {
        const nextFeatured = !currentFeatured;
        const result = await updateLesson(lessonId, { isFeatured: nextFeatured });
        if (result) {
            toast.success(nextFeatured ? "Lesson marked as Featured" : "Lesson removed from Featured");
            fetchAdminData();
        } else {
            toast.error("Failed to update featured status");
        }
    };

    const handleToggleReviewed = async (lessonId, currentReviewed) => {
        const nextReviewed = !currentReviewed;
        const result = await updateLesson(lessonId, { isReviewed: nextReviewed });
        if (result) {
            toast.success(nextReviewed ? "Lesson marked as Reviewed" : "Lesson marked as Under Review");
            fetchAdminData();
        } else {
            toast.error("Failed to update reviewed status");
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm("Are you sure you want to permanently delete this lesson?")) return;
        const result = await deleteLesson(lessonId);
        if (result) {
            toast.success("Lesson deleted successfully");
            fetchAdminData();
        } else {
            toast.error("Failed to delete lesson");
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (userEmail === session?.user?.email) {
            toast.error("You cannot delete your own admin account!");
            return;
        }

        if (!confirm(`Are you sure you want to permanently delete this user account (${userEmail})? All lessons created by this user will also be deleted.`)) {
            return;
        }
        try {
            const result = await deleteUser(userId);
            if (result) {
                toast.success("User account deleted successfully!");
                fetchAdminData();
            } else {
                toast.error("Failed to delete user account.");
            }
        } catch (err) {
            console.error("Delete user error:", err);
            toast.error("An error occurred during account deletion.");
        }
    };

    if (session?.user?.role !== "admin") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Restricted</h1>
                <p className="mt-2 text-slate-500 dark:text-zinc-400">
                    You do not have the required administrative permissions to view this page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        Admin Central Control <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-500/20 animate-pulse" />
                    </h1>
                    <p className="mt-1 text-slate-500 dark:text-zinc-400">
                        Oversee platform stats, moderate contributions, and manage users.
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "overview" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300"
                        }`}
                    >
                        Overview
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard?tab=users")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "users" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300"
                        }`}
                    >
                        Manage Users
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard?tab=lessons")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "lessons" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300"
                        }`}
                    >
                        Manage Lessons
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard?tab=reports")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "reports" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300"
                        }`}
                    >
                        Reports Moderation
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard?tab=profile")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "profile" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300"
                        }`}
                    >
                        Admin Profile
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500 animate-pulse">Loading admin operations...</div>
            ) : (
                <>
                    {activeSection === "overview" && <AdminOverview stats={stats} />}
                    {activeSection === "users" && (
                        <ManageUsers
                            usersList={usersList}
                            handlePlanChange={handlePlanChange}
                            handleRoleChange={handleRoleChange}
                            handleDeleteUser={handleDeleteUser}
                            session={session}
                        />
                    )}
                    {activeSection === "lessons" && (
                        <ManageLessons
                            lessonsList={lessonsList}
                            reportsList={reportsList}
                            lessonCategoryFilter={lessonCategoryFilter}
                            setLessonCategoryFilter={setLessonCategoryFilter}
                            lessonVisibilityFilter={lessonVisibilityFilter}
                            setLessonVisibilityFilter={setLessonVisibilityFilter}
                            lessonStatusFilter={lessonStatusFilter}
                            setLessonStatusFilter={setLessonStatusFilter}
                            handleToggleFeatured={handleToggleFeatured}
                            handleToggleReviewed={handleToggleReviewed}
                            handleDeleteLesson={handleDeleteLesson}
                        />
                    )}
                    {activeSection === "reports" && (
                        <ReportsModeration
                            reportsList={reportsList}
                            handleDeleteLesson={handleDeleteLesson}
                            handleIgnoreReports={handleIgnoreReports}
                        />
                    )}
                    {activeSection === "profile" && (
                        <AdminProfile
                            session={session}
                            stats={stats}
                            profileName={profileName}
                            setProfileName={setProfileName}
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            updatingProfile={updatingProfile}
                            handleUpdateAdminProfile={handleUpdateAdminProfile}
                        />
                    )}
                </>
            )}
        </div>
    );
}
