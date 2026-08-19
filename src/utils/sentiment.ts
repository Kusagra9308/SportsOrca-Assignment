import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

export type SentimentLabel = 'Positive' | 'Neutral' | 'Negative';

export interface PostSentimentResult {
  score: number;
  comparative: number;
  label: SentimentLabel;
  positiveWords: string[];
  negativeWords: string[];
}

export function analyzeTitleSentiment(title: string): PostSentimentResult {
  if (!title || typeof title !== 'string') {
    return {
      score: 0,
      comparative: 0,
      label: 'Neutral',
      positiveWords: [],
      negativeWords: []
    };
  }

  const result = sentimentAnalyzer.analyze(title);
  
  let label: SentimentLabel = 'Neutral';
  if (result.score > 0) {
    label = 'Positive';
  } else if (result.score < 0) {
    label = 'Negative';
  }

  return {
    score: result.score,
    comparative: Math.round(result.comparative * 100) / 100,
    label,
    positiveWords: result.positive || [],
    negativeWords: result.negative || []
  };
}

export function calculateOverallVibe(
  positiveCount: number,
  neutralCount: number,
  negativeCount: number,
  averageScore: number
): { emoji: string; text: string; colorClass: string; bgClass: string } {
  const total = positiveCount + neutralCount + negativeCount;
  if (total === 0) {
    return { emoji: '😐', text: 'Neutral', colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10 border-blue-500/20' };
  }

  if (positiveCount > negativeCount && averageScore > 0) {
    return {
      emoji: '😊',
      text: 'Positive',
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10'
    };
  } else if (negativeCount > positiveCount && averageScore < 0) {
    return {
      emoji: '🙁',
      text: 'Negative',
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-500/10 border-rose-500/20 shadow-rose-500/10'
    };
  } else {
    return {
      emoji: '😐',
      text: 'Neutral',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/10'
    };
  }
}
