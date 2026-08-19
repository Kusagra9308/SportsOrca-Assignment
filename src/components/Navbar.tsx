import React from 'react';
import { Sparkles, MessageSquareHeart, Settings, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenSettings?: () => void;
  isDemo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, isDemo }) => {
  return (
    <header className="border-b border-reddit-border bg-reddit-card/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-reddit-orange via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-reddit-orange/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              The Subreddit Vibe Check
              {isDemo ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-medium flex items-center gap-1">
                  Demo Mode
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live OAuth API
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Real-time sentiment analysis of top 50 hot posts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 bg-reddit-dark px-3 py-1.5 rounded-lg border border-reddit-border">
            <MessageSquareHeart className="w-4 h-4 text-reddit-orange" />
            <span className="font-mono text-xs text-gray-300">50 Posts</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-reddit-dark hover:bg-reddit-hover border border-reddit-border text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Configure Reddit API Credentials"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">API Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
