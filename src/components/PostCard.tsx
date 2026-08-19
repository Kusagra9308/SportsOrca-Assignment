import React from 'react';
import { ExternalLink, ThumbsUp, MessageSquare, Tag } from 'lucide-react';
import { RedditPost } from '../services/redditApi';

interface PostCardProps {
  post: RedditPost;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const sentiment = post.sentiment || {
    score: 0,
    label: 'Neutral',
    positiveWords: [],
    negativeWords: []
  };

  const badgeConfig = {
    Positive: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400'
    },
    Neutral: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400'
    },
    Negative: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400'
    }
  }[sentiment.label];

  return (
    <div className="bg-reddit-card hover:bg-reddit-hover border border-reddit-border rounded-xl p-5 transition-all duration-200 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        <span className="font-mono text-sm font-bold text-gray-500 w-6 pt-0.5 text-right flex-shrink-0">
          {index + 1}.
        </span>

        <div className="space-y-2 flex-1">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-reddit-orange font-semibold text-base leading-snug tracking-tight transition-colors line-clamp-2 inline-flex items-center gap-2"
          >
            {post.title}
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-reddit-orange flex-shrink-0" />
          </a>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="font-medium text-gray-300">u/{post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5 text-gray-500" />
              {post.ups.toLocaleString()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
              {post.num_comments.toLocaleString()}
            </span>

            {/* Keyword tags */}
            {sentiment.positiveWords.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 text-[11px]">
                <Tag className="w-3 h-3" /> +{sentiment.positiveWords.join(', ')}
              </span>
            )}
            {sentiment.negativeWords.length > 0 && (
              <span className="flex items-center gap-1 text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40 text-[11px]">
                <Tag className="w-3 h-3" /> -{sentiment.negativeWords.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sentiment Badge & Score */}
      <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${badgeConfig.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badgeConfig.dot}`} />
          {sentiment.label}
        </div>
        <span className="font-mono text-xs font-bold text-gray-400 bg-reddit-dark px-2.5 py-1.5 rounded-lg border border-reddit-border">
          Score: {sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score}
        </span>
      </div>
    </div>
  );
};
