"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { getMyLessons } from "@/lib/api/lessons";
import { getFavorites } from "@/lib/api/favorites";
import { createLesson, updateLesson, deleteLesson } from "@/lib/actions/lessons";
import { toggleFavorite } from "@/lib/actions/favorites";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically imported tab components for bundle size optimization
const UserOverview = dynamic(() => import("@/components/dashboard/user/UserOverview"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading overview...</div>
});
const AddLesson = dynamic(() => import("@/components/dashboard/user/AddLesson"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading form...</div>
});
const MyLessons = dynamic(() => import("@/components/dashboard/user/MyLessons"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading lessons...</div>
});
const MyFavorites = dynamic(() => import("@/components/dashboard/user/MyFavorites"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading favorites...</div>
});
const UserProfile = dynamic(() => import("@/components/dashboard/user/UserProfile"), {
    loading: () => <div className="p-12 text-center text-slate-500 animate-pulse">Loading profile...</div>
});

export default function UserDashboard() {
    const { data: session } = useSession();
    const user = session?.user;
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "overview";
    const view = searchParams.get("view");

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
            const response = await fetch("/api/user/update-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: profileName, image: profileImage }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to update profile information.");
            } else {
                // Force a fresh session so the new name/avatar shows immediately
                await authClient.getSession({ force: true });
                toast.success("Profile updated successfully!");
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
            author: {
                name: user.name,
                avatar: user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`
            },
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
            const myLessonsUrl = view === "user" ? "/dashboard?view=user&tab=my" : "/dashboard?tab=my";
            router.push(myLessonsUrl);
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
    const totalLikes = myLessons.reduce((acc, curr) => {
        const count = typeof curr.likes === 'number' ? curr.likes : (Array.isArray(curr.likes) ? curr.likes.length : 0);
        return acc + count;
    }, 0);
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

            {activeTab === "overview" && (
                <UserOverview
                    totalAdded={totalAdded}
                    totalLikes={totalLikes}
                    totalSaved={totalSaved}
                    tones={tones}
                    myLessons={myLessons}
                    favorites={favorites}
                    user={user}
                    router={router}
                    handleUpdateVisibility={handleUpdateVisibility}
                    handleUpdateAccess={handleUpdateAccess}
                    handleDeleteLesson={handleDeleteLesson}
                />
            )}

            {activeTab === "add" && (
                <AddLesson
                    handleCreateLesson={handleCreateLesson}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    category={category}
                    setCategory={setCategory}
                    emotionalTone={emotionalTone}
                    setEmotionalTone={setEmotionalTone}
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                    visibility={visibility}
                    setVisibility={setVisibility}
                    accessLevel={accessLevel}
                    setAccessLevel={setAccessLevel}
                    categories={categories}
                    tones={tones}
                    submitting={submitting}
                    isPremium={user?.plan === "user_premium" || user?.role === "admin"}
                />
            )}

            {activeTab === "my" && (
                <MyLessons
                    router={router}
                    loading={loading}
                    myLessons={myLessons}
                    handleUpdateVisibility={handleUpdateVisibility}
                    handleUpdateAccess={handleUpdateAccess}
                    handleDeleteLesson={handleDeleteLesson}
                />
            )}

            {activeTab === "fav" && (
                <MyFavorites
                    loading={loading}
                    favorites={favorites}
                    handleUnfavorite={handleUnfavorite}
                />
            )}

            {activeTab === "profile" && (
                <UserProfile
                    user={user}
                    totalAdded={totalAdded}
                    totalSaved={totalSaved}
                    handleUpdateProfile={handleUpdateProfile}
                    profileName={profileName}
                    setProfileName={setProfileName}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    updatingProfile={updatingProfile}
                    myLessons={myLessons}
                />
            )}
        </div>
    );
}
