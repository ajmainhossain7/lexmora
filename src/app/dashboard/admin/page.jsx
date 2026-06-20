"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getAdminUsers, getAdminStats } from "@/lib/api/users";
import { getLessons } from "@/lib/api/lessons";
import { updateUserRoleOrPlan } from "@/lib/actions/users";
import { updateLesson, deleteLesson } from "@/lib/actions/lessons";
import { 
    Users, BookOpen, Star, DollarSign, Award, Trash2, ShieldAlert,
    CheckCircle2, AlertCircle, Sparkles
} from "lucide-react";
import { Button, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";

function AdminDashboardContent() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [lessonsList, setLessonsList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeSection = searchParams.get("tab") || "overview";

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
            const allLessons = await getLessons();
            setLessonsList(allLessons || []);
        } catch (err) {
            console.error("Error loading admin dashboard data:", err);
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
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

    if (session?.user?.role !== "admin") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
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
                        Admin Central Control <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                    </h1>
                    <p className="mt-1 text-slate-500 dark:text-zinc-400">
                        Oversee platform stats, moderate contributions, and manage users.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => router.push("/dashboard/admin")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "overview" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-650"
                        }`}
                    >
                        Overview
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard/admin?tab=users")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "users" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-650"
                        }`}
                    >
                        Manage Users
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard/admin?tab=lessons")}
                        className={`text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            activeSection === "lessons" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-650"
                        }`}
                    >
                        Manage Lessons
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading admin operations...</div>
            ) : (
                <>
                    {/* OVERVIEW SECTION */}
                    {activeSection === "overview" && (
                        <div className="space-y-8">
                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Registered</p>
                                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalUsers}</h3>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Lessons</p>
                                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalLessons}</h3>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Premium Members</p>
                                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.premiumUsers}</h3>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Estimated Revenue</p>
                                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">৳{stats?.totalRevenue}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MANAGE USERS SECTION */}
                    {activeSection === "users" && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-850">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Registered Users</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/50 dark:border-zinc-850">
                                            <th className="py-4 px-6">User</th>
                                            <th className="py-4 px-6">Email</th>
                                            <th className="py-4 px-6 text-center">Plan</th>
                                            <th className="py-4 px-6 text-center">Role / Permissions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                                        {usersList.map((usr) => (
                                            <tr key={usr.id || usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={usr.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(usr.name)}`}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0"
                                                        />
                                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{usr.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-500 dark:text-zinc-400">{usr.email}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <select
                                                        value={usr.plan}
                                                        onChange={(e) => handlePlanChange(usr.id || usr._id, e.target.value)}
                                                        className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-lg p-1.5 border border-zinc-200 dark:border-zinc-850 focus:outline-none"
                                                    >
                                                        <option value="user_free">Free Starter</option>
                                                        <option value="user_premium">Lifetime Premium</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <select
                                                        value={usr.role}
                                                        onChange={(e) => handleRoleChange(usr.id || usr._id, e.target.value)}
                                                        className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-lg p-1.5 border border-zinc-200 dark:border-zinc-850 focus:outline-none"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* MANAGE LESSONS SECTION */}
                    {activeSection === "lessons" && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-850">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Wisdom Lesson Index</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/50 dark:border-zinc-850">
                                            <th className="py-4 px-6">Lesson details</th>
                                            <th className="py-4 px-6">Category</th>
                                            <th className="py-4 px-6 text-center">Featured status</th>
                                            <th className="py-4 px-6 text-center">Access</th>
                                            <th className="py-4 px-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                                        {lessonsList.map((lesson) => (
                                            <tr key={lesson._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={lesson.coverImage}
                                                            alt=""
                                                            className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                                                        />
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{lesson.title}</h4>
                                                            <span className="text-xs text-slate-400">By {lesson.authorName || lesson.authorEmail}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-full">
                                                        {lesson.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                                                        className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                                                            lesson.isFeatured 
                                                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" 
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-650"
                                                        }`}
                                                    >
                                                        <Star className={`w-3.5 h-3.5 ${lesson.isFeatured ? "fill-current" : ""}`} />
                                                        {lesson.isFeatured ? "Featured" : "Feature me"}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6 text-center text-xs font-semibold capitalize">
                                                    {lesson.accessLevel}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onClick={() => handleDeleteLesson(lesson._id)}
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading admin operations...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}
