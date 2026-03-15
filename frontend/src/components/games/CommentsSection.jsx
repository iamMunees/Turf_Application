import { useState } from 'react';
import { Link } from 'react-router-dom';

const CommentReply = ({ comment, onReply, pendingCommentId }) => {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const submitReply = async (event) => {
    event.preventDefault();
    if (!replyText.trim()) {
      return;
    }
    await onReply(replyText.trim(), comment.id);
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <img
          src={comment.author.avatarUrl || 'https://placehold.co/64x64/0f172a/e2e8f0?text=A'}
          alt={comment.author.name}
          className="h-11 w-11 rounded-2xl object-cover"
        />
        <div>
          <Link to={`/dashboard/users/${comment.author.id}`} className="font-semibold text-white">
            {comment.author.name}
          </Link>
          <p className="text-sm text-slate-400">
            {comment.author.skillLevel} • {comment.author.playingPosition}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-200">{comment.text}</p>
      <button
        type="button"
        onClick={() => setIsReplying((current) => !current)}
        className="mt-3 text-sm font-semibold text-cyan-200"
      >
        Reply
      </button>

      {isReplying ? (
        <form onSubmit={submitReply} className="mt-4 space-y-3">
          <textarea
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            placeholder="Reply to this thread"
          />
          <button
            type="submit"
            disabled={pendingCommentId === comment.id}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {pendingCommentId === comment.id ? 'Posting...' : 'Post reply'}
          </button>
        </form>
      ) : null}

      {comment.replies?.length ? (
        <div className="mt-4 space-y-3 border-l border-white/10 pl-4">
          {comment.replies.map((reply) => (
            <CommentReply
              key={reply.id}
              comment={reply}
              onReply={onReply}
              pendingCommentId={pendingCommentId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CommentsSection = ({ comments, onSubmitComment, pendingCommentId }) => {
  const [message, setMessage] = useState('');

  const submitComment = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    await onSubmitComment(message.trim(), null);
    setMessage('');
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Match chat</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Comments & replies</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          {comments.length} thread{comments.length === 1 ? '' : 's'}
        </div>
      </div>

      <form onSubmit={submitComment} className="mt-5 space-y-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="w-full rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
          placeholder="Drop a note for the host or reply with your arrival update"
        />
        <button
          type="submit"
          disabled={pendingCommentId === 'root'}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
        >
          {pendingCommentId === 'root' ? 'Posting...' : 'Add comment'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {comments.length ? (
          comments.map((comment) => (
            <CommentReply
              key={comment.id}
              comment={comment}
              onReply={onSubmitComment}
              pendingCommentId={pendingCommentId}
            />
          ))
        ) : (
          <div className="rounded-[1.6rem] border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
            No comments yet. Start the thread.
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;
