import { useState } from 'react';
import { playerTypes, socialSportOptions } from '../../data/socialFeedData';
import { useSocialFeed } from '../../context/SocialFeedContext';
import HashtagInput from './HashtagInput';
import PlayerTypeSelector from './PlayerTypeSelector';

const maxFileSizeBytes = 10 * 1024 * 1024;
const acceptedTypes = ['image/jpeg', 'image/png', 'video/mp4'];

const PostCreator = () => {
  const { createPost, composerLoading, currentCity } = useSocialFeed();
  const [caption, setCaption] = useState('');
  const [sport, setSport] = useState('Cricket');
  const [playerType, setPlayerType] = useState(playerTypes[0]);
  const [hashtags, setHashtags] = useState(['#Cricket', '#Chennai']);
  const [city, setCity] = useState(currentCity.name);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!acceptedTypes.includes(file.type) || file.size > maxFileSizeBytes) {
      setError('Use JPEG, PNG, or MP4 up to 10MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createPost({
      caption,
      sport,
      playerType,
      hashtags,
      city,
      mediaType: selectedFile?.type === 'video/mp4' ? 'video' : 'image',
      mediaName: selectedFile?.name,
    });

    setCaption('');
    setSport('Cricket');
    setPlayerType(playerTypes[0]);
    setHashtags(['#Cricket', '#Chennai']);
    setCity(currentCity.name);
    setSelectedFile(null);
    setError('');
  };

  return (
    <form className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/75">Post Creation</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Share a highlight</h2>
        </div>
        <button
          type="submit"
          disabled={composerLoading || caption.length === 0}
          className="rounded-full bg-gradient-to-r from-cyan-300 to-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {composerLoading ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Caption</span>
            <textarea
              maxLength={2200}
              className="min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-cyan-300/40"
              placeholder="Describe the moment, add context, and use hashtags scouts can search."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
            <span className="text-xs text-slate-400">{caption.length}/2200</span>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Upload media</span>
            <input
              accept=".mp4,.jpeg,.jpg,.png"
              className="w-full rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200"
              type="file"
              onChange={handleFile}
            />
          </label>

          {selectedFile ? (
            <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
              Ready: {selectedFile.name}
            </p>
          ) : null}
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
        </div>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Sport type</span>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
              value={sport}
              onChange={(event) => setSport(event.target.value)}
            >
              {socialSportOptions.filter((item) => item !== 'All Sports').map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm text-slate-200">Player type</span>
            <PlayerTypeSelector value={playerType} onChange={setPlayerType} />
          </div>

          <div className="space-y-2">
            <span className="text-sm text-slate-200">Hashtags</span>
            <HashtagInput hashtags={hashtags} onChange={setHashtags} />
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Location</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </label>
        </div>
      </div>
    </form>
  );
};

export default PostCreator;
