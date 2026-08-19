import React from 'react';
import { Smile, Meh, Frown, BarChart3, TrendingUp } from 'lucide-react';
import { calculateOverallVibe } from '../utils/sentiment';

interface VibeSummaryProps {
  subredditName: string;
  totalAnalyzed: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  averageScore: number;
}

export const VibeSummary: React.FC<VibeSummaryProps> = ({
  subredditName,
  totalAnalyzed,
  positiveCount,
  neutralCount,
  negativeCount,
  averageScore,
}) => {
  const vibe = calculateOverallVibe(positiveCount, neutralCount, negativeCount, averageScore);

  const posPercent = totalAnalyzed ? Math.round((positiveCount / totalAnalyzed) * 100) : 0;
  const neuPercent = totalAnalyzed ? Math.round((neutralCount / totalAnalyzed) * 100) : 0;
  const negPercent = totalAnalyzed ? Math.round((negativeCount / totalAnalyzed) * 100) : 0;

  return (
    <div className="bg-reddit-card rounded-2xl p-6 border border-reddit-border shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-reddit-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-reddit-orange">Community Overview</span>
            <span className="text-xs font-mono text-gray-500">• r/{subredditName}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Vibe Analysis Breakdown
          </h2>
        </div>

        {/* Overall Vibe Badge */}
        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl border ${vibe.bgClass} transition-all duration-300`}>
          <span className="text-4xl select-none animate-bounce-short">{vibe.emoji}</span>
          <div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Overall Vibe</div>
            <div className={`text-2xl font-extrabold ${vibe.colorClass}`}>
              {vibe.text}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Posts Analyzed */}
        <div className="bg-reddit-dark/60 p-4 rounded-xl border border-reddit-border">
          <div className="flex items-center justify-between text-gray-400 text-sm mb-2">
            <span>Posts Analyzed</span>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalAnalyzed}</div>
          <div className="text-xs text-gray-500 mt-1">Hot feed items</div>
        </div>

        {/* Positive */}
        <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between text-emerald-400 text-sm mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Smile className="w-4 h-4" /> Positive
            </span>
            <span className="font-mono text-xs font-semibold">{posPercent}%</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{positiveCount}</div>
          <div className="text-xs text-emerald-500/70 mt-1">Score &gt; 0</div>
        </div>

        {/* Neutral */}
        <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center justify-between text-amber-400 text-sm mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Meh className="w-4 h-4" /> Neutral
            </span>
            <span className="font-mono text-xs font-semibold">{neuPercent}%</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{neutralCount}</div>
          <div className="text-xs text-amber-500/70 mt-1">Score = 0</div>
        </div>

        {/* Negative */}
        <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/20">
          <div className="flex items-center justify-between text-rose-400 text-sm mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Frown className="w-4 h-4" /> Negative
            </span>
            <span className="font-mono text-xs font-semibold">{negPercent}%</span>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">{negativeCount}</div>
          <div className="text-xs text-rose-500/70 mt-1">Score &lt; 0</div>
        </div>
      </div>

      {/* Sentiment Proportional Distribution Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>Sentiment Distribution</span>
          <span className="font-mono">Avg Score: {averageScore > 0 ? `+${averageScore}` : averageScore}</span>
        </div>
        <div className="h-3 w-full bg-reddit-dark rounded-full overflow-hidden flex p-0.5 border border-reddit-border">
          <div
            style={{ width: `${posPercent}%` }}
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
            title={`Positive: ${posPercent}%`}
          />
          <div
            style={{ width: `${neuPercent}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`Neutral: ${neuPercent}%`}
          />
          <div
            style={{ width: `${negPercent}%` }}
            className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
            title={`Negative: ${negPercent}%`}
          />
        </div>
      </div>
    </div>
  );
};
