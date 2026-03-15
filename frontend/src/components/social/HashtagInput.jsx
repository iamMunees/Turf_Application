import { useMemo, useState } from 'react';
import { useSocialFeed } from '../../context/SocialFeedContext';
import { getHashtagSuggestions } from '../../utils/socialFeed';

const HashtagInput = ({ hashtags, onChange }) => {
  const { popularHashtags } = useSocialFeed();
  const [inputValue, setInputValue] = useState('');

  const suggestions = useMemo(
    () => getHashtagSuggestions(inputValue, popularHashtags),
    [inputValue, popularHashtags]
  );

  const addTag = (value) => {
    const normalized = value.startsWith('#') ? value : `#${value.replace(/\s+/g, '')}`;
    if (hashtags.includes(normalized)) {
      setInputValue('');
      return;
    }
    onChange([...hashtags, normalized]);
    setInputValue('');
  };

  const handleKeyDown = (event) => {
    if ((event.key === 'Enter' || event.key === ',') && inputValue.trim()) {
      event.preventDefault();
      addTag(inputValue.trim());
    }
  };

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
        placeholder="Add hashtags"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(hashtags.filter((item) => item !== tag))}
            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => addTag(tag)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HashtagInput;
