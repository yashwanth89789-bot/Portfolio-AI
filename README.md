# Portfolio Booster

Portfolio Booster is an AI-powered portfolio and resume analysis application built with React, TypeScript, Tailwind CSS, Express, and Google Gemini API. It evaluates developer and designer portfolios against top-tier industry benchmarks, provides a 5-axis radar score breakdown, actionable improvement steps, and viral marketing assets.

---

## 🚀 Key Features

1. **Dual Input Options**:
   - **URL Scraping**: Enter any portfolio URL to automatically fetch and parse its contents via a secure Express backend proxy using `cheerio`.
   - **Direct Paste**: Paste resume text, bio, or project summaries directly into the textarea for instant evaluation.

2. **Role-Based Industry Benchmarks**:
   - Select your target role (Frontend Engineer, Full Stack / Backend Engineer, UI/UX Designer, Data Scientist / AI Engineer, Mobile Developer) to receive tailored resume and portfolio standards.

3. **Comprehensive AI Scoring & Radar Visualization**:
   - Evaluates portfolios across 5 crucial axes: **UX**, **Content**, **Technical Proficiency**, **SEO**, and **Social Presence**.
   - Interactive Recharts Radar Chart and animated score breakdown gauges.

4. **Targeted Action Plans**:
   - Automatically identifies weak metrics (scores < 75) and generates specific, actionable improvement advice.

5. **Viral Launch Assets**:
   - Generates ready-to-post Twitter threads and LinkedIn promotional updates.

---

## 🔄 Application Workflow

```
[ User Input ] 
   ├── Portfolio URL (Scraped via /api/fetch-url)
   └── Direct Text Paste
        ↓
[ Target Role Selection ] 
   └── Determines industry benchmarks (Frontend, Backend, UI/UX, AI/Data, Mobile)
        ↓
[ Server-Side Gemini AI Processing ] 
   └── @google/genai structured JSON analysis (Critique, Marketing, Scores, Projects)
        ↓
[ Interactive Results Dashboard ] 
   ├── Animated Skeleton Loading State during analysis
   ├── 5-Axis Radar Chart & Overall Grade
   ├── Targeted Low-Metric Action Plan
   └── Exportable Marketing Tweets & Project Cards
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion (framer-motion), Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Cheerio (URL scraper).
- **AI Engine**: Google Gemini API (`@google/genai`).

---

## ⚙️ Getting Started & Configuration

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
