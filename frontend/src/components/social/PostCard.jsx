import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocialFeed } from '../../context/SocialFeedContext';
import { formatCompactNumber } from '../../utils/socialFeed';
import PlayerBadge from './PlayerBadge';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => {
  const { likePost, savePost, sharePost, reportPost } = useSocialFeed();
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/65 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-amber-300 text-sm font-bold text-slate-950"
            to={`/dashboard/social-feed/players/${post.profile.id}`}
          >
            {post.profile.avatar}
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link className="font-semibold text-white" to={`/dashboard/social-feed/players/${post.profile.id}`}>
                {post.profile.name}
              </Link>
              <PlayerBadge label={post.level} tone={post.level} />
              {post.badgeState.verifiedPlayer ? <PlayerBadge label="Verified Player" tone="verified" /> : null}
              {post.badgeState.risingStar ? <PlayerBadge label="Rising Star" tone="rising" /> : null}
            </div>
            <p className="mt-1 text-sm text-slate-300">
              {post.sport} | {post.city} | {post.relativeTime}
            </p>
          </div>
        </div>
        <PlayerBadge label={post.playerType} />
      </div>

      <div
        className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${post.mediaTone} ${
          post.aspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'
        }`}
      >
        <div className="flex h-full items-end justify-between p-5">
          <span className="rounded-full bg-black/30 px-3 py-1 text-xs text-white">{post.mediaType.toUpperCase()}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-100">{post.mediaLabel}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {post.careerBoost ? <PlayerBadge label="Career Boost" tone="career" /> : null}
          {post.scoutViewed ? <PlayerBadge label="Scout Viewed" tone="scout" /> : null}
          {post.reported ? <PlayerBadge label="Reported" tone="Local" /> : null}
        </div>

        <p className="text-sm leading-6 text-slate-200">{post.caption}</p>

        <div className="flex flex-wrap gap-2 text-xs text-cyan-200">
          {post.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="grid gap-3 rounded-[1.5rem] bg-white/5 p-4 text-sm text-slate-300 sm:grid-cols-4">
          <span>Likes {formatCompactNumber(post.likes)}</span>
          <span>Comments {formatCompactNumber(post.commentsCount)}</span>
          <span>Shares {formatCompactNumber(post.shares)}</span>
          <span>Views {formatCompactNumber(post.views)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => likePost(post.id)}
          className={`rounded-full px-4 py-2 text-sm ${post.liked ? 'bg-rose-300/15 text-rose-100' : 'bg-white/5 text-white'}`}
        >
          {post.liked ? 'Unlike' : 'Like'}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((current) => !current)}
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white"
        >
          Comment
        </button>
        <button
          type="button"
          onClick={() => sharePost(post)}
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white"
        >
          Copy Link
        </button>
        <button
          type="button"
          onClick={() => sharePost(post, 'whatsapp')}
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => sharePost(post, 'facebook')}
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={() => savePost(post.id)}
          className={`rounded-full px-4 py-2 text-sm ${post.saved ? 'bg-amber-300/15 text-amber-100' : 'bg-white/5 text-white'}`}
        >
          {post.saved ? 'Saved' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => reportPost(post.id)}
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white"
        >
          Report
        </button>
      </div>

      {showComments ? <CommentSection post={post} /> : null}
    </article>
  );
};

export default PostCard;
