"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getLessonById } from "@/lib/api/lessons";
import { updateLesson } from "@/lib/actions/lessons";
import { Button } from "@heroui/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/uploadImage";

export default function UpdateLessonPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Growth");
    const [emotionalTone, setEmotionalTone] = useState("Reflective");
    const [coverImage, setCoverImage] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [accessLevel, setAccessLevel] = useState("free");

    const categories = ["Resilience", "Focus", "Growth", "Strategy", "Relationships", "Finance", "Wellness"];
    const tones = ["Inspiring", "Reflective", "Humorous", "Solemn", "Motivational", "Philosophical"];

    useEffect(() => {
        if (!id) return;
        async function fetchLesson() {
            try {
                const data = await getLessonById(id);
                if (data) {
                    setTitle(data.title || "");
                    setDescription(data.description || "");
                    setCategory(data.category || "Growth");
                    setEmotionalTone(data.emotionalTone || "Reflective");
                    setCoverImage(data.coverImage || "");
                    setVisibility(data.visibility || "public");
                    setAccessLevel(data.accessLevel || "free");
                } else {
                    toast.error("Lesson not found");
                }
            } catch (err) {
                console.error("Error loading lesson:", err);
                toast.error("Failed to load lesson details.");
            } finally {
                setLoading(false);
            }
        }
        fetchLesson();
    }, [id]);

    const isPremium = user?.plan === "user_premium" || user?.role === "admin";

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (accessLevel === "premium" && !isPremium) {
            toast.error("Upgrade to Premium plan to make your lessons premium!");
            return;
        }

        setSubmitting(true);
        const result = await updateLesson(id, {
            title,
            description,
            category,
            emotionalTone,
            coverImage,
            visibility,
            accessLevel
        });
        setSubmitting(false);

        if (result) {
            toast.success("Lesson updated successfully!");
            router.push("/dashboard?tab=my");
            router.refresh();
        } else {
            toast.error("Failed to update lesson.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-headline">Update Life Lesson</h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-body">Modify your shared wisdom insights</p>
                </div>
                <Link
                    href="/dashboard?tab=my"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Link>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label htmlFor="edit-title" className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Title</label>
                    <input
                        id="edit-title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label htmlFor="edit-desc" className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Wisdom Description / Body</label>
                    <textarea
                        id="edit-desc"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="edit-category" className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Category</label>
                        <select
                            id="edit-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit-tone" className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Emotional Tone</label>
                        <select
                            id="edit-tone"
                            value={emotionalTone}
                            onChange={(e) => setEmotionalTone(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                        >
                            {tones.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Cover Image (Optional)</label>
                    <div className="space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const toastId = toast.loading("Uploading image...");
                                    const url = await uploadImage(file);
                                    toast.dismiss(toastId);
                                    if (url) {
                                        setCoverImage(url);
                                        toast.success("Image uploaded successfully!");
                                    }
                                }
                            }}
                            className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-950/40 dark:file:text-indigo-400 file:cursor-pointer hover:file:bg-indigo-100 transition"
                        />
                        {coverImage && (
                            <div className="relative w-full max-w-xs h-32 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setCoverImage("")}
                                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs transition cursor-pointer"
                                    title="Remove Image"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="edit-visibility" className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Visibility</label>
                        <select
                            id="edit-visibility"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                        >
                            <option value="public">Public (visible to feed)</option>
                            <option value="private">Private (only for you)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit-access" className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Access Level</label>
                        <select
                            id="edit-access"
                            value={accessLevel}
                            disabled={!isPremium}
                            title={!isPremium ? "Upgrade to Premium to create paid lessons." : ""}
                            onChange={(e) => setAccessLevel(e.target.value)}
                            className={`w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer ${!isPremium ? 'opacity-65 cursor-not-allowed' : ''}`}
                        >
                            <option value="free">Free (visible to everyone)</option>
                            <option value="premium">Premium (visible only to Premium users)</option>
                        </select>
                        {!isPremium && (
                            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1.5 font-semibold">
                                Upgrade to Premium to create paid lessons.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        isLoading={submitting}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold transition cursor-pointer"
                    >
                        Update Wisdom
                    </Button>
                    <Button
                        as={Link}
                        href="/dashboard?tab=my"
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-300 rounded-xl py-3 px-6 font-semibold transition cursor-pointer"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
