import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchControls } from './components/SearchControls';
import { VibeSummary } from './components/VibeSummary';
import { PostCard } from './components/PostCard';
import { SettingsModal } from './components/SettingsModal';
import { fetchSubredditHotPosts, RedditPost, ApiCredentials } from './services/redditApi';
import { analyzeTitleSentiment } from './utils/sentiment';
import { AlertCircle, Search, Filter, RefreshCw, Radio, Info } from 'lucide-react';

export function App() {
  const [subreddit, setSubreddit] = useState<string>('technology');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoNoticeMessage, setDemoNoticeMessage] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<ApiCredentials>(() => ({
    clientId: localStorage.getItem('reddit_client_id') || '',
    clientSecret: localStorage.getItem('reddit_client_secret') || ''
  }));

  const [activeFilter, setActiveFilter] = useState<'All' | 'Positive' | 'Neutral' | 'Negative'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadVibeData = async (sub: string, creds = credentials) => {
    setIsLoading(true);
    setError(null);
    setDemoNoticeMessage(null);

    try {
      const { posts: rawPosts, isDemo, message } = await fetchSubredditHotPosts(sub, 50, creds);
      const analyzed = rawPosts.map((p) => ({
        ...p,
        sentiment: analyzeTitleSentiment(p.title)
      }));
      setPosts(analyzed);
      setIsDemoMode(isDemo);
      if (isDemo && message) {
        setDemoNoticeMessage(message);
      }
    } catch (err: any) {
      setError(err.message || `Could not find r/${sub}. Please check the name and try again.`);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVibeData(subreddit);
  }, []);

  const handleSearch = (newSub: string) => {
    setSubreddit(newSub);
    loadVibeData(newSub);
  };

  const handleSaveCredentials = (newCreds: ApiCredentials) => {
    setCredentials(newCreds);
    localStorage.setItem('reddit_client_id', newCreds.clientId || '');
    localStorage.setItem('reddit_client_secret', newCreds.clientSecret || '');
    loadVibeData(subreddit, newCreds);
  };

  // Metrics summary calculations
  const { positiveCount, neutralCount, negativeCount, averageScore } = useMemo(() => {
    let pos = 0;
    let neu = 0;
    let neg = 0;
    let totalScore = 0;

    posts.forEach((p) => {
      const s = p.sentiment?.label || 'Neutral';
      totalScore += p.sentiment?.score || 0;
      if (s === 'Positive') pos++;
      else if (s === 'Negative') neg++;
      else neu++;
    });

    const avg = posts.length ? Math.round((totalScore / posts.length) * 10) / 10 : 0;
    return {
      positiveCount: pos,
      neutralCount: neu,
      negativeCount: neg,
      averageScore: avg
    };
  }, [posts]);

  // Filtered post list
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesFilter =
        activeFilter === 'All' || p.sentiment?.label === activeFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [posts, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B1416] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} isDemo={isDemoMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search controls */}
        <SearchControls
          currentSubreddit={subreddit}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Demo Notice Banner */}
        {isDemoMode && demoNoticeMessage && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-200 text-xs flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{demoNoticeMessage}</span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg font-semibold text-amber-100 flex-shrink-0 transition-all"
            >
              Add API Credentials
            </button>
          </div>
        )}

        {/* Error state display */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-300 flex items-start gap-4 shadow-xl">
            <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-rose-200">Could not analyze r/{subreddit}</h3>
              <p className="text-sm text-rose-300/80">{error}</p>
              <button
                onClick={() => loadVibeData(subreddit)}
                className="mt-3 px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-lg text-xs font-semibold text-rose-200 inline-flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-6">
            <div className="bg-reddit-card rounded-2xl p-6 border border-reddit-border animate-pulse space-y-4">
              <div className="h-6 w-48 bg-reddit-border rounded" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-reddit-dark rounded-xl border border-reddit-border" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-reddit-card h-20 rounded-xl border border-reddit-border animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Dashboard & Feed */}
        {!isLoading && !error && posts.length > 0 && (
          <>
            <VibeSummary
              subredditName={subreddit}
              totalAnalyzed={posts.length}
              positiveCount={positiveCount}
              neutralCount={neutralCount}
              negativeCount={negativeCount}
              averageScore={averageScore}
            />

            {/* Filter & Search Bar for Posts */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-reddit-card p-4 rounded-xl border border-reddit-border">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <span className="text-xs font-semibold text-gray-400 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {(['All', 'Positive', 'Neutral', 'Negative'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeFilter === filter
                        ? filter === 'Positive'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : filter === 'Negative'
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                          : filter === 'Neutral'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-reddit-orange text-white shadow-md shadow-reddit-orange/20'
                        : 'bg-reddit-dark text-gray-400 hover:text-white border border-reddit-border'
                    }`}
                  >
                    {filter}
                    {filter === 'All' && ` (${posts.length})`}
                    {filter === 'Positive' && ` (${positiveCount})`}
                    {filter === 'Neutral' && ` (${neutralCount})`}
                    {filter === 'Negative' && ` (${negativeCount})`}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search in post titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-reddit-dark border border-reddit-border rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-reddit-orange"
                />
              </div>
            </div>

            {/* Analyzed Post Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-1">
                <span>Displaying {filteredPosts.length} of {posts.length} Hot Posts</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Sentiment Scoring
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-reddit-card border border-reddit-border rounded-xl p-12 text-center text-gray-400">
                  No post titles match your current search/filter.
                </div>
              ) : (
                filteredPosts.map((post, idx) => (
                  <PostCard key={post.id} post={post} index={idx} />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        credentials={credentials}
        onSaveCredentials={handleSaveCredentials}
      />

      <footer className="border-t border-reddit-border py-6 text-center text-xs text-gray-500">
        <p>Built for The Subreddit Vibe Check assignment • Client-side Sentiment Analysis &amp; Reddit API</p>
      </footer>
    </div>
  );
}

export default App;
