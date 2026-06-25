
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/uploadImage";

export default function UserProfile({
    user,
    totalAdded,
    totalSaved,
    handleUpdateProfile,
    profileName,
    setProfileName,
    profileImage,
    setProfileImage,
    updatingProfile,
    myLessons
}) {
    return (
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
                                <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Display Name</label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    required
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Email Address</label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    disabled
                                    value={user?.email || ""}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800/60 rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Avatar Profile Image</label>
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const toastId = toast.loading("Processing image...");
                                            const url = await uploadImage(file);
                                            toast.dismiss(toastId);
                                            if (url) {
                                                setProfileImage(url);
                                                toast.success("Avatar uploaded successfully!");
                                            }
                                        }
                                    }}
                                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-950/40 dark:file:text-indigo-400 file:cursor-pointer hover:file:bg-indigo-100 transition"
                                />
                                {profileImage && (
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                        <img src={profileImage} alt="Avatar preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setProfileImage("")}
                                            className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-[10px] leading-none transition cursor-pointer"
                                            title="Remove Image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
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
                                        {(lesson.isPremium === true || (lesson.accessLevel && lesson.accessLevel.toLowerCase() === 'premium')) && (
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
    );
}
