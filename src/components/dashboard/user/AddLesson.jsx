import { Button } from "@heroui/react";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

export default function AddLesson({
    handleCreateLesson,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    emotionalTone,
    setEmotionalTone,
    coverImage,
    setCoverImage,
    visibility,
    setVisibility,
    accessLevel,
    setAccessLevel,
    categories,
    tones,
    submitting,
    isPremium
}) {
    return (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share a Life Lesson</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Contribute to the collective wisdom of Lexmora</p>
            </div>
            <form onSubmit={handleCreateLesson} className="space-y-6">
                <div>
                    <label htmlFor="lesson-title" className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Title</label>
                    <input
                        id="lesson-title"
                        type="text"
                        required
                        placeholder="e.g. Failure is the greatest feedback mechanism"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label htmlFor="lesson-desc" className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Wisdom Description / Body</label>
                    <textarea
                        id="lesson-desc"
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
                        <label htmlFor="lesson-category" className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Category</label>
                        <select
                            id="lesson-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lesson-tone" className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Emotional Tone</label>
                        <select
                            id="lesson-tone"
                            value={emotionalTone}
                            onChange={(e) => setEmotionalTone(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            {tones.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Cover Image (Optional)</label>
                    <div className="space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const toastId = toast.loading("Uploading image to ImgBB...");
                                    const url = await uploadImage(file);
                                    toast.dismiss(toastId);
                                    if (url) {
                                        setCoverImage(url);
                                        toast.success("Image uploaded successfully!");
                                    }
                                }
                            }}
                            className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-950/40 dark:file:text-indigo-400 file:cursor-pointer hover:file:bg-indigo-100 transition"
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
                        <label htmlFor="lesson-visibility" className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Visibility</label>
                        <select
                            id="lesson-visibility"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            <option value="public">Public (visible to feed)</option>
                            <option value="private">Private (only for you)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lesson-access" className="block text-sm font-semibold text-slate-755 dark:text-zinc-300 mb-2">Access Level</label>
                        <select
                            id="lesson-access"
                            value={accessLevel}
                            disabled={!isPremium}
                            title={!isPremium ? "Upgrade to Premium to create paid lessons." : ""}
                            onChange={(e) => setAccessLevel(e.target.value)}
                            className={`w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${!isPremium ? 'opacity-65 cursor-not-allowed' : ''}`}
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

                <Button
                    type="submit"
                    isLoading={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold transition cursor-pointer"
                >
                    Publish Wisdom
                </Button>
            </form>
        </div>
    );
}
