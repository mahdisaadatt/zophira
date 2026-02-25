'use client';

import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageCircle,
  Send,
  Star,
  ChevronLeft,
  ChevronRight,
  Reply,
  Trash2,
  CornerDownLeft,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { hasProfanity } from '@/lib/profanity';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  rating: number;
  user: User;
  parentId?: string | null;
  replies?: Comment[];
}

interface CommentsProps {
  productId?: string;
  blogPostId?: string;
  currentUserId?: string;
}

export function Comments({
  productId,
  blogPostId,
  currentUserId,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const COMMENTS_PER_PAGE = 10;

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [productId, blogPostId]);

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams();
      if (productId) params.append('productId', productId);
      if (blogPostId) params.append('blogPostId', blogPostId);

      const response = await fetch(`/api/comments?${params}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async (parentId: string) => {
    if (!replyText[parentId]?.trim() || !currentUserId) return;
    if (hasProfanity(replyText[parentId])) {
      toast.error('متن پاسخ شامل کلمات نامناسب است. لطفاً متن را اصلاح کنید.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText[parentId],
          userId: currentUserId,
          productId,
          blogPostId,
          parentId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setReplyText(prev => ({ ...prev, [parentId]: '' }));
        setReplyOpen(prev => ({ ...prev, [parentId]: false }));
        fetchComments();
        toast.success('پاسخ شما ثبت شد');
      } else {
        toast.error(`خطا در ثبت پاسخ: ${data.error || 'عدم موفقیت در ثبت'}`);
      }
    } catch (e) {
      console.error('Reply error', e);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchComments();
        toast.success('نظر با موفقیت حذف شد');
      } else {
        toast.error(data.error || 'حذف نظر ناموفق بود');
      }
    } catch (e) {
      console.error('Delete comment error', e);
      toast.error('خطا در حذف نظر');
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !currentUserId) return;
    if (hasProfanity(newComment)) {
      toast.error('متن نظر شامل کلمات نامناسب است. لطفاً متن را اصلاح کنید.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          rating: newRating,
          userId: currentUserId,
          productId,
          blogPostId,
        }),
      });

      const data = await response.json();

      console.log('API Response:', data);
      console.log('Response status:', response.status);

      if (data.success) {
        setNewComment('');
        setNewRating(5);
        fetchComments(); // Refresh comments
      } else {
        console.error('API Error:', data);
        alert(`خطا در ثبت نظر: ${data.error || 'Failed to post comment'}`);
      }
    } catch (error) {
      console.error('Network/Parse Error:', error);
      alert('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
    });
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.lastName || 'کاربر ناشناس';
  };

  const getUserInitials = (user: User) => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  // Pagination calculations
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const currentComments = comments.slice(startIndex, endIndex);
  // Counts including replies for info text
  const totalWithReplies = comments.reduce(
    (sum, c) => sum + 1 + ((c.replies?.length as number) || 0),
    0
  );
  const visibleWithReplies = currentComments.reduce(
    (sum, c) => sum + 1 + ((c.replies?.length as number) || 0),
    0
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to comments section
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      {/* Comments Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 text-right mb-1">
          دیدگاه کاربران ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {currentUserId ? (
        <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
          <div className="space-y-4">
            {/* Rating Selection */}
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                امتیاز شما:
              </label>
              <div className="flex items-center justify-end gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`p-1 transition-colors hover:scale-110 ${
                      star <= newRating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="نظر خود را درباره این محصول بنویسید..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="min-h-[80px] sm:min-h-[100px] text-right resize-none border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end">
              <Button
                onClick={submitComment}
                disabled={!newComment.trim() || submitting}
                className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 text-sm rounded-lg transition-all"
              >
                <Send className="h-4 w-4 ml-2" />
                {submitting ? 'در حال ارسال...' : 'ارسال نظر'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 sm:p-8 bg-gray-50 rounded-lg border text-center">
          <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            برای ثبت نظر، لطفاً وارد حساب کاربری خود شوید
          </p>
          <Button
            onClick={() => signIn()}
            variant="outline"
            className="text-sm px-4 py-2 rounded-lg"
          >
            ورود به حساب کاربری
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div id="comments-section" className="space-y-4">
        {loading ? (
          <Loading label="در حال بارگذاری نظرات..." />
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">
              هنوز نظری ثبت نشده است
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              اولین نفری باشید که نظر می‌دهد!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {currentComments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 sm:h-11 sm:w-11">
                        <AvatarImage src={comment.user.image} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                          {getUserInitials(comment.user)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with name, date, and rating */}
                      <div className="flex flex-col justify-center mb-3 text-right">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-center">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {getUserDisplayName(comment.user)}
                            </h4>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <div className="flex flex-wrap justify-end items-end gap-1 sm:gap-2">
                            {/* Actions */}
                            {currentUserId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() =>
                                  setReplyOpen(prev => ({
                                    ...prev,
                                    [comment.id]: !prev[comment.id],
                                  }))
                                }
                              >
                                <Reply className="w-4 h-4 ml-1" /> پاسخ
                              </Button>
                            )}
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
                                onClick={() => setDeleteTargetId(comment.id)}
                              >
                                <Trash2 className="w-4 h-4 ml-1" /> حذف
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${
                                star <= comment.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment text */}
                      <div className="text-right">
                        <p className="text-gray-700 text-[13px] sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>

                      {/* Reply editor */}
                      {replyOpen[comment.id] && currentUserId && (
                        <div className="mt-3 pr-0 sm:pr-4">
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
                              <Textarea
                                placeholder="پاسخ خود را بنویسید..."
                                value={replyText[comment.id] || ''}
                                onChange={e =>
                                  setReplyText(prev => ({
                                    ...prev,
                                    [comment.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={e => {
                                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                    e.preventDefault();
                                    submitReply(comment.id);
                                  }
                                }}
                                maxLength={500}
                                className="min-h-[100px] sm:min-h-[80px] w-full sm:w-auto flex-1 text-right resize-none border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg"
                              />
                              <div className="flex w-full sm:w-auto flex-col gap-2 sm:gap-3 sm:items-stretch">
                                <Button
                                  onClick={() => submitReply(comment.id)}
                                  disabled={!replyText[comment.id]?.trim() || submitting}
                                  className="bg-primary hover:bg-primary/90 text-white h-10 px-3 whitespace-nowrap w-full sm:w-auto"
                                >
                                  <CornerDownLeft className="w-4 h-4 ml-1" />
                                  ارسال پاسخ
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 px-3 w-full sm:w-auto"
                                  onClick={() =>
                                    setReplyOpen(prev => ({ ...prev, [comment.id]: false }))
                                  }
                                >
                                  انصراف
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                              <span>می‌توانید با Ctrl+Enter هم ارسال کنید</span>
                              <span>{((replyText[comment.id]?.length || 0)).toLocaleString('fa-IR')}/500</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies list */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 sm:mt-4 sm:border-r-2 border-gray-100 pr-2 sm:pr-3 space-y-2 sm:space-y-3 bg-gray-50/50 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0">
                          {comment.replies.map(reply => (
                            <div
                              key={reply.id}
                              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white/80 p-3"
                            >
                              <div className="flex-shrink-0">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.user.image} />
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                    {getUserInitials(reply.user)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-right">
                                    <div className="text-xs font-medium text-gray-900">
                                      {getUserDisplayName(reply.user)}
                                    </div>
                                    <div className="text-[11px] text-gray-500">
                                      {formatDate(reply.createdAt)}
                                    </div>
                                  </div>
                                  {isAdmin && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-[11px] text-red-600 hover:text-red-700"
                                      onClick={() => setDeleteTargetId(reply.id)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5 ml-1" /> حذف
                                    </Button>
                                  )}
                                </div>
                                <div className="text-right text-[13px] sm:text-sm text-gray-700 break-words whitespace-pre-wrap leading-7">
                                  {reply.content}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap -mx-2 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => {
                      // Show first page, last page, current page, and pages around current page
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!showPage) {
                        // Show ellipsis
                        if (page === 2 && currentPage > 4) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        if (
                          page === totalPages - 1 &&
                          currentPage < totalPages - 3
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="min-w-[40px] h-10"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  بعدی
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            {comments.length > 0 && (
              <div className="text-center text-sm text-gray-500 mt-4">
                نمایش {visibleWithReplies} از {totalWithReplies} نظر
              </div>
            )}
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
              <AlertDialogContent
                onOverlayClick={() => setDeleteTargetId(null)}
                onEscapeKeyDown={() => setDeleteTargetId(null)}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>حذف نظر</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا از حذف این نظر مطمئن هستید؟ این عمل غیرقابل بازگشت است.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-start sm:flex-row-reverse gap-2">
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={async () => {
                      const id = deleteTargetId;
                      setDeleteTargetId(null);
                      if (id) await deleteComment(id);
                    }}
                  >
                    حذف
                  </AlertDialogAction>
                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
