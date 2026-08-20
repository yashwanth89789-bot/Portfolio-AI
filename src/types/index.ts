export interface RoleInfo {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  toolsAndFrameworks: string[];
  metricsToHighlight: string[];
  commonMistakes: string[];
  resumeEssentials: string[];
  portfolioMustHaves: string[];
}

export interface AnalysisScore {
  overall: number;
  atsCompliance: number;
  impactMetrics: number;
  technicalDepth: number;
  actionVerbPower: number;
  structureAndUx: number;
  socialProof: number;
}

export interface KeywordMatch {
  keyword: string;
  category: 'core' | 'framework' | 'methodology' | 'metric';
  importance: 'critical' | 'recommended' | 'bonus';
  suggestedContext?: string;
  countInText: number;
}

export interface HighlightedPhraseToken {
  text: string;
  type: 'passive' | 'weak' | 'power' | 'metric' | 'normal';
  feedback?: string;
  suggestedReplacement?: string;
}

export interface BulletImpactBreakdown {
  actionVerbScore: number;
  metricsScore: number;
  outcomeScore: number;
  clarityScore: number;
  penalty: number;
}

export interface BulletPointAnalysis {
  original: string;
  score: number; // 0 - 100 Impact Score
  grade: 'Elite' | 'Strong' | 'Needs Work' | 'Critical';
  actionVerb: { word: string; isStrong: boolean; isPassive: boolean };
  hasMetrics: boolean;
  hasOutcome: boolean;
  critique: string;
  passivePhrasesFound: string[];
  weakPhrasesFound: string[];
  powerVerbsFound: string[];
  metricsFound: string[];
  tokens: HighlightedPhraseToken[];
  breakdown: BulletImpactBreakdown;
  rewrites: {
    xyzFormula: string; // Google XYZ: Accomplished [X], measured by [Y], by doing [Z]
    executive: string;  // High-level leadership / impact
    technical: string;  // Tech stack & architecture focused
    concise: string;    // Punchy 1-line ATS optimized
  };
}

export interface ExtractedProject {
  title: string;
  role: string;
  description: string;
  detectedTech: string[];
  metricsFound: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  roastAndSuggestion: string;
  score: number;
}

export interface RecruiterScanArea {
  id: string;
  label: string;
  intensity: 'high' | 'medium' | 'low' | 'dead-zone';
  snippet: string;
  gazeTimeEst: string;
  feedback: string;
}

export interface LaunchCopyAssets {
  twitterThread: string[];
  linkedinPost: string;
  productHuntPitch: {
    tagline: string;
    description: string;
    makerComment: string;
  };
  hackerNewsShow: string;
  coldOutreachDM: string;
}

export interface FullAuditResult {
  roleId: string;
  targetRoleTitle: string;
  score: AnalysisScore;
  percentileRank: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  summaryBrutalCritique: string;
  keyStrengths: string[];
  redFlags: string[];
  missingKeywords: KeywordMatch[];
  presentKeywords: KeywordMatch[];
  keywordDensityRating: 'Low' | 'Balanced' | 'Stuffed';
  readability: {
    readingEase: number;
    gradeLevel: string;
    wordCount: number;
    sentenceCount: number;
    metricsDensityPercent: number;
    weakVerbsFound: string[];
    strongVerbsFound: string[];
  };
  projects: ExtractedProject[];
  actionableChecklist: {
    priority: 'Critical' | 'High' | 'Medium' | 'Quick Win';
    title: string;
    description: string;
    estimatedLift: string;
  }[];
  bulletAnalyses: BulletPointAnalysis[];
  recruiterHeatmap: RecruiterScanArea[];
  launchCopy: LaunchCopyAssets;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolioUrl?: string;
  };
}

export interface SamplePortfolio {
  id: string;
  role: string;
  name: string;
  experienceLevel: string;
  tagline: string;
  content: string;
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
  };
}
