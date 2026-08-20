import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint for container / Cloud Run deployment
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route to fetch and parse URL content
  app.get("/api/fetch-url", async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Please enter a valid URL." });
    }

    try {
      // Add protocol if missing
      const targetUrl = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          return res.status(422).json({
            error: `Target website blocked automated scanning (${response.status} Forbidden / Anti-Bot Protection). Please copy and paste your portfolio or resume text directly.`
          });
        }
        if (response.status === 404) {
          return res.status(404).json({
            error: `Website not found (404). Please double-check the URL or paste your content directly.`
          });
        }
        return res.status(422).json({
          error: `Could not load URL (HTTP ${response.status} ${response.statusText}). Please paste your resume or portfolio text directly.`
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $("title").text().trim() || "";
      const description = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";
      
      // Extract main content, removing scripts/styles
      $("script, style, noscript, iframe, svg, canvas, link, meta").remove();
      
      let content = $("main, #root, #__next, body").text().replace(/\s+/g, " ").trim();
      
      if (!content || content.length < 15) {
        content = `${title} ${description}`.trim();
      }

      if (!content || content.length < 15) {
        return res.status(422).json({
          error: "The target website is dynamically rendered (client-side SPA) or does not contain readable static text. Please copy and paste your resume/portfolio text directly."
        });
      }

      // Limit content size
      const trimmedContent = content.substring(0, 20000);

      res.json({ title, description, content: trimmedContent });
    } catch (error: any) {
      if (error.name === "AbortError") {
        return res.status(504).json({
          error: "Request timed out while trying to reach the website. The server may be slow or offline. Please paste your text directly."
        });
      }
      return res.status(500).json({
        error: error.message || "Failed to fetch website content. Please paste your portfolio text directly."
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
