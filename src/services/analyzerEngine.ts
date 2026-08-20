import {
  FullAuditResult,
  AnalysisScore,
  KeywordMatch,
  BulletPointAnalysis,
  HighlightedPhraseToken,
  BulletImpactBreakdown,
  ExtractedProject,
  RecruiterScanArea,
  LaunchCopyAssets
} from '../types';
import { ROLES_DATA, POWER_VERBS, WEAK_VERBS, PASSIVE_PHRASE_RULES, PassivePhraseRule } from '../data/rolesData';

// Helper: Count syllables for Flesch-Kincaid
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;
  const syllableMatch = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g);
  return syllableMatch ? Math.max(1, syllableMatch.length) : 1;
}

// Helper: Calculate readability
function computeReadability(text: string) {
  const words = text.match(/\b[a-zA-Z0-9_-]+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const wordCount = Math.max(1, words.length);
  const sentenceCount = Math.max(1, sentences.length);
  
  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countSyllables(w);
  }

  // Flesch Reading Ease: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = totalSyllables / wordCount;
  
  let readingEase = Math.round(206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord));
  readingEase = Math.max(0, Math.min(100, readingEase));

  let gradeLevel = 'Grade 10 - 12 (Professional)';
  if (readingEase > 80) gradeLevel = 'Grade 6 - 8 (Very Easy / Fast Scan)';
  else if (readingEase > 60) gradeLevel = 'Grade 8 - 10 (Standard Tech Professional)';
  else if (readingEase > 40) gradeLevel = 'Grade 11 - 13 (Dense Technical)';
  else gradeLevel = 'College Graduate+ (High Density)';

  return { readingEase, gradeLevel, wordCount, sentenceCount };
}

// Helper: Extract metrics from text
function extractMetrics(text: string): string[] {
  const metricRegex = /\b(\d+[\d,.]*[%xXkKMm+sbB]?|\$\d+[\d,.]*[kKMmB]?|\d+\s*(?:users|ms|s|sec|seconds|minutes|hrs|hours|x|times|fold|star|stars|stars?|%|percent))\b/gi;
  const matches: string[] = text.match(metricRegex) || [];
  const uniqueMatches: string[] = Array.from(new Set(matches));
  return uniqueMatches.filter((m: string) => {
    return m.includes('%') || m.includes('$') || m.includes('x') || m.includes('X') ||
           m.includes('k') || m.includes('K') || m.includes('M') || m.includes('m') ||
           m.includes('+') || m.length > 2;
  });
}

// Helper: Extract projects from content
function extractProjectsFromContent(text: string, defaultRole: string): ExtractedProject[] {
  const lines = text.split('\n');
  const projectList: ExtractedProject[] = [];
  
  let inProjectsSection = false;
  let currentProject: Partial<ExtractedProject> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect section header
    if (/^(projects|featured projects|key projects|selected work|portfolio projects)/i.test(line)) {
      inProjectsSection = true;
      continue;
    }

    // Detect project heading (numbered, dash, or project title)
    const isProjectHeading = inProjectsSection && (/^(\d+\.|\*|-|•)\s+[A-Za-z0-9\s—–:-]{3,40}/.test(line) ||
      (line.length < 50 && (line.includes('—') || line.includes('-') || line.includes(':')) && !line.startsWith('http')));

    if (isProjectHeading) {
      if (currentProject && currentProject.title) {
        projectList.push(finalizeProject(currentProject, defaultRole));
      }
      
      const cleanTitle = line.replace(/^(\d+\.|\*|-|•)\s*/, '').split(/[-—–:]/)[0].trim();
      currentProject = {
        title: cleanTitle || `Project ${projectList.length + 1}`,
        description: line,
        detectedTech: [],
        metricsFound: []
      };
    } else if (currentProject) {
      // Append lines to current project
      currentProject.description += ' ' + line;
      
      // Look for links
      const urlMatch = line.match(/(https?:\/\/[^\s]+|github\.com\/[^\s]+|demo:[^\s]+)/i);
      if (urlMatch) {
        if (urlMatch[0].includes('github.com')) {
          currentProject.githubUrl = urlMatch[0];
        } else {
          currentProject.liveDemoUrl = urlMatch[0];
        }
      }
    }
  }

  if (currentProject && currentProject.title) {
    projectList.push(finalizeProject(currentProject, defaultRole));
  }

  // Fallback if no projects cleanly parsed
  if (projectList.length === 0) {
    // Generate derived project cards from content paragraphs
    projectList.push({
      title: 'Flagship Core Platform Initiative',
      role: defaultRole,
      description: text.slice(0, 320) + '...',
      detectedTech: ['TypeScript', 'React', 'Cloud Services', 'Automated CI/CD'],
      metricsFound: extractMetrics(text).slice(0, 3),
      githubUrl: 'https://github.com',
      liveDemoUrl: 'https://demo.app',
      roastAndSuggestion: 'Ensure you clearly separate the technical problem statement from the final quantitative outcome. Add direct architecture diagrams and load benchmark stats.',
      score: 82
    });
  }

  return projectList.slice(0, 4);
}

function finalizeProject(p: Partial<ExtractedProject>, defaultRole: string): ExtractedProject {
  const desc = p.description || '';
  const metrics = extractMetrics(desc);
  
  // Detect common tech
  const techKeywords = ['React', 'Next.js', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Go', 'Docker', 'AWS', 'PostgreSQL', 'Redis', 'Kafka', 'Tailwind', 'GraphQL', 'Figma', 'PyTorch', 'Swift', 'Kotlin'];
  const detectedTech = techKeywords.filter(t => new RegExp(`\\b${t}\\b`, 'i').test(desc));
  if (detectedTech.length === 0) detectedTech.push('Modern Tech Stack', 'API Integration');

  const hasMetrics = metrics.length > 0;
  const hasLinks = !!(p.githubUrl || p.liveDemoUrl || desc.includes('http'));
  
  let score = 70;
  if (hasMetrics) score += 15;
  if (hasLinks) score += 10;
  if (detectedTech.length >= 3) score += 5;

  let roastAndSuggestion = '';
  if (!hasMetrics && !hasLinks) {
    roastAndSuggestion = 'Needs quantifiable impact metrics and a working live demo link to prove production viability.';
  } else if (!hasMetrics) {
    roastAndSuggestion = 'Great technical context, but lacking quantifiable metrics. What was the latency, user growth, or performance gain?';
  } else if (!hasLinks) {
    roastAndSuggestion = 'Add a live interactive URL or open-source GitHub repository so recruiters can inspect code quality directly.';
  } else {
    roastAndSuggestion = 'Strong showcase! Elevate it further with an architecture sequence diagram and an interactive Swagger/API demo.';
  }

  return {
    title: p.title || 'Featured Project',
    role: defaultRole,
    description: desc.slice(0, 280),
    detectedTech,
    metricsFound: metrics.slice(0, 4),
    githubUrl: p.githubUrl,
    liveDemoUrl: p.liveDemoUrl,
    roastAndSuggestion,
    score: Math.min(98, score)
  };
}

// Helper: Tokenize bullet text into phrase segments with diagnostic annotations
export function tokenizeBulletPointForImpact(cleanText: string): HighlightedPhraseToken[] {
  if (!cleanText || !cleanText.trim()) {
    return [{ text: cleanText || '', type: 'normal' }];
  }

  interface MatchRange {
    start: number;
    end: number;
    text: string;
    type: 'passive' | 'weak' | 'power' | 'metric';
    feedback?: string;
    suggestedReplacement?: string;
  }

  const matches: MatchRange[] = [];
  const lower = cleanText.toLowerCase();

  // 1. Passive & Weak Phrases
  for (const rule of PASSIVE_PHRASE_RULES) {
    const phraseLower = rule.phrase.toLowerCase();
    let searchPos = 0;
    while ((searchPos = lower.indexOf(phraseLower, searchPos)) !== -1) {
      // Check word boundaries
      const isStartWord = searchPos === 0 || /\s|[.,!?;:(\["']/.test(cleanText[searchPos - 1]);
      const endPos = searchPos + phraseLower.length;
      const isEndWord = endPos === cleanText.length || /\s|[.,!?;:)\]"']/.test(cleanText[endPos]);

      if (isStartWord && isEndWord) {
        matches.push({
          start: searchPos,
          end: endPos,
          text: cleanText.substring(searchPos, endPos),
          type: rule.category,
          feedback: rule.feedback,
          suggestedReplacement: rule.replacements.join(' / ')
        });
      }
      searchPos += phraseLower.length;
    }
  }

  // 2. Metrics & Numbers Proof
  const metricRegex = /\b(\d+[\d,.]*[%xXkKMm+sbB]?|\$\d+[\d,.]*[kKMmB]?|\d+\s*(?:users|ms|s|sec|seconds|minutes|hrs|hours|x|times|fold|star|stars|stars?|%|percent))\b/gi;
  let mMatch: RegExpExecArray | null;
  while ((mMatch = metricRegex.exec(cleanText)) !== null) {
    const text = mMatch[0];
    if (text.includes('%') || text.includes('$') || text.includes('x') || text.includes('X') ||
        text.includes('k') || text.includes('K') || text.includes('M') || text.includes('m') ||
        text.includes('+') || text.length > 2) {
      matches.push({
        start: mMatch.index,
        end: mMatch.index + text.length,
        text,
        type: 'metric',
        feedback: 'Strong quantifiable metric proof point.',
        suggestedReplacement: undefined
      });
    }
  }

  // 3. Power Action Verbs
  for (const pv of POWER_VERBS) {
    const pvRegex = new RegExp(`\\b${pv}\\b`, 'gi');
    let pMatch: RegExpExecArray | null;
    while ((pMatch = pvRegex.exec(cleanText)) !== null) {
      matches.push({
        start: pMatch.index,
        end: pMatch.index + pMatch[0].length,
        text: pMatch[0],
        type: 'power',
        feedback: 'High-impact power command verb.',
        suggestedReplacement: undefined
      });
    }
  }

  // Sort matches by start position and length
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // Non-overlapping filtering
  const filteredMatches: MatchRange[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filteredMatches.push(m);
      lastEnd = m.end;
    }
  }

  // Build final tokens array with interleaved normal text
  const tokens: HighlightedPhraseToken[] = [];
  let currentIdx = 0;

  for (const m of filteredMatches) {
    if (m.start > currentIdx) {
      tokens.push({
        text: cleanText.substring(currentIdx, m.start),
        type: 'normal'
      });
    }
    tokens.push({
      text: cleanText.substring(m.start, m.end),
      type: m.type,
      feedback: m.feedback,
      suggestedReplacement: m.suggestedReplacement
    });
    currentIdx = m.end;
  }

  if (currentIdx < cleanText.length) {
    tokens.push({
      text: cleanText.substring(currentIdx),
      type: 'normal'
    });
  }

  return tokens;
}

// Single Bullet Point Impact Scoring & Rewriting Engine
export function analyzeSingleBulletPoint(rawText: string, targetRoleTitle: string = 'Software Engineer'): BulletPointAnalysis {
  const clean = rawText.replace(/^[-•*—–\d.]\s+/, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const firstWord = (words[0] || '').toLowerCase().replace(/[^a-z]/g, '');

  const tokens = tokenizeBulletPointForImpact(clean);

  // Analyze features from tokens
  const passivePhrasesFound = tokens.filter(t => t.type === 'passive').map(t => t.text);
  const weakPhrasesFound = tokens.filter(t => t.type === 'weak').map(t => t.text);
  const powerVerbsFound = tokens.filter(t => t.type === 'power').map(t => t.text);
  const metricsFound = tokens.filter(t => t.type === 'metric').map(t => t.text);

  const isPowerOpening = POWER_VERBS.some(v => firstWord.startsWith(v.slice(0, 4)));
  const isPassiveOpening = passivePhrasesFound.length > 0 && clean.toLowerCase().startsWith(passivePhrasesFound[0].toLowerCase());

  const hasMetrics = metricsFound.length > 0;
  const hasOutcome = clean.toLowerCase().includes('result') || clean.toLowerCase().includes('boost') ||
                     clean.toLowerCase().includes('improv') || clean.toLowerCase().includes('reduc') ||
                     clean.toLowerCase().includes('increas') || clean.toLowerCase().includes('sav') ||
                     clean.toLowerCase().includes('accelerat') || clean.toLowerCase().includes('optimi') ||
                     clean.toLowerCase().includes('scal');

  // Sub-Scores calculation
  let actionVerbScore = 15;
  if (isPowerOpening) actionVerbScore = 30;
  else if (powerVerbsFound.length > 0) actionVerbScore = 22;
  else if (isPassiveOpening) actionVerbScore = 5;
  else if (weakPhrasesFound.length > 0) actionVerbScore = 8;

  let metricsScore = 0;
  if (metricsFound.length >= 2) metricsScore = 35;
  else if (metricsFound.length === 1) metricsScore = 25;

  let outcomeScore = 5;
  if (hasOutcome && hasMetrics) outcomeScore = 20;
  else if (hasOutcome) outcomeScore = 12;

  let clarityScore = 10;
  if (words.length >= 10 && words.length <= 35) clarityScore = 15;
  else if (words.length < 6 || words.length > 45) clarityScore = 5;

  const penalty = (passivePhrasesFound.length * 15) + (weakPhrasesFound.length * 8);

  const totalRaw = actionVerbScore + metricsScore + outcomeScore + clarityScore - penalty;
  const score = Math.max(15, Math.min(99, totalRaw));

  let grade: 'Elite' | 'Strong' | 'Needs Work' | 'Critical' = 'Needs Work';
  if (score >= 85) grade = 'Elite';
  else if (score >= 70) grade = 'Strong';
  else if (score >= 50) grade = 'Needs Work';
  else grade = 'Critical';

  // Constructive critique
  let critique = '';
  if (passivePhrasesFound.length > 0 && !hasMetrics) {
    critique = `Contains passive phrasing ("${passivePhrasesFound.join(', ')}") and zero quantifiable proof metrics. Replace with an active command verb and measurable outcome.`;
  } else if (passivePhrasesFound.length > 0) {
    critique = `Contains good metrics, but opens with passive phrasing ("${passivePhrasesFound.join(', ')}"). Switch to direct power verbs to take personal ownership.`;
  } else if (!hasMetrics) {
    critique = `Opens with action, but lacks quantitative proof points (%, ms, $, or users). Without numbers, recruiters cannot verify scale or business impact.`;
  } else if (weakPhrasesFound.length > 0) {
    critique = `Contains weak phrases ("${weakPhrasesFound.join(', ')}") that diminish your technical authority. Strengthen collaborative phrasing.`;
  } else if (score >= 85) {
    critique = `Elite high-impact proof point! Combines strong active leadership, quantifiable metrics, and clear technical outcome.`;
  } else {
    critique = `Good baseline. Increase metrics density or clarify the broader architectural impact to reach top 1% level.`;
  }

  // Generate 4 tailored variations
  const coreContext = clean
    .replace(/^(was responsible for|responsible for|helped with|helped to|worked on|assisted in|assisted with|participated in|tasked with|involved in|duties included)\s+/i, '')
    .replace(/^[A-Za-z]+\s+/, '')
    .replace(/\b(improving|helping|working on|responsible for)\b.*$/i, '')
    .trim();

  const primaryTech = targetRoleTitle.includes('Frontend') ? 'React and TypeScript UI systems'
    : targetRoleTitle.includes('Full') ? 'distributed full-stack microservices'
    : targetRoleTitle.includes('DevOps') ? 'automated Kubernetes CI/CD pipelines'
    : targetRoleTitle.includes('AI') ? 'LLM inference pipelines and embeddings'
    : targetRoleTitle.includes('Mobile') ? 'high-performance native mobile workflows'
    : 'core architecture and platform services';

  const xyzFormula = `Accomplished 38% latency reduction and boosted system reliability to 99.99% across 250k+ daily users by spearheading ${coreContext || primaryTech}.`;
  const executive = `Spearheaded cross-functional delivery of ${coreContext || primaryTech}, accelerating sprint velocity by 35% and saving $65,000 in operational overhead.`;
  const technical = `Architected fault-tolerant ${coreContext || primaryTech} with automated telemetry, optimizing p99 query response from 420ms to 45ms at 15k QPS.`;
  const concise = `Engineered high-throughput ${coreContext || primaryTech}, driving a 45% user engagement uplift across 50,000+ daily sessions.`;

  return {
    original: clean,
    score,
    grade,
    actionVerb: {
      word: words[0] || 'Managed',
      isStrong: isPowerOpening,
      isPassive: isPassiveOpening || passivePhrasesFound.length > 0
    },
    hasMetrics,
    hasOutcome,
    critique,
    passivePhrasesFound,
    weakPhrasesFound,
    powerVerbsFound,
    metricsFound,
    tokens,
    breakdown: {
      actionVerbScore,
      metricsScore,
      outcomeScore,
      clarityScore,
      penalty
    },
    rewrites: {
      xyzFormula,
      executive,
      technical,
      concise
    }
  };
}

// Helper: Extract candidate bullet points & generate 4 rewrite styles
function analyzeAndRewriteBulletPoints(text: string, targetRoleTitle: string): BulletPointAnalysis[] {
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 20 && (/^[-•*—–\d.]\s+/.test(l) || /^[A-Z][a-z]+ed\b/.test(l) || /^(responsible|helped|worked|engineered|built|spearheaded|developed|architected)/i.test(l)));

  const candidateLines = lines.slice(0, 6);
  
  if (candidateLines.length === 0) {
    candidateLines.push(
      'Responsible for developing web features using React and helped team fix bugs on production.',
      'Architected high-throughput API gateway reducing p99 latency by 45% across 200,000 daily active users.'
    );
  }

  return candidateLines.map(line => analyzeSingleBulletPoint(line, targetRoleTitle));
}

// Helper: Simulate Recruiter 6-Second Glance Heatmap
function generateRecruiterHeatmap(text: string, readability: any, score: AnalysisScore): RecruiterScanArea[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const topSnippet = lines.slice(0, 3).join(' ') || 'Header, Title & Value Proposition';
  const middleSnippet = lines.slice(3, 7).join(' ') || 'Core Technical Experience & Skills Matrix';
  const bottomSnippet = lines.slice(7, 11).join(' ') || 'Projects, Demos, GitHub & Portfolio Links';

  return [
    {
      id: 'header-anchor',
      label: '1. Top-Left Anchor & Title (0.0s – 1.2s)',
      intensity: 'high',
      snippet: topSnippet.slice(0, 160) + '...',
      gazeTimeEst: '1.4s',
      feedback: 'Recruiters immediately verify your target job title, location, seniority level, and contact handles. Keep this crystal clear.'
    },
    {
      id: 'top-bullets',
      label: '2. Recent Experience & Metrics Hook (1.3s – 3.1s)',
      intensity: score.impactMetrics > 75 ? 'high' : 'medium',
      snippet: middleSnippet.slice(0, 180) + '...',
      gazeTimeEst: '2.1s',
      feedback: score.impactMetrics > 75
        ? 'High eye-magnet! Bold quantifiable numbers ($ %, ms, scale) caught the recruiter’s gaze instantly.'
        : 'Cognitive friction detected. Dense text wall with few numbers causes eyes to skip directly to skills.'
    },
    {
      id: 'skills-cloud',
      label: '3. Technical Keyword Scan (3.2s – 4.5s)',
      intensity: score.technicalDepth > 70 ? 'high' : 'medium',
      snippet: 'Skills Matrix & Modern Frameworks Breakdown',
      gazeTimeEst: '1.5s',
      feedback: 'Recruiters cross-reference 4-5 must-have keywords from the job description against your skills matrix.'
    },
    {
      id: 'projects-links',
      label: '4. Proof of Work & Live Demos (4.6s – 6.0s)',
      intensity: score.socialProof > 65 ? 'high' : 'low',
      snippet: bottomSnippet.slice(0, 160) + '...',
      gazeTimeEst: '1.0s',
      feedback: score.socialProof > 65
        ? 'Live demo links and active GitHub repos provide instant credibility for technical screening.'
        : 'Missing obvious clickable demo URLs or GitHub repository links reduces candidate recall.'
    }
  ];
}

// Helper: Generate Launch & Social Media Assets
function generateLaunchAssets(name: string, roleTitle: string, keyTech: string[], projects: ExtractedProject[], text: string): LaunchCopyAssets {
  const cleanName = name.split(/[-|]/)[0].trim() || 'Engineer & Creator';
  const topTech = keyTech.slice(0, 4).join(', ') || 'React, TypeScript, Next.js, Node.js';
  const topProj = projects[0]?.title || 'Core Project Showcase';

  const twitterThread = [
    `🚀 Excited to unveil my updated developer portfolio & open-source engineering showcase!\n\nFocused on building scalable, ultra-fast, accessible digital products with ${topTech}.\n\nHere is what I've been building 👇 🧵 (1/4)`,
    `⚡ Featured Project Spotlight: ${topProj}\n\n• Solved complex state streaming & high-concurrency data rendering\n• Built with modern architecture, automated CI/CD, and strict WCAG accessibility\n• Measurable outcome: sub-50ms latency & 98+ Lighthouse scores (2/4)`,
    `🛠️ Core Tech Stack & Tooling:\n\n💻 Frontend & UI: ${keyTech.slice(0, 3).join(', ')}\n⚙️ Backend & Cloud: Scalable APIs, PostgreSQL, Docker, AWS\n📊 Architecture: Microservices, Design Systems, Strict Type-Safety (3/4)`,
    `🎯 I am currently open to exciting ${roleTitle} opportunities and high-impact teams!\n\nCheck out my live portfolio and GitHub projects:\n🔗 Live Showcase: https://portfolio.demo\n💻 GitHub: https://github.com\n\nRTs & feedback appreciated! Let's connect! 🤝 (4/4)`
  ];

  const linkedinPost = `🌟 Excited to share the latest milestone in my engineering journey!\n\nOver the past months, I’ve been doubling down on building high-performance, resilient applications with a focus on ${topTech}.\n\n💡 Key Highlights from my recent work:\n✅ Re-engineered core platforms delivering 40%+ performance gains and sub-1s load times\n✅ Designed reusable architecture and design systems adopted across multi-disciplinary teams\n✅ Automated end-to-end testing and CI/CD deployment pipelines\n\nFeatured Project: ${topProj}\nCheck out the live interactive demos and open-source repositories on my portfolio.\n\nI am actively exploring new ${roleTitle} roles where I can drive high-velocity engineering and deliver measurable business outcomes. If your team is hiring or building exciting products, I'd love to connect!\n\n#SoftwareEngineering #WebDevelopment #TechCareers #${roleTitle.replace(/[^a-zA-Z]/g, '')} #OpenSource`;

  const productHuntPitch = {
    tagline: `Modern interactive portfolio & technical showcase built with ${topTech}`,
    description: `A minimalist, ultra-fast portfolio highlighting real-world production engineering, open-source tools, live interactive demos, and measurable architecture benchmarks.`,
    makerComment: `Hey Product Hunt! 👋 I built this showcase to bridge the gap between static resume bullet points and interactive proof of work. Feedback and thoughts are warmly welcome!`
  };

  const hackerNewsShow = `Show HN: ${topProj} – A high-performance open-source technical showcase built with ${topTech}`;

  const coldOutreachDM = `Hi [Hiring Manager / Founder Name],\n\nI noticed the impressive work your team is doing on [Company / Product Feature] at [Company Name].\n\nAs a ${roleTitle} specializing in ${topTech}, I recently solved a similar challenge by engineering ${topProj}, cutting latency by 45% and scaling to 10k+ concurrent requests.\n\nI’d love to share a 2-minute walkthrough of how this architecture could accelerate your current roadmap. Would you be open to a brief chat this week?\n\nBest,\n${cleanName}\nPortfolio: https://portfolio.demo | GitHub: https://github.com`;

  return {
    twitterThread,
    linkedinPost,
    productHuntPitch,
    hackerNewsShow,
    coldOutreachDM
  };
}

// MAIN DETERMINISTIC NLP AUDIT ENGINE
export function performLocalAudit(
  content: string,
  roleId: string = 'frontend',
  socialLinks: { linkedin?: string; github?: string; twitter?: string; portfolioUrl?: string } = {}
): FullAuditResult {
  const role = ROLES_DATA[roleId] || ROLES_DATA['frontend'];
  const textLower = content.toLowerCase();

  // 1. Readability & Text stats
  const readability = computeReadability(content);
  const metricsFound = extractMetrics(content);
  const metricsDensityPercent = Math.min(100, Math.round((metricsFound.length / Math.max(1, readability.sentenceCount)) * 100));

  // 2. Weak vs Power Verbs
  const weakVerbsFound: string[] = [];
  for (const wv of WEAK_VERBS) {
    if (textLower.includes(wv)) {
      weakVerbsFound.push(wv);
    }
  }

  const strongVerbsFound: string[] = [];
  for (const pv of POWER_VERBS) {
    if (new RegExp(`\\b${pv}\\b`, 'i').test(content)) {
      strongVerbsFound.push(pv);
    }
  }

  // 3. Keyword Matcher
  const presentKeywords: KeywordMatch[] = [];
  const missingKeywords: KeywordMatch[] = [];

  // Check primary keywords
  for (const kw of role.primaryKeywords) {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = content.match(regex) || [];
    if (matches.length > 0) {
      presentKeywords.push({
        keyword: kw,
        category: 'core',
        importance: 'critical',
        countInText: matches.length
      });
    } else {
      missingKeywords.push({
        keyword: kw,
        category: 'core',
        importance: 'critical',
        suggestedContext: `Demonstrate mastery in ${kw} within your project descriptions or core skills section.`,
        countInText: 0
      });
    }
  }

  // Check secondary keywords
  for (const kw of role.secondaryKeywords) {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = content.match(regex) || [];
    if (matches.length > 0) {
      presentKeywords.push({
        keyword: kw,
        category: 'framework',
        importance: 'recommended',
        countInText: matches.length
      });
    } else {
      missingKeywords.push({
        keyword: kw,
        category: 'framework',
        importance: 'recommended',
        suggestedContext: `Include ${kw} to highlight modern tooling depth and architectural versatility.`,
        countInText: 0
      });
    }
  }

  // Keyword density
  const totalKeywordsFound = presentKeywords.reduce((acc, k) => acc + k.countInText, 0);
  const keywordDensityRatio = (totalKeywordsFound / Math.max(50, readability.wordCount)) * 100;
  let keywordDensityRating: 'Low' | 'Balanced' | 'Stuffed' = 'Balanced';
  if (keywordDensityRatio < 1.8) keywordDensityRating = 'Low';
  else if (keywordDensityRatio > 7.5) keywordDensityRating = 'Stuffed';

  // 4. Score Dimensions (0 - 100)
  // ATS Compliance: Keyword matching ratio + structure
  const primaryMatchRatio = (presentKeywords.filter(k => k.importance === 'critical').length / Math.max(1, role.primaryKeywords.length));
  const atsCompliance = Math.round(Math.min(99, Math.max(35, (primaryMatchRatio * 70) + (readability.wordCount > 150 ? 20 : 5) + (socialLinks.linkedin ? 5 : 0))));

  // Impact Metrics: Density of quantitative numbers
  const impactMetrics = Math.round(Math.min(98, Math.max(30, (metricsDensityPercent * 1.2) + (metricsFound.length * 5) + 20)));

  // Technical Depth: Present keywords + power verbs
  const technicalDepth = Math.round(Math.min(99, Math.max(40, (presentKeywords.length * 4.5) + (strongVerbsFound.length * 3) + 25)));

  // Action Verb Power: Power verbs vs weak verbs
  const actionVerbPower = Math.round(Math.min(98, Math.max(25, (strongVerbsFound.length * 12) - (weakVerbsFound.length * 8) + 45)));

  // Structure & UX: Readability ease + formatted length
  const structureAndUx = Math.round(Math.min(96, Math.max(45, (readability.readingEase * 0.4) + (readability.sentenceCount > 4 ? 35 : 15) + (content.includes('\n') ? 20 : 0))));

  // Social Proof: Presence of social links / URLs / GitHub
  let socialScore = 40;
  if (socialLinks.github || textLower.includes('github.com')) socialScore += 25;
  if (socialLinks.linkedin || textLower.includes('linkedin.com')) socialScore += 15;
  if (socialLinks.twitter || textLower.includes('twitter.com') || textLower.includes('x.com')) socialScore += 10;
  if (textLower.includes('http') || textLower.includes('.demo') || textLower.includes('.com')) socialScore += 10;
  const socialProof = Math.min(98, socialScore);

  // Overall Weighted Score
  const overall = Math.round(
    (atsCompliance * 0.25) +
    (impactMetrics * 0.25) +
    (technicalDepth * 0.20) +
    (actionVerbPower * 0.15) +
    (structureAndUx * 0.10) +
    (socialProof * 0.05)
  );

  const score: AnalysisScore = {
    overall,
    atsCompliance,
    impactMetrics,
    technicalDepth,
    actionVerbPower,
    structureAndUx,
    socialProof
  };

  // Grade & Percentile
  let grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' = 'B';
  let percentileRank = 72;
  if (overall >= 94) { grade = 'A+'; percentileRank = 99; }
  else if (overall >= 88) { grade = 'A'; percentileRank = 94; }
  else if (overall >= 82) { grade = 'B+'; percentileRank = 86; }
  else if (overall >= 75) { grade = 'B'; percentileRank = 75; }
  else if (overall >= 68) { grade = 'C+'; percentileRank = 60; }
  else if (overall >= 60) { grade = 'C'; percentileRank = 45; }
  else if (overall >= 50) { grade = 'D'; percentileRank = 28; }
  else { grade = 'F'; percentileRank = 12; }

  // 5. Constructive Brutal Critique & Red Flags
  const keyStrengths: string[] = [];
  const redFlags: string[] = [];

  if (primaryMatchRatio >= 0.65) {
    keyStrengths.push(`High ${role.title} ATS alignment with strong core keyword coverage (${presentKeywords.length} terms matched).`);
  }
  if (impactMetrics >= 70) {
    keyStrengths.push(`Excellent metrics density with ${metricsFound.length} quantitative proof points found.`);
  }
  if (strongVerbsFound.length >= 4) {
    keyStrengths.push(`Strong executive language utilizing commanding verbs like "${strongVerbsFound.slice(0, 3).join('", "')}".`);
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push('Solid structural foundation that can be transformed rapidly with target metrics and ATS keywords.');
  }

  if (weakVerbsFound.length > 0) {
    redFlags.push(`Passive phrasing detected: "${weakVerbsFound.slice(0, 3).join('", "')}" weaken candidate authority.`);
  }
  if (missingKeywords.length >= 6) {
    redFlags.push(`Missing ${missingKeywords.length} essential industry keywords critical for ATS resume screening.`);
  }
  if (impactMetrics < 65) {
    redFlags.push('Low quantifiable metrics density. Many achievements lack clear numbers, scale, or business ROI.');
  }
  if (!textLower.includes('github') && !textLower.includes('http')) {
    redFlags.push('No verifiable proof of work (missing live URLs, GitHub repositories, or clickable demos).');
  }

  const summaryBrutalCritique = overall >= 85
    ? `Your profile is in the top ${100 - percentileRank}% for ${role.title} candidates! Your technical stack and achievements are clear. To reach the top 1%, sharpen your bullet points with the Google X-Y-Z formula (Accomplished X measured by Y by doing Z) and ensure every project has a working live demo link.`
    : `Your profile shows solid promise but is currently leaking recruiter interest due to ${redFlags.length} key friction points. Recruiters spend only 6 seconds scanning: replace passive verbs with commanding action words, embed quantitative metrics (%, ms, $, scale) in every bullet, and inject the ${missingKeywords.slice(0, 4).map(k => k.keyword).join(', ')} keywords to pass automated ATS filters.`;

  // 6. Actionable Checklist
  const actionableChecklist = [
    {
      priority: 'Critical' as const,
      title: `Inject ${missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')} into Core Skills`,
      description: `ATS screening engines automatically score your resume based on keyword density. Adding these ${role.title} terms will instantly boost your match rate.`,
      estimatedLift: '+24% ATS Match'
    },
    {
      priority: 'High' as const,
      title: 'Upgrade 3 Bullet Points to Google X-Y-Z Formula',
      description: 'Rewrite passive bullet points to clearly state: "Accomplished [X], measured by [Y], by doing [Z]" to prove tangible business impact.',
      estimatedLift: '+18% Interview Rate'
    },
    {
      priority: 'Medium' as const,
      title: 'Add Live Interactive URLs & Architecture Diagrams',
      description: 'Senior recruiters and engineering leads value interactive proof of work over static text bullet points.',
      estimatedLift: '+15% Credibility'
    },
    {
      priority: 'Quick Win' as const,
      title: `Replace Weak Verbs (${weakVerbsFound.slice(0, 2).join(', ') || 'worked on'}) with Power Verbs`,
      description: `Switch to active verbs like "Architected", "Spearheaded", "Optimized", or "Orchestrated" to convey immediate leadership.`,
      estimatedLift: '+10% First Impression'
    }
  ];

  // 7. Projects, Bullet Points, Heatmap, and Launch Copy
  const projects = extractProjectsFromContent(content, role.title);
  const bulletAnalyses = analyzeAndRewriteBulletPoints(content, role.title);
  const recruiterHeatmap = generateRecruiterHeatmap(content, readability, score);
  const launchCopy = generateLaunchAssets(
    content.split('\n')[0] || 'Software Engineer',
    role.title,
    presentKeywords.map(k => k.keyword).slice(0, 6),
    projects,
    content
  );

  return {
    roleId,
    targetRoleTitle: role.title,
    score,
    percentileRank,
    grade,
    summaryBrutalCritique,
    keyStrengths,
    redFlags,
    missingKeywords,
    presentKeywords,
    keywordDensityRating,
    readability: {
      ...readability,
      metricsDensityPercent,
      weakVerbsFound,
      strongVerbsFound
    },
    projects,
    actionableChecklist,
    bulletAnalyses,
    recruiterHeatmap,
    launchCopy,
    socialLinks: {
      linkedin: socialLinks.linkedin,
      github: socialLinks.github,
      twitter: socialLinks.twitter,
      portfolioUrl: socialLinks.portfolioUrl
    }
  };
}
