import type { BrandProfile, ContentIdea, ScriptDraft } from "../types/coachcast";

export const mockBrandProfile: BrandProfile = {
  workspaceName: "Fit With Maya",
  tone: ["direct", "warm", "technical"],
  audience: {
    summary: "Busy adults who want strength, fat loss, and confidence without gym intimidation.",
    ageRange: "28-45",
    experienceLevel: "Beginner to intermediate"
  },
  offers: ["1:1 strength coaching", "8-week beginner strength program"],
  contentPillars: ["form fixes", "myth busting", "quick workouts", "client wins"],
  painPoints: ["no time", "fear of bad form", "low confidence", "confusing nutrition advice"],
  avoidClaims: ["guaranteed weight loss", "medical claims", "spot reduction promises"]
};

export const mockContentIdeas: ContentIdea[] = [
  {
    id: "squat-mistakes",
    title: "3 Squat Mistakes Beginners Miss",
    hook: "If your knees cave during squats, stop blaming your knees.",
    viewerPain: "Bad form and fear of injury",
    format: "form-fix",
    cta: "DM SQUAT for a beginner form checklist",
    confidence: 0.91
  },
  {
    id: "busy-workout",
    title: "A 12-Minute Strength Session for Busy Days",
    hook: "If you only have 12 minutes, do not waste them on random exercises.",
    viewerPain: "No time to train",
    format: "mini-workout",
    cta: "Save this for your next busy day",
    confidence: 0.88
  },
  {
    id: "protein-myth",
    title: "The Protein Myth That Keeps Beginners Stuck",
    hook: "You probably do not need a perfect diet. You need a repeatable protein habit.",
    viewerPain: "Nutrition confusion",
    format: "myth-busting",
    cta: "Comment PROTEIN for the simple plate guide",
    confidence: 0.84
  },
  {
    id: "gym-confidence",
    title: "How to Walk Into the Gym With a Plan",
    hook: "Gym confidence does not come from motivation. It comes from knowing your first three moves.",
    viewerPain: "Feeling intimidated",
    format: "educational",
    cta: "Follow for beginner strength systems",
    confidence: 0.87
  }
];

export const mockScriptDraft: ScriptDraft = {
  id: "script-squat-mistakes",
  ideaId: "squat-mistakes",
  hook: "If your knees cave during squats, stop blaming your knees.",
  teleprompterText:
    "If your knees cave during squats, stop blaming your knees. Most beginners need a better warmup and clearer foot pressure. Before your next set, try twenty seconds of banded lateral walks, then think tripod foot: big toe, little toe, heel. Film one rep from the front. If your knees track better, keep that warmup in. DM SQUAT and I will send you the checklist.",
  beats: ["Name the visible mistake", "Reframe the cause", "Show the warmup", "Give one cue", "Close with CTA"],
  caption: "Save this before your next squat day. Better reps start before the first set.",
  hashtags: ["#strengthtraining", "#squattips", "#beginnerfitness", "#personaltrainer"],
  shotList: ["talking head hook", "banded lateral walk", "front-angle squat demo", "CTA close"]
};
