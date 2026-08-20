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

export async function chatWithResumeAI(
  message: string,
  resumeContent: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) {
  try {
    const contents = [
      {
        role: 'user',
        parts: [{ text: `System context: You are an expert career coach and resume writer. Here is my current resume/portfolio content:\n\n${resumeContent}\n\nPlease help me.` }]
      },
      {
        role: 'model',
        parts: [{ text: `I am your expert career coach. How can I help you improve your resume today?` }]
      },
      ...history,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents
    });
    
    return response.text;
  } catch (error) {
    console.error("Failed to chat with AI:", error);
    throw error;
  }
}

export async function quickRewrite(textToRewrite: string, targetRole: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Rewrite the following resume bullet point to be more impactful, concise, and tailored for a ${targetRole} role. Use strong action verbs and highlight metrics if possible. Return only the rewritten text.\n\nOriginal: ${textToRewrite}`
    });
    return response.text;
  } catch (error) {
    console.error("Failed to rewrite text:", error);
    throw error;
  }
}
export async function performFullAnalysis(content: string, socialLinks: { linkedin: string, github: string, twitter: string }, targetRole: string) {
  const model = "gemini-3.1-pro-preview";
  
  const socialContext = `
  Social Media Links:
  - LinkedIn: ${socialLinks.linkedin || 'Not provided'}
  - GitHub: ${socialLinks.github || 'Not provided'}
  - Twitter: ${socialLinks.twitter || 'Not provided'}
  `;

  const prompt = `Analyze the following portfolio and resume content and provide a comprehensive review.
  
  Target Job Role / Industry: ${targetRole}
  
  ${socialContext}
  
  Content:
  ${content}
  
  Please provide:
  1. A structured critique (First Impressions, UX/UI, Content Quality, Technical Proficiency).
  2. Viral marketing content (Twitter thread, LinkedIn post, About Me blurb).
  3. 5 concrete improvements to increase hiring chances.
  4. A score from 0 to 100 for UX, Content, Technical, SEO, and Social Presence.
  5. A list of projects extracted from the content (title, description, urls, suggestions).
  6. A list of missing high-impact keywords relevant to the target role (${targetRole}) that are absent from the content.
  7. A list of present high-impact keywords relevant to the target role that are already in the content.

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
    ],
    "keywords": {
      "missing": ["string"],
      "present": ["string"]
    }
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
          keywords: {
            type: Type.OBJECT,
            properties: {
              missing: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              present: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["missing", "present"]
          }
        },
        required: ["critique", "marketing", "improvements", "score", "projects", "keywords"],
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
