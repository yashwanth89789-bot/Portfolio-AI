import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractProjects(content: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this portfolio content and extract a list of projects.
  For each project, extract:
  - title
  - description
  - liveDemoUrl (if available)
  - githubUrl (if available)
  - suggestion (Suggestion on how to improve the display/presentation of this project based on the content)

  Return ONLY a JSON array of these project objects.
  
  Content:
  ${content}`;
  
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            liveDemoUrl: { type: Type.STRING },
            githubUrl: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function analyzePortfolio(content: string, type: 'critique' | 'marketing' | 'improvements' | 'roast', socialLinks: { linkedin: string, github: string, twitter: string }) {
  const model = "gemini-3-flash-preview";
  
  const socialContext = `
  Social Media Links:
  - LinkedIn: ${socialLinks.linkedin || 'Not provided'}
  - GitHub: ${socialLinks.github || 'Not provided'}
  - Twitter: ${socialLinks.twitter || 'Not provided'}
  `;

  let prompt = "";
  if (type === 'critique') {
    prompt = `You are a harsh but fair senior product designer and tech lead. Analyze the following portfolio content and provide a structured critique. Focus on:
    1. First Impressions (Is it clear what they do?)
    2. UX/UI Design (Based on description/structure)
    3. Content Quality (Copywriting, project descriptions)
    4. Technical Proficiency (What stack is implied/shown?)
    
    Be specific and actionable. Use markdown formatting.
    
    ${socialContext}
    
    Content:
    ${content}`;
  } else if (type === 'marketing') {
    prompt = `You are a viral marketing expert. Based on this portfolio content, generate:
    1. A punchy Twitter/X thread (3-5 tweets) to launch this portfolio.
    2. A professional LinkedIn post focusing on career achievements.
    3. A short "About Me" blurb for the portfolio itself.
    
    ${socialContext}
    
    Content:
    ${content}`;
  } else if (type === 'improvements') {
    prompt = `You are a career coach and technical recruiter. Suggest 5 concrete improvements for this portfolio to increase hiring chances. Focus on:
    1. Missing sections (e.g., "About", "Process")
    2. Better ways to showcase projects.
    3. Actionable SEO keyword suggestions relevant to the user's skills and projects.
    
    ${socialContext}
    
    Content:
    ${content}`;
  } else if (type === 'roast') {
    prompt = `You are a stand-up comedian and a cynical senior developer. Roast this portfolio. Be ruthless, funny, and sarcastic. Poke fun at cliches, buzzwords, and generic design choices implied by the content. Make it burn but keep it safe for work (no profanity).
    
    ${socialContext}
    
    Content:
    ${content}`;
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text;
}

export async function generateScore(content: string, socialLinks: { linkedin: string, github: string, twitter: string }) {
  const model = "gemini-3-flash-preview";
  
  const socialContext = `
  Social Media Links:
  - LinkedIn: ${socialLinks.linkedin || 'Not provided'}
  - GitHub: ${socialLinks.github || 'Not provided'}
  - Twitter: ${socialLinks.twitter || 'Not provided'}
  `;

  const prompt = `Analyze this portfolio content and provide a score from 0 to 100 based on the following criteria:
  - UX/UI (User Experience and Interface design implications)
  - Content (Clarity, copywriting, storytelling)
  - Technical (Stack, performance implications, code quality signals)
  - SEO (Keywords, meta info, discoverability)
  - Social Presence (Quality of linked social profiles if provided)
  
  Return ONLY a JSON object with the following structure:
  {
    "overall": number,
    "breakdown": {
      "ux": number,
      "content": number,
      "technical": number,
      "seo": number,
      "social": number
    },
    "summary": "A short 1-sentence summary of why this score was given."
  }
  
  ${socialContext}
  
  Content:
  ${content}`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}");
}
