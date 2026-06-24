import { Calendar, Eye, EyeOff, Star, Trash2, Pencil } from "lucide-react";
import { Button } from "@heroui/react";
import { useSearchParams } from "next/navigation";

export default function MyLessons({
    router,
    loading,
    myLessons,
    handleUpdateVisibility,
    handleUpdateAccess,
    handleDeleteLesson
}) {
    const searchParams = useSearchParams();
    const view = searchParams.get("view");
    const addUrl = view === "user" ? "/dashboard?view=user&tab=add" : "/dashboard?tab=add";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Manage My Lessons</h3>
                <Button
                    onClick={() => router.push(addUrl)}
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
                                            {lesson.isPremium === true || (lesson.accessLevel && lesson.accessLevel.toLowerCase() === "premium") ? (
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
                                                color="primary"
                                                variant="light"
                                                onClick={() => {
                                                    const editUrl = view === "user"
                                                        ? `/dashboard/update-lesson/${lesson._id}?view=user`
                                                        : `/dashboard/update-lesson/${lesson._id}`;
                                                    router.push(editUrl);
                                                }}
                                            >
                                                <Pencil className="w-4.5 h-4.5" />
                                            </Button>
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
    );
}
