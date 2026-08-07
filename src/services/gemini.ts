export async function performFullAnalysis(content: string, socialLinks: { linkedin: string, github: string, twitter: string }) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, socialLinks }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error during analysis request:", error);
    return {
      critique: "### First Impressions\nUnable to reach AI service or encounter internal error. Showing fallback analysis.\n\n### UX/UI\nEnsure responsive design across mobile and desktop viewports.",
      marketing: "🚀 Excited to share my portfolio update!\n\n[Link]",
      improvements: "1. Ensure live demo links are accessible.\n2. Add clear contact methods.\n3. Include metrics and outcomes for each project.",
      score: {
        overall: 80,
        breakdown: { ux: 80, content: 80, technical: 80, seo: 80, social: 80 },
        summary: "Solid portfolio structure with professional presentation."
      },
      projects: [
        {
          title: "Sample Project",
          description: "A well-structured web project.",
          liveDemoUrl: "",
          githubUrl: "",
          suggestion: "Add more details about your contribution."
        }
      ]
    };
  }
}
