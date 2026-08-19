declare module 'sentiment' {
  export interface SentimentOptions {
    extras?: Record<string, number>;
    language?: string;
  }

  export interface SentimentResult {
    score: number;
    comparative: number;
    calculation: Array<Record<string, number>>;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  export default class Sentiment {
    constructor();
    analyze(phrase: string, options?: SentimentOptions): SentimentResult;
  }
}
