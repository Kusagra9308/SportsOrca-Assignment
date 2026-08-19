# The Subreddit Vibe Check 🔮

A modern full-stack Reddit sentiment analysis dashboard that fetches the top **50 hot posts** from any subreddit and performs real-time sentiment scoring on post titles.


## 🌟 Key Features

1. **Subreddit Search & Presets**:
   - Query any subreddit (`technology`, `programming`, `sports`, `movies`, `science`, `gaming`).
   - Quick-select chip buttons for instant switching.
2. **Reddit API Integration**:
   - Fetches exactly 50 hot posts from `/r/{subreddit}/hot`.
   - Bypasses browser CORS restrictions using resilient multi-proxy fallback architecture.
3. **Client-side Sentiment Analysis**:
   - Uses `sentiment` (AFINN-165 vocabulary dictionary) to score post titles.
   - Categorizes titles into **Positive** (score > 0), **Neutral** (score = 0), and **Negative** (score < 0).
   - Extracts and highlights positive/negative keywords per post.
4. **Vibe Summary Dashboard**:
   - **Overall Vibe Indicator**: 😊 Positive, 😐 Neutral, or 🙁 Negative.
   - **Distribution Bar**: Visual proportional sentiment bar chart.
   - **Total Posts & Category Counts**: Positive, Neutral, Negative totals.
5. **Interactive Post Feed & Filtering**:
   - Real-time search inside post titles.
   - Filter tabs (All, Positive, Neutral, Negative).
   - Direct link to Reddit post, author name, upvotes, and comment counts.
6. **Graceful Loading & Error States**:
   - Skeleton loader animations during fetch.
   - Informative error banners for invalid subreddits or network issues.

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
cd subredit-vibe-check
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will launch at `http://localhost:5173`.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **Sentiment Engine**: `sentiment` (npm AFINN-165 NLP package)
- **API Source**: Reddit Public REST API (`/r/{subreddit}/hot.json?limit=50`)
