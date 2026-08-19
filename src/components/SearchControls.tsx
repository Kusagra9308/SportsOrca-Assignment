import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface SearchControlsProps {
  currentSubreddit: string;
  onSearch: (subreddit: string) => void;
  isLoading: boolean;
}

const PRESET_SUBREDDITS = [
  'technology',
  'programming',
  'sports',
  'movies',
  'science',
  'gaming',
  'news'
];

export const SearchControls: React.FC<SearchControlsProps> = ({
  currentSubreddit,
  onSearch,
  isLoading
}) => {
  const [inputVal, setInputVal] = useState(currentSubreddit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (sub: string) => {
    setInputVal(sub);
    onSearch(sub);
  };

  return (
    <div className="bg-reddit-card rounded-2xl p-6 border border-reddit-border shadow-xl space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-mono font-bold">
            r/
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="enter subreddit (e.g. technology)"
            disabled={isLoading}
            className="w-full pl-9 pr-4 py-3.5 bg-reddit-dark border border-reddit-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-reddit-orange focus:ring-1 focus:ring-reddit-orange transition-all font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-reddit-orange to-orange-600 hover:from-orange-600 hover:to-reddit-orange disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-reddit-orange/20 hover:shadow-reddit-orange/30 flex items-center justify-center gap-2 transition-all flex-shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Check Vibe</span>
            </>
          )}
        </button>
      </form>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs text-gray-400 font-medium">Try popular:</span>
        {PRESET_SUBREDDITS.map((sub) => (
          <button
            key={sub}
            onClick={() => handleChipClick(sub)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              currentSubreddit.toLowerCase() === sub.toLowerCase()
                ? 'bg-reddit-orange text-white border-reddit-orange shadow-md shadow-reddit-orange/20'
                : 'bg-reddit-dark text-gray-300 border-reddit-border hover:border-gray-500 hover:text-white'
            }`}
          >
            r/{sub}
          </button>
        ))}
      </div>
    </div>
  );
};
