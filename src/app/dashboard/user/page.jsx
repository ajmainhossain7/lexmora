"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { getMyLessons } from "@/lib/api/lessons";
import { getFavorites } from "@/lib/api/favorites";
import { createLesson, updateLesson, deleteLesson } from "@/lib/actions/lessons";
import { toggleFavorite } from "@/lib/actions/favorites";
import { 
    BookOpen, Heart, Eye, EyeOff, Trash2, Edit3, Plus, 
    Sparkles, Smile, MessageSquare, Calendar, ArrowRight, Star,
    FileText, Award
} from "lucide-react";
import { Button, Input } from "@heroui/react";
import toast from "react-hot-toast";

function UserDashboardContent() {
    const { data: session } = useSession();
    const user = session?.user;
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "overview";

    const [myLessons, setMyLessons] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Lesson Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Growth");
    const [emotionalTone, setEmotionalTone] = useState("Inspiring");
    const [coverImage, setCoverImage] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [accessLevel, setAccessLevel] = useState("free");
    const [submitting, setSubmitting] = useState(false);

    // Edit Lesson Modal State
    const [editingLesson, setEditingLesson] = useState(null);

    // Profile Update State
    const [profileName, setProfileName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileName(user.name || "");
            setProfileImage(user.image || "");
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const { data, error } = await authClient.user.update({
                name: profileName,
                image: profileImage,
            });
            if (error) {
                toast.error(error.message || "Failed to update profile information.");
            } else {
                toast.success("Profile information updated successfully!");
                router.refresh();
            }
        } catch (err) {
            console.error("Profile update error:", err);
            toast.error("An error occurred during update.");
        } finally {
            setUpdatingProfile(false);
        }
    };
    
    const categories = ["Resilience", "Focus", "Growth", "Strategy", "Relationships", "Finance", "Wellness"];
    const tones = ["Inspiring", "Reflective", "Humorous", "Solemn", "Motivational", "Philosophical"];

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const lessonsData = await getMyLessons();
            setMyLessons(lessonsData || []);
            const favData = await getFavorites();
            setFavorites(favData || []);
        } catch (err) {
            console.error("Error loading dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        
        // Premium access validation
        const isPremium = user?.plan === "user_premium" || user?.role === "admin";
        if (accessLevel === "premium" && !isPremium) {
            toast.error("Only Premium users can create Premium access lessons!");
            return;
        }

        setSubmitting(true);
        const randomSeed = Math.floor(Math.random() * 1000);
        const finalImage = coverImage || `https://picsum.photos/seed/${randomSeed}/800/450`;

        const newLesson = {
            title,
            description,
            category,
            emotionalTone,
            coverImage: finalImage,
            visibility,
            accessLevel,
            authorName: user.name,
            authorEmail: user.email,
            authorAvatar: user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`,
            readTime: `${Math.max(1, Math.ceil(description.split(" ").length / 150))} min read`,
            likes: [],
        };

        const result = await createLesson(newLesson);
        setSubmitting(false);

        if (result) {
            toast.success("Life lesson added successfully!");
            // Reset form
            setTitle("");
            setDescription("");
            setCoverImage("");
            router.push("/dashboard/user?tab=my");
        } else {
            toast.error("Failed to add life lesson. Please try again.");
        }
    };

    const handleUpdateVisibility = async (id, currentVis) => {
        const nextVis = currentVis === "public" ? "private" : "public";
        const result = await updateLesson(id, { visibility: nextVis });
        if (result) {
            toast.success(`Visibility updated to ${nextVis}`);
            fetchData();
        } else {
            toast.error("Failed to update visibility");
        }
    };

    const handleUpdateAccess = async (id, currentAccess) => {
        const isPremium = user?.plan === "user_premium" || user?.role === "admin";
        const nextAccess = currentAccess === "free" ? "premium" : "free";
        
        if (nextAccess === "premium" && !isPremium) {
            toast.error("Upgrade to Premium plan to make your lessons premium!");
            return;
        }

        const result = await updateLesson(id, { accessLevel: nextAccess });
        if (result) {
            toast.success(`Access level updated to ${nextAccess}`);
            fetchData();
        } else {
            toast.error("Failed to update access level");
        }
    };

    const handleDeleteLesson = async (id) => {
        if (!confirm("Are you sure you want to delete this wisdom entry?")) return;
        const result = await deleteLesson(id);
        if (result) {
            toast.success("Lesson deleted successfully");
            fetchData();
        } else {
            toast.error("Failed to delete lesson");
        }
    };

    const handleUnfavorite = async (lessonId) => {
        const result = await toggleFavorite(lessonId);
        if (result) {
            toast.success("Removed from Favorites");
            fetchData();
        } else {
            toast.error("Failed to update favorites");
        }
    };

    // Calculate Dashboard stats
    const totalAdded = myLessons.length;
    const totalLikes = myLessons.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
    const totalSaved = favorites.length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Dashboard Overview
                </h1>
                <p className="mt-1 text-slate-500 dark:text-zinc-400">
                    Welcome back, {user?.name}. Manage your contributions, favorites, and profile.
                </p>
            </div>

            {/* Overview Stats Tab */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Lessons Shared</p>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalAdded}</h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <Smile className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Likes Received</p>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalLikes}</h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Heart className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Saved Favorites</p>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalSaved}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section & CTA */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Emotional Tone Distribution</h3>
                            {totalAdded === 0 ? (
                                <div className="h-48 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-slate-400">
                                    No lesson data to visualize yet. Share a lesson!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tones.map((tone) => {
                                        const count = myLessons.filter(l => l.emotionalTone === tone).length;
                                        const pct = totalAdded > 0 ? (count / totalAdded) * 100 : 0;
                                        return (
                                            <div key={tone} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold">
                                                    <span className="text-slate-700 dark:text-zinc-300">{tone}</span>
                                                    <span className="text-slate-500">{count} ({pct.toFixed(0)}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Plan and Badge Status */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Member Profile</h3>
                                <div className="space-y-4 mt-4">
                                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-850">
                                        <span className="text-sm text-slate-500">Plan</span>
                                        <span className="text-sm font-semibold capitalize">{user?.plan === "user_premium" ? "Premium" : "Free"}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-850">
                                        <span className="text-sm text-slate-500">Badge</span>
                                        {user?.plan === "user_premium" || user?.role === "admin" ? (
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                                <Award className="w-3 h-3 fill-current" /> Verified Contributor
                                            </span>
                                        ) : (
                                            <span className="text-sm text-slate-400">None</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {user?.plan !== "user_premium" && user?.role !== "admin" && (
                                <div className="mt-8 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                    <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">Upgrade to Lifetime Premium</h4>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Write premium wisdom, get badges, and export to PDF.</p>
                                    <Button
                                        onClick={() => router.push("/plans")}
                                        className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer"
                                    >
                                        Upgrade now (৳1500)
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Lesson Tab */}
            {activeTab === "add" && (
                <div className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share a Life Lesson</h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Contribute to the collective wisdom of Lexmora</p>
                    </div>

                    <form onSubmit={handleCreateLesson} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-750 dark:text-zinc-300 mb-2">Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Failure is the greatest feedback mechanism"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Wisdom Description / Body</label>
                            <textarea
                                required
                                placeholder="Detail your experience, key findings, and models to practice..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Emotional Tone</label>
                                <select
                                    value={emotionalTone}
                                    onChange={(e) => setEmotionalTone(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                >
                                    {tones.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Cover Image URL (Optional)</label>
                            <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Visibility</label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                >
                                    <option value="public">Public (visible to feed)</option>
                                    <option value="private">Private (only for you)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Access Level</label>
                                <select
                                    value={accessLevel}
                                    onChange={(e) => setAccessLevel(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                >
                                    <option value="free">Free (visible to everyone)</option>
                                    <option value="premium">Premium (visible only to Premium users)</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={submitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold transition cursor-pointer"
                        >
                            Publish Wisdom
                        </Button>
                    </form>
                </div>
            )}

            {/* My Lessons Tab */}
            {activeTab === "my" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Manage My Lessons</h3>
                        <Button
                            onClick={() => router.push("/dashboard/user?tab=add")}
                            className="bg-zinc-950 text-white dark:bg-blue-600 rounded-lg text-xs font-semibold py-2 px-4 cursor-pointer"
                        >
                            Add New
                        </Button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading lessons...</div>
                    ) : myLessons.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            You have not shared any life lessons yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/50 dark:border-zinc-850">
                                        <th className="py-4 px-6">Lesson</th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6 text-center">Visibility</th>
                                        <th className="py-4 px-6 text-center">Access</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                                    {myLessons.map((lesson) => (
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
                                                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Calendar className="w-3.5 h-3.5" /> {new Date(lesson.createdAt).toLocaleDateString()}
                                                        </span>
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
                                                    onClick={() => handleUpdateVisibility(lesson._id, lesson.visibility)}
                                                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                                                >
                                                    {lesson.visibility === "public" ? (
                                                        <>
                                                            <Eye className="w-3.5 h-3.5 text-indigo-500" /> Public
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Private
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => handleUpdateAccess(lesson._id, lesson.accessLevel)}
                                                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                                                >
                                                    {lesson.accessLevel === "premium" ? (
                                                        <>
                                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Premium
                                                        </>
                                                    ) : (
                                                        <>
                                                            Free
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onClick={() => handleDeleteLesson(lesson._id)}
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "fav" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-850">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">My Favorites</h3>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading favorites...</div>
                    ) : favorites.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No favorites saved yet. Browse public lessons to add some!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/50 dark:border-zinc-850">
                                        <th className="py-4 px-6">Lesson</th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6 text-center">Access</th>
                                        <th className="py-4 px-6 text-center">Remove</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                                    {favorites.map((lesson) => (
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
                                                        <span className="text-xs text-slate-400">By {lesson.authorName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-full">
                                                    {lesson.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {lesson.accessLevel === "premium" ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                                                        <Star className="w-3.5 h-3.5 fill-current" /> Premium
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-500">Free</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    onClick={() => handleUnfavorite(lesson._id)}
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="space-y-10">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                <div className="relative">
                                    <img
                                        src={user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || "")}`}
                                        alt={user?.name}
                                        className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900 object-cover"
                                    />
                                    {user?.plan === "user_premium" && (
                                        <span className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1 rounded-full text-xs shadow" title="Premium Lifetime Member">
                                            ⭐
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                                        {user?.name}
                                        {user?.plan === "user_premium" && (
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                                Premium ⭐
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{user?.email}</p>
                                    <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                                        <div className="bg-slate-50 dark:bg-slate-950 border border-zinc-200/40 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                            Lessons Shared: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{totalAdded}</span>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-950 border border-zinc-200/40 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                            Favorites Saved: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{totalSaved}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div className="mt-10 border-t border-zinc-100 dark:border-zinc-800/80 pt-8">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Update Profile Information</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user?.email || ""}
                                            className="w-full p-3 bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800/60 rounded-xl cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Avatar URL</label>
                                    <input
                                        type="text"
                                        value={profileImage}
                                        onChange={(e) => setProfileImage(e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={updatingProfile}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-6 font-semibold transition cursor-pointer"
                                >
                                    Save Changes
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Own Public Lessons Grid */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Public Wisdom</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Lessons you've shared with the community</p>
                        </div>

                        {myLessons.filter(l => l.visibility === "public").length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 text-center text-slate-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                You haven't shared any public lessons yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {myLessons
                                    .filter(l => l.visibility === "public")
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((lesson) => (
                                        <div
                                            key={lesson._id}
                                            className="flex flex-col rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm overflow-hidden group hover:border-zinc-350 dark:hover:border-zinc-700 transition-all"
                                        >
                                            <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                                                <img
                                                    src={lesson.coverImage}
                                                    alt={lesson.title}
                                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                {lesson.accessLevel === 'premium' && (
                                                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                                        ⭐ Premium
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E2E8F0] text-[#27374D] border-[#E2E8F0] dark:bg-[#27374D]/40 dark:text-[#9DB2BF] dark:border-[#27374D]/50 border uppercase tracking-wider">
                                                            {lesson.category}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug">
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-body leading-relaxed line-clamp-3">
                                                        {lesson.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                                                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                                        {new Date(lesson.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                                        {lesson.readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UserDashboardPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading user dashboard...</div>}>
            <UserDashboardContent />
        </Suspense>
    );
}
