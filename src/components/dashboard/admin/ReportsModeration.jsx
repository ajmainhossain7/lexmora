'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, ShieldAlert, X, User, Mail, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@heroui/react';

export default function ReportsModeration({
  reportsList,
  handleDeleteLesson,
  handleIgnoreReports
}) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Group reports by lessonId
  const grouped = {};
  reportsList.forEach((report) => {
    const lessonId = report.lessonId;
    if (!grouped[lessonId]) {
      grouped[lessonId] = {
        lessonId,
        lessonTitle: report.lessonTitle || 'Unknown Lesson',
        lessonAuthor: report.lessonAuthor || 'Unknown Creator',
        reports: []
      };
    }
    grouped[lessonId].reports.push(report);
  });

  const groupedReports = Object.values(grouped);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Moderation Reports List</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Grouped by reported lessons. Review claims and moderate content appropriately.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 py-1 px-3.5 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/20">
          {groupedReports.length} Flagged Lessons
        </span>
      </div>

      {groupedReports.length === 0 ? (
        <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-4">
          <ShieldAlert className="w-12 h-12 text-emerald-500" />
          <div>
            <h4 className="font-bold text-slate-800 dark:text-zinc-200">No reports submitted yet</h4>
            <p className="text-xs text-slate-400 mt-1">Everything is operational and clean!</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Reported Lesson</th>
                <th className="py-4 px-6">Creator</th>
                <th className="py-4 px-6 text-center">Report Count</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {groupedReports.map((group) => (
                <tr key={group.lessonId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                  <td className="py-4 px-6">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{group.lessonTitle}</h4>
                      <span className="text-[10px] text-slate-400">ID: {group.lessonId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-650 dark:text-zinc-300 font-medium">
                    {group.lessonAuthor}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3 h-3" />
                      {group.reports.length} reports
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => setSelectedGroup(group)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200"
                      >
                        View Reports ({group.reports.length})
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => handleDeleteLesson(group.lessonId)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer text-white bg-rose-600 hover:bg-rose-700"
                      >
                        Delete Lesson
                      </Button>
                      <Button
                        size="sm"
                        variant="bordered"
                        onClick={() => handleIgnoreReports(group.lessonId)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-zinc-55 hover:dark:bg-zinc-800 cursor-pointer"
                      >
                        Ignore
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal displaying reporter logs */}
      <AnimatePresence>
        {selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGroup(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 w-full max-w-xl shadow-2xl relative z-10 max-h-[80vh] flex flex-col text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-zinc-150 dark:border-zinc-800/80">
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white line-clamp-1">
                    Reports Log for "{selectedGroup.lessonTitle}"
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Created by {selectedGroup.lessonAuthor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="p-1 rounded-lg text-zinc-450 hover:text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable list of reports */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin">
                {selectedGroup.reports.map((report, idx) => (
                  <div 
                    key={report._id || idx} 
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850/60 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      {/* User Info */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{report.userName}</p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {report.userEmail}
                          </span>
                        </div>
                      </div>
                      
                      {/* Reason Badge */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-250/20">
                        {report.reason}
                      </span>
                    </div>

                    {/* Report details */}
                    <div className="space-y-1 bg-white dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-850/40">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Additional Details
                      </p>
                      <p className="text-xs text-slate-700 dark:text-zinc-300 font-body leading-relaxed whitespace-pre-wrap">
                        {report.details || <span className="text-slate-400 italic">No additional feedback provided.</span>}
                      </p>
                    </div>

                    {/* Date metadata */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Submitted: {new Date(report.createdAt).toLocaleString()}
                      </span>
                      <span>ID: {report._id}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons in footer of modal */}
              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800/80 flex justify-end gap-3">
                <Button
                  size="sm"
                  variant="flat"
                  onClick={() => setSelectedGroup(null)}
                  className="text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Close Log
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onClick={() => {
                    setSelectedGroup(null);
                    handleIgnoreReports(selectedGroup.lessonId);
                  }}
                  className="text-xs font-bold px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-zinc-50 hover:dark:bg-zinc-800 cursor-pointer"
                >
                  Ignore All
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => {
                    setSelectedGroup(null);
                    handleDeleteLesson(selectedGroup.lessonId);
                  }}
                  className="text-xs font-bold px-4 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
                >
                  Delete Lesson
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
