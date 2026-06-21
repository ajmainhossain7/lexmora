import { Star, Trash2 } from "lucide-react";
import { Button } from "@heroui/react";

export default function MyFavorites({
    loading,
    favorites,
    handleUnfavorite
}) {
    return (
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
    );
}
