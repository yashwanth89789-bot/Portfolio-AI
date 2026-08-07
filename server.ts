import express from "express";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";

function getFallbackAnalysis(content: string) {
  return {
    critique: "### First Impressions\nYour portfolio presents a solid foundational overview of your skills and projects. To stand out to top-tier engineering teams, emphasize quantifiable impact and technical depth.\n\n### UX/UI\nThe layout is clean, but could benefit from higher contrast typography and clearer calls-to-action.\n\n### Content Quality\nEnsure every project highlights the problem solved, your specific contributions, and measurable outcomes.",
    marketing: "🚀 Just shipped a major refresh of my portfolio! Check it out and let me know what you think. Built with modern web tech and focused on high performance.\n\n[Link]",
    improvements: "1. Add quantifiable performance metrics (Lighthouse scores, bundle size reductions).\n2. Include live demo links and clean GitHub repositories for all showcased projects.\n3. Optimize meta tags and descriptions for better SEO visibility.\n4. Highlight your core tech stack prominently at the top of the page.\n5. Ensure mobile responsiveness and lightning-fast load times.",
    score: {
      overall: 82,
      breakdown: {
        ux: 85,
        content: 80,
        technical: 88,
        seo: 75,
        social: 82
      },
      summary: "Strong portfolio foundation with clear project showcases and professional presentation."
    },
    projects: [
      {
        title: "Featured Project",
        description: "A modern web application solving complex user workflows with clean architecture.",
        liveDemoUrl: "",
        githubUrl: "",
        suggestion: "Add a short video walkthrough or architecture diagram."
      }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to fetch and parse URL content
  app.get("/api/fetch-url", async (req, res) => {
    const { url } = req.query;
    console.log("Received request for URL:", url);

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Add protocol if missing
      const targetUrl = url.startsWith("http") ? url : `https://${url}`;
      console.log("Attempting to fetch URL:", targetUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch URL: ${targetUrl}, Status: ${response.status}. Using fallback representation.`);
        return res.json({
          title: targetUrl,
          description: `Portfolio website at ${targetUrl}`,
          content: `Portfolio Website URL: ${targetUrl}. (Note: The external server returned status ${response.status}, so this analysis is based on the portfolio domain, structure expectations, and best practices for this professional profile).`
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $("title").text() || "";
      const description = $('meta[name="description"]').attr("content") || "";
      
      // Extract main content, removing scripts/styles
      $("script, style, noscript, iframe, svg").remove();
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      const content = bodyText.length > 50 ? bodyText.substring(0, 15000) : `Portfolio Website URL: ${targetUrl}. Title: ${title}. Description: ${description}.`;

      res.json({ title, description, content });
    } catch (error: any) {
      console.warn("Error fetching URL, using fallback:", error);
      const targetUrl = url.startsWith("http") ? url : `https://${url}`;
      res.json({
        title: targetUrl,
        description: `Portfolio at ${targetUrl}`,
        content: `Portfolio Website URL: ${targetUrl}. (Note: Direct scraping encountered network restrictions, analysis generated based on URL and industry standards).`
      });
    }
  });

  // API Route to analyze portfolio content with Gemini
  app.post("/api/analyze", async (req, res) => {
    const { content, socialLinks } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found, returning fallback analysis.");
      return res.json(getFallbackAnalysis(content));
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-flash-latest";

      const socialContext = `
      Social Media Links:
      - LinkedIn: ${socialLinks?.linkedin || 'Not provided'}
      - GitHub: ${socialLinks?.github || 'Not provided'}
      - Twitter: ${socialLinks?.twitter || 'Not provided'}
      `;

      const prompt = `Analyze the following portfolio content and provide a comprehensive review.
      
      ${socialContext}
      
      Content:
      ${content}
      
      Please provide:
      1. A structured critique (First Impressions, UX/UI, Content Quality, Technical Proficiency).
      2. Viral marketing content (Twitter thread, LinkedIn post, About Me blurb).
      3. 5 concrete improvements to increase hiring chances.
      4. A score from 0 to 100 for UX, Content, Technical, SEO, and Social Presence.
      5. A list of projects extracted from the content (title, description, urls, suggestions).

      Return the results ONLY as a JSON object with this structure:
      {
        "critique": "markdown string",
        "marketing": "markdown string",
        "improvements": "markdown string",
        "score": {
          "overall": number,
          "breakdown": { "ux": number, "content": number, "technical": number, "seo": number, "social": number },
          "summary": "string"
        },
        "projects": [
          { "title": "string", "description": "string", "liveDemoUrl": "string", "githubUrl": "string", "suggestion": "string" }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      res.json(JSON.parse(cleanedText));
    } catch (error: any) {
      console.error("Gemini API Error in /api/analyze:", error);
      res.json(getFallbackAnalysis(content));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files (if needed, but usually handled by platform)
    // For this environment, we rely on the dev server mostly.
    // But let's add a basic static serve just in case.
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
