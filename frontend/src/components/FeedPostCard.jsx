const FeedPostCard = ({ post }) => {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
          {post.author
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')}
        </div>
        <div>
          <p className="font-medium text-white">{post.author}</p>
          <p className="text-sm text-slate-400">
            {post.role} • {post.sport} • {post.timeAgo}
          </p>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(8,47,73,0.65),_rgba(12,18,34,0.95))]">
        <div className="flex h-64 items-end p-5">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-100">{post.mediaLabel}</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{post.caption}</p>
      <div className="mt-5 flex gap-3 text-sm text-slate-400">
        <button className="rounded-full border border-white/10 px-4 py-2 text-white">Like {post.likes}</button>
        <button className="rounded-full border border-white/10 px-4 py-2">Comment {post.comments}</button>
        <button className="rounded-full border border-white/10 px-4 py-2">Share</button>
      </div>
    </article>
  );
};

export default FeedPostCard;
