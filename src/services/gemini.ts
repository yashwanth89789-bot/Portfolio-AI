import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateContentWithRetry(params: GenerateContentParameters, retries = 3, delay = 1000): Promise<any> {
  try {
    return await ai.models.generateContent(params);
  } catch (error: any) {
    if (retries > 0 && error.status === 429) {
      console.warn(`Rate limit hit, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateContentWithRetry(params, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function performFullAnalysis(content: string, socialLinks: { linkedin: string, github: string, twitter: string }) {
  const model = "gemini-flash-latest";
  
  const socialContext = `
  Social Media Links:
  - LinkedIn: ${socialLinks.linkedin || 'Not provided'}
  - GitHub: ${socialLinks.github || 'Not provided'}
  - Twitter: ${socialLinks.twitter || 'Not provided'}
  `;

  const prompt = `Analyze the following portfolio content and provide a comprehensive review.
  
  ${socialContext}
  
  Content:
  ${content}
  
  Please provide:
  1. A structured critique (First Impressions, UX/UI, Content Quality, Technical Proficiency).
  2. Viral marketing content (Twitter thread, LinkedIn post, About Me blurb).
  3. 5 concrete improvements to increase hiring chances.
  4. A ruthless, funny roast of the portfolio.
  5. A score from 0 to 100 for UX, Content, Technical, SEO, and Social Presence.
  6. A list of projects extracted from the content (title, description, urls, suggestions).

  Return the results ONLY as a JSON object with this structure:
  {
    "critique": "markdown string",
    "marketing": "markdown string",
    "improvements": "markdown string",
    "roast": "markdown string",
    "score": {
      "overall": number,
      "breakdown": { "ux": number, "content": number, "technical": number, "seo": number, "social": number },
      "summary": "string"
    },
    "projects": [
      { "title": "string", "description": "string", "liveDemoUrl": "string", "githubUrl": "string", "suggestion": "string" }
    ]
  }`;

  const response = await generateContentWithRetry({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          critique: { type: Type.STRING },
          marketing: { type: Type.STRING },
          improvements: { type: Type.STRING },
          roast: { type: Type.STRING },
          score: {
            type: Type.OBJECT,
            properties: {
              overall: { type: Type.NUMBER },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  ux: { type: Type.NUMBER },
                  content: { type: Type.NUMBER },
                  technical: { type: Type.NUMBER },
                  seo: { type: Type.NUMBER },
                  social: { type: Type.NUMBER },
                },
                required: ["ux", "content", "technical", "seo", "social"],
              },
              summary: { type: Type.STRING },
            },
            required: ["overall", "breakdown", "summary"],
          },
          projects: {
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
        required: ["critique", "marketing", "improvements", "roast", "score", "projects"],
      },
    }
  });

  try {
    const text = response.text || "{}";
    // Clean up any potential markdown formatting if it somehow slipped through
    const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse combined analysis JSON:", e);
    console.error("Raw response text:", response.text);
    return null;
  }
}
