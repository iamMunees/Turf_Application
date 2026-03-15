import { useState } from 'react';
import { useSocialFeed } from '../../context/SocialFeedContext';

const emojiOptions = ['🔥', '👏', '🎯', '⚽', '🏏', '💪'];

const CommentSection = ({ post }) => {
  const { addComment } = useSocialFeed();
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');

  const handleSubmit = (event) => {
    event.preventDefault();
    addComment(post.id, message, selectedEmoji);
    setMessage('');
  };

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4">
      <div className="space-y-2">
        {post.comments.map((comment) => (
          <div key={comment.id} className="rounded-2xl bg-white/5 px-3 py-2 text-sm">
            <span className="font-semibold text-white">{comment.author}</span>
            <span className="ml-2 text-slate-300">{comment.text}</span>
            <span className="ml-2">{comment.emoji}</span>
          </div>
        ))}
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
          placeholder="Add a comment"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  selectedEmoji === emoji ? 'bg-cyan-300/15' : 'bg-white/5'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
