import { useState } from 'react';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Comment {
  id: number;
  author: string;
  authorImage?: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: 'Dr. James Wilson',
    authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80',
    content: 'Excellent article! The insights about smart inhalers are particularly relevant to my practice. I\'ve seen firsthand how connected devices improve patient compliance.',
    date: '2024-01-16T10:30:00',
    likes: 12,
    replies: [
      {
        id: 2,
        author: 'Dr. Sarah Chen',
        authorImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80',
        content: 'Thank you, Dr. Wilson! We\'re actually planning a follow-up piece specifically on respiratory care technology. Stay tuned!',
        date: '2024-01-16T14:20:00',
        likes: 5,
      },
    ],
  },
  {
    id: 3,
    author: 'Maria Rodriguez',
    content: 'As a home care patient, this gives me hope. The ability to monitor my condition from home has been life-changing.',
    date: '2024-01-15T09:15:00',
    likes: 8,
  },
];

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now(),
        author: 'Guest User',
        content: newComment,
        date: new Date().toISOString(),
        likes: 0,
      };

      setComments([comment, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
      toast.success('Comment posted successfully!');
    }, 1000);
  };

  const handleSubmitReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now(),
      author: 'Guest User',
      content: replyContent,
      date: new Date().toISOString(),
      likes: 0,
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      return comment;
    }));

    setReplyTo(null);
    setReplyContent('');
    toast.success('Reply posted successfully!');
  };

  const handleLike = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, likes: reply.likes + 1 }
              : reply
          ),
        };
      }
      return comment;
    }));
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex space-x-3 ${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex-shrink-0">
        {comment.authorImage ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={comment.authorImage}
              alt={comment.author}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-medical-blue/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-medical-blue" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="bg-soft-gray rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-900">{comment.author}</span>
            <span className="text-xs text-slate-500">
              {new Date(comment.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-sm text-slate-700">{comment.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={() => handleLike(comment.id)}
            className="text-xs text-slate-500 hover:text-medical-blue transition-colors"
          >
            Like ({comment.likes})
          </button>
          {!isReply && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-xs text-slate-500 hover:text-medical-blue transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyTo === comment.id && (
          <div className="mt-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-medical-blue/10 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-medical-blue" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                  className="px-3 py-1 bg-medical-blue text-white text-xs rounded-lg 
                           hover:bg-medical-blue-dark transition-colors disabled:opacity-50"
                >
                  Post Reply
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-medical-blue/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-medical-blue" />
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-medical-blue text-white rounded-lg 
                         hover:bg-medical-blue-dark transition-colors text-sm font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
