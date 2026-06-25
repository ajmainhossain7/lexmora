'use client';

import { Button } from '@heroui/react';
import toast from 'react-hot-toast';
import { uploadImage } from '@/lib/uploadImage';

export default function AdminProfile({
  session,
  stats,
  profileName,
  setProfileName,
  profileImage,
  setProfileImage,
  updatingProfile,
  handleUpdateAdminProfile
}) {
  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left animate-fade-in animate-duration-300">
          <div className="relative">
            <img
              src={session?.user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(session?.user?.name || "")}`}
              alt={session?.user?.name}
              className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900 object-cover"
            />
            <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1 rounded-full text-xs shadow" title="Administrator Role">
              🛡️
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              {session?.user?.name}
              <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400 capitalize">
                Admin Role
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{session?.user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
              <div className="bg-slate-50 dark:bg-slate-950 border border-zinc-200/40 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-650 dark:text-zinc-400">
                Total Platform Users: <span className="font-extrabold text-slate-850 dark:text-zinc-200">{stats?.totalUsers || 0}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-zinc-200/40 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-650 dark:text-zinc-400">
                Total Platform Lessons: <span className="font-extrabold text-slate-850 dark:text-zinc-200">{stats?.totalLessons || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="mt-10 border-t border-zinc-155 dark:border-zinc-800/80 pt-8 animate-fade-in animate-duration-300">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Update Admin Profile</h3>
          <form onSubmit={handleUpdateAdminProfile} className="space-y-6 max-w-xl">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || ""}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-905 text-slate-400 border border-slate-200 dark:border-slate-800/60 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-350 mb-2">Avatar Profile Image</label>
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
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 text-slate-808 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-650 dark:file:bg-indigo-950/40 dark:file:text-indigo-400 file:cursor-pointer hover:file:bg-indigo-100 transition"
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
              className="bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl py-3 px-6 font-semibold transition cursor-pointer"
            >
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
