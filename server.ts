import express from "express";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";

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
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PortfolioBooster/1.0; +http://example.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $("title").text() || "";
      const description = $('meta[name="description"]').attr("content") || "";
      
      // Extract main content, removing scripts/styles
      $("script, style, noscript, iframe, svg").remove();
      const content = $("body").text().replace(/\s+/g, " ").trim().substring(0, 15000); // Limit content size

      res.json({ title, description, content });
    } catch (error: any) {
      console.error("Error fetching URL:", error);
      res.status(500).json({ error: error.message || "Failed to fetch URL content" });
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
