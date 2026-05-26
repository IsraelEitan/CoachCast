export type BrandProfile = {
  workspaceName: string;
  tone: string[];
  audience: {
    summary: string;
    ageRange: string;
    experienceLevel: string;
  };
  offers: string[];
  contentPillars: string[];
  painPoints: string[];
  avoidClaims: string[];
};

export type ContentIdea = {
  id: string;
  title: string;
  hook: string;
  viewerPain: string;
  format: string;
  cta: string;
  confidence: number;
};

export type ScriptDraft = {
  id: string;
  ideaId: string;
  hook: string;
  teleprompterText: string;
  beats: string[];
  caption: string;
  hashtags: string[];
  shotList: string[];
};
