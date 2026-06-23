'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Bookmark, BookmarkCheck, MessageCircle, Share2,
  ArrowLeft, Clock, Tag, Zap, Lock, Send, Loader2,
  AlertCircle, ChevronRight, Star, FileText, Flag
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { getLessonById } from '@/lib/api/lessons';
import { getComments } from '@/lib/api/comments';
import { checkFavorite } from '@/lib/api/favorites';
import { toggleLikeLesson } from '@/lib/actions/lessons';
import { toggleFavorite } from '@/lib/actions/favorites';
import { createComment } from '@/lib/actions/comments';
import { createReport } from '@/lib/actions/reports';
import toast from 'react-hot-toast';

// ── Emotional tone colour map ────────────────────────────────────────────────
const toneColors = {
  Hopeful:    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  Resilient:  { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400',    border: 'border-blue-200 dark:border-blue-800' },
  Reflective: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  Motivated:  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  Grateful:   { bg: 'bg-pink-100 dark:bg-pink-900/30',   text: 'text-pink-700 dark:text-pink-400',   border: 'border-pink-200 dark:border-pink-800' },
};

// ── Relative time helper ─────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [lesson, setLesson]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [comments, setComments]     = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked]           = useState(false);
  const [likeCount, setLikeCount]   = useState(0);
  const [favorited, setFavorited]   = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied]         = useState(false);
  const commentRef = useRef(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const user = session?.user;
  const isPremiumUser = user?.plan === 'user_premium' || user?.role === 'admin';
  const isPremiumLesson = lesson?.accessLevel === 'premium';
  const isLocked = isPremiumLesson && !isPremiumUser;

  // ── Load lesson ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      const data = await getLessonById(id);
      if (!data) {
        setLoading(false);
        return;
      }
      setLesson(data);
      const likesCount = typeof data.likes === 'number' ? data.likes : (Array.isArray(data.likes) ? data.likes.length : 0);
      setLikeCount(likesCount);
      if (user) {
        const isLiked = Array.isArray(data.likes) ? data.likes.includes(user.id) : false;
        setLiked(isLiked);
      }
      setLoading(false);
    }
    load();
  }, [id, user]);

  // ── Load comments ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getComments(id).then(setComments);
  }, [id]);

  // ── Check favorite state ────────────────────────────────────────────────────
  useEffect(() => {
    if (!id || !user) return;
    checkFavorite(id).then(setFavorited);
  }, [id, user]);

  // ── Handle escape key closure for report modal ────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setReportModalOpen(false);
      }
    };
    if (reportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reportModalOpen]);

  // ── Like handler ────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!user) { toast.error('Please sign in to like this lesson.'); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    const prev = liked;
    setLiked(!prev);
    setLikeCount(c => prev ? c - 1 : c + 1);
    const result = await toggleLikeLesson(id);
    if (!result) {
      setLiked(prev);
      setLikeCount(c => prev ? c + 1 : c - 1);
      toast.error('Failed to update like.');
    }
    setLikeLoading(false);
  };

  // ── Favorite handler ─────────────────────────────────────────────────────────
  const handleFavorite = async () => {
    if (!user) { toast.error('Please sign in to save lessons.'); return; }
    if (favLoading) return;
    setFavLoading(true);
    const prev = favorited;
    setFavorited(!prev);
    const result = await toggleFavorite(id);
    if (!result) {
      setFavorited(prev);
      toast.error('Failed to update favorites.');
    } else {
      toast.success(result.favorited ? '📌 Saved to Favorites!' : 'Removed from Favorites');
      setFavorited(result.favorited);
    }
    setFavLoading(false);
  };

  // ── Share handler ─────────────────────────────────────────────────────────────
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('🔗 Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Export PDF ────────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (!isPremiumUser) {
      toast.error('PDF exporting is a Premium feature. Please upgrade your plan!');
      return;
    }
    window.print();
  };

  // ── Report handler ────────────────────────────────────────────────────────────
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to report a lesson.');
      return;
    }
    setReportSubmitting(true);
    const reportData = {
      lessonId: id,
      lessonTitle: lesson.title,
      reason: reportReason,
      details: reportDetails.trim(),
    };
    const result = await createReport(reportData);
    if (result) {
      toast.success('Thank you. The report has been submitted to moderators.');
      setReportModalOpen(false);
      setReportDetails('');
      setReportReason('Spam');
    } else {
      toast.error('Failed to submit report. Please try again.');
    }
    setReportSubmitting(false);
  };

  // ── Comment submit ────────────────────────────────────────────────────────────
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a comment.'); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    const newComment = {
      lessonId: id,
      userId: user.id,
      authorName: user.name,
      authorAvatar: user.image || null,
      text: commentText.trim(),
    };
    const result = await createComment(newComment);
    if (result) {
      setComments(prev => [{ ...newComment, _id: result.insertedId, createdAt: new Date().toISOString() }, ...prev]);
      setCommentText('');
      toast.success('Comment posted!');
    } else {
      toast.error('Failed to post comment.');
    }
    setSubmitting(false);
  };

  // ── Scroll to comments ────────────────────────────────────────────────────────
  const scrollToComments = () => commentRef.current?.scrollIntoView({ behavior: 'smooth' });

  // ── Tone styling ──────────────────────────────────────────────────────────────
  const tone = toneColors[lesson?.emotionalTone] || toneColors.Hopeful;

  if (loading) return <LessonDetailSkeleton />;

  if (!lesson) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
      <AlertCircle className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-6" />
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Lesson Not Found</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">This lesson may have been removed or doesn&apos;t exist.</p>
      <Link href="/lessons" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Lessons
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        <img
          src={lesson.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
          alt={lesson.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <Link
          href="/lessons"
          className="absolute top-5 left-5 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-sm font-semibold text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Premium badge */}
        {isPremiumLesson && (
          <div className="absolute top-5 right-5 sm:top-8 sm:right-8 inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Star className="w-3.5 h-3.5 fill-white" /> PREMIUM
          </div>
        )}

        {/* Title section overlaid on hero */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-4xl mx-auto w-full">
          <div className="flex flex-wrap gap-2 mb-3">
            {lesson.category && (
              <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                <Tag className="w-3 h-3" /> {lesson.category}
              </span>
            )}
            {lesson.emotionalTone && (
              <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                <Zap className="w-3 h-3" /> {lesson.emotionalTone}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-headline drop-shadow-sm">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">

        {/* Author row + engagement bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
              {lesson.author?.avatar ? (
                <img src={lesson.author.avatar} alt={lesson.author.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-500">
                  {(lesson.author?.name || 'A')[0]}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white text-sm">{lesson.author?.name || 'Anonymous'}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                {lesson.readTime && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.readTime}</span>
                )}
                {lesson.createdAt && (
                  <><span>·</span><span>{relativeTime(lesson.createdAt)}</span></>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleLike}
              disabled={likeLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                liked
                  ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-red-300 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
              <span>{likeCount}</span>
            </motion.button>

            {/* Favorite */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleFavorite}
              disabled={favLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                favorited
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 hover:text-indigo-500'
              }`}
            >
              {favorited ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{favorited ? 'Saved' : 'Save'}</span>
            </motion.button>

            {/* Comment jump */}
            <button
              onClick={scrollToComments}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-blue-400 hover:text-blue-500 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-all no-print"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all no-print ${
                isPremiumUser 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400' 
                  : 'bg-zinc-100 dark:bg-zinc-850/50 text-zinc-400 dark:text-zinc-650 border-zinc-250 dark:border-zinc-800/80 cursor-pointer'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button>

            {/* Report */}
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please sign in to report this lesson.');
                  return;
                }
                setReportModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-rose-450 hover:text-rose-500 transition-all no-print"
            >
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* ── Lesson Body ─────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Description / content */}
          <div className={`prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed text-zinc-700 dark:text-zinc-300 font-body ${isLocked ? 'select-none' : ''}`}>
            {isLocked ? (
              // Show first ~200 chars then blur
              <>
                <p>{lesson.description?.slice(0, 200)}…</p>
                {lesson.body && <p className="filter blur-sm pointer-events-none">{lesson.body?.slice(0, 400)}</p>}
              </>
            ) : (
              <>
                <p>{lesson.description}</p>
                {lesson.body && (
                  <div className="mt-6 whitespace-pre-wrap">{lesson.body}</div>
                )}
              </>
            )}
          </div>

          {/* ── Premium Lock Gate ──────────────────────────────────────────── */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 relative"
              >
                {/* blurred content preview strip */}
                <div className="absolute -top-28 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-white dark:to-zinc-950 pointer-events-none z-10" />

                {/* Lock card */}
                <div className="relative z-20 rounded-3xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 p-8 text-center shadow-xl space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-headline mb-1">This is a Premium Lesson</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mx-auto font-body leading-relaxed">
                      Upgrade to <span className="font-semibold text-amber-600 dark:text-amber-400">Lexmora Premium</span> to unlock full access to this lesson and all exclusive content.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/plans"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      Upgrade to Premium
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    {!user && (
                      <Link
                        href="/signin"
                        className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:border-zinc-400"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Tags / Tone Chip ──────────────────────────────────────────────── */}
        {!isLocked && lesson.emotionalTone && (
          <div className={`mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${tone.bg} ${tone.text} ${tone.border}`}>
            <Zap className="w-4 h-4" />
            Emotional Tone: {lesson.emotionalTone}
          </div>
        )}

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="my-12 border-t border-zinc-200 dark:border-zinc-800" />

        {/* ── Comments Section ──────────────────────────────────────────────── */}
        <div ref={commentRef} id="comments">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-headline mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            Comments
            <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500 ml-1">({comments.length})</span>
          </h2>

          {/* Comment form */}
          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3 items-start">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-zinc-500">
                      {(user.name || 'U')[0]}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex-grow relative">
                  <textarea
                    id="comment-textarea"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts on this lesson…"
                    aria-label="Write a comment"
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-body text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 transition-all resize-none shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {submitting ? 'Posting…' : 'Post'}
                  </motion.button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-body">
                <Link href="/signin" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>{' '}
                to join the discussion.
              </p>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {comments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-zinc-400 dark:text-zinc-600 text-sm font-body"
                >
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  No comments yet. Be the first to share your thoughts!
                </motion.div>
              ) : (
                comments.map((c, idx) => (
                  <motion.div
                    key={c._id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="flex gap-3"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-100 dark:border-zinc-700">
                      {c.authorAvatar ? (
                        <img src={c.authorAvatar} alt={c.authorName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-zinc-500">
                          {(c.authorName || 'A')[0]}
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className="flex-grow bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-4 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">{c.authorName || 'Anonymous'}</span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">{c.createdAt ? relativeTime(c.createdAt) : ''}</span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 font-body leading-relaxed">{c.text}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Printable Lesson view (hidden on screen, visible during printing) */}
      <div id="printable-lesson" className="hidden">
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', color: '#64748b' }}>
            Lexmora Premium Lesson · {lesson.category} · {lesson.emotionalTone}
          </p>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0.5rem 0', color: '#0f172a' }}>{lesson.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1e293b', margin: 0 }}>Shared by: {lesson.author?.name || 'Anonymous'}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{lesson.readTime} · {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : ''}</p>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>
          <p style={{ fontWeight: '600', fontSize: '1.125rem', color: '#0f172a', marginBottom: '1.5rem' }}>{lesson.description}</p>
          {lesson.body}
        </div>
      </div>

      {/* Report Lesson Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 space-y-6 text-left"
            >
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-headline flex items-center gap-2">
                  <Flag className="w-5 h-5 text-rose-500 fill-rose-500/10" /> Report Lesson
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-body mt-1">
                  Help us keep Lexmora safe and educational. Why are you reporting this lesson?
                </p>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4 font-body">
                <div>
                  <label htmlFor="report-reason" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Reason</label>
                  <select
                    id="report-reason"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-sm focus:outline-none transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value="Spam">Spam or Misleading</option>
                    <option value="Harassment">Harassment or Hate Speech</option>
                    <option value="Inappropriate">Inappropriate content / Nudity</option>
                    <option value="Copyright">Copyright Violation / Plagiarism</option>
                    <option value="Other">Other Reasons</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="report-details" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Details (Optional)</label>
                  <textarea
                    id="report-details"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any additional context..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-sm focus:outline-none transition-all resize-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl px-4 py-2 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    isLoading={reportSubmitting}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 py-2 font-bold text-xs transition-all cursor-pointer"
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────
function LessonDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[340px] sm:h-[420px] bg-zinc-200 dark:bg-zinc-800" />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
        </div>
        <div className="h-5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-5 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-5 w-3/5 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-40 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      </div>
    </div>
  );
}
