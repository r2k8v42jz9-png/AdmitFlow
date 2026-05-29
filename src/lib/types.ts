export type Tone = "ok" | "warning" | "danger" | "muted";

export interface Program {
  name: string;
  degree: "Bachelor" | "Master" | "PhD";
  duration: string;
  tuitionPerYear: number;
}

export interface Scholarship {
  name: string;
  amount: string;
  coverage: string;
  deadline: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  flag: string;
  logoColor: string;
  rankWorld: number;
  rankNational: number;
  acceptanceRate: number; // percent
  tuitionPerYear: number;
  currency: string;
  livingCost: number;
  studentCount: number;
  intlPercent: number;
  fitScore: number; // 0-100, AI fit
  admissionProbability: number; // 0-100, for current mock user
  tags: string[];
  requirements: {
    gpa: number;
    ielts: number;
    sat?: number;
    gre?: number;
    essays: number;
    recommendations: number;
  };
  deadlines: { round: string; date: string }[];
  programs: Program[];
  scholarships: Scholarship[];
  highlights: string[];
  aiInsight: string;
  blurb: string;
  accent: string; // tailwind gradient classes
  website?: string;
}

export interface ApplicationItem {
  id: string;
  universityId: string;
  program: string;
  status: "researching" | "in-progress" | "submitted" | "interview" | "accepted" | "rejected";
  progress: number;
  deadline: string;
  tasksDone: number;
  tasksTotal: number;
  round: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  universityId?: string;
  date: string;
  type: "application" | "scholarship" | "exam" | "document";
}

export interface ActivityItem {
  id: string;
  type: "ai" | "document" | "deadline" | "university" | "milestone";
  title: string;
  detail: string;
  time: string;
}

export interface RoadmapTask {
  id: string;
  label: string;
  done: boolean;
}
export interface RoadmapMilestone {
  id: string;
  title: string;
  window: string;
  status: "done" | "active" | "upcoming";
  description: string;
  icon: string;
  tasks: RoadmapTask[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
export interface ChatThread {
  id: string;
  title: string;
  preview: string;
  time: string;
  messages?: ChatMessage[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  tagline: string;
  highlight?: boolean;
  badge?: string;
  cta: string;
  features: string[];
}
