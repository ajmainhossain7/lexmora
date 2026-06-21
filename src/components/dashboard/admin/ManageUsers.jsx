'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@heroui/react';

export default function ManageUsers({
  usersList,
  handlePlanChange,
  handleRoleChange,
  handleDeleteUser,
  session
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-850">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Registered Users Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/50 dark:border-zinc-850">
              <th className="py-4 px-6">User Details</th>
              <th className="py-4 px-6">Email Address</th>
              <th className="py-4 px-6 text-center">Lessons Created</th>
              <th className="py-4 px-6 text-center">Plan Status</th>
              <th className="py-4 px-6 text-center">User Role</th>
              <th className="py-4 px-6 text-center">Actions</th>
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
                <td className="py-4 px-6 text-slate-500 dark:text-zinc-400 font-medium">{usr.email}</td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-750 dark:text-zinc-300">
                    {usr.lessonsCount || 0} lessons
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <select
                    value={usr.plan}
                    onChange={(e) => handlePlanChange(usr.id || usr._id, e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-lg p-1.5 border border-zinc-200 dark:border-zinc-850 focus:outline-none cursor-pointer"
                  >
                    <option value="user_free">Free Starter</option>
                    <option value="user_premium">Lifetime Premium</option>
                  </select>
                </td>
                <td className="py-4 px-6 text-center">
                  <select
                    value={usr.role}
                    onChange={(e) => handleRoleChange(usr.id || usr._id, e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-lg p-1.5 border border-zinc-200 dark:border-zinc-850 focus:outline-none cursor-pointer"
                    disabled={usr.email === session?.user?.email}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4 px-6 text-center">
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    onClick={() => handleDeleteUser(usr.id || usr._id, usr.email)}
                    disabled={usr.email === session?.user?.email}
                    className="cursor-pointer"
                    title={usr.email === session?.user?.email ? "You cannot delete yourself" : "Delete user account"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
