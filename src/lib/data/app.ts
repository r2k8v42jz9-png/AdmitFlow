import type { RoadmapMilestone } from "@/lib/types";

/**
 * Marketing-only illustration for the public landing page's "roadmap preview"
 * section. This is decorative sample content shown to logged-out visitors — it
 * is NOT user data and never appears in the authenticated product UI.
 *
 * All per-user data (profile, universities, applications, deadlines, streak,
 * progress) comes exclusively from Supabase via `src/lib/supabase/data.ts`.
 */
export const roadmap: RoadmapMilestone[] = [
  {
    id: "m-1",
    title: "Profile & test scores",
    window: "Step 1",
    status: "done",
    icon: "GraduationCap",
    description: "Lock in academics, sit standardized tests and prepare documents.",
    tasks: [
      { id: "t-1", label: "Achieve your target IELTS", done: true },
      { id: "t-2", label: "Sit the SAT", done: true },
      { id: "t-3", label: "Translate & notarize transcript", done: true },
    ],
  },
  {
    id: "m-2",
    title: "Shortlist universities",
    window: "Step 2",
    status: "active",
    icon: "Telescope",
    description: "Build a balanced list of reach, target and safety schools with fit analysis.",
    tasks: [
      { id: "t-4", label: "Finalize your university list", done: true },
      { id: "t-5", label: "Compare tuition & scholarships", done: true },
      { id: "t-6", label: "Run admission probability for each", done: false },
    ],
  },
  {
    id: "m-3",
    title: "Essays & recommendations",
    window: "Step 3",
    status: "upcoming",
    icon: "PenLine",
    description: "Draft, refine and get feedback on essays; secure recommenders.",
    tasks: [
      { id: "t-7", label: "Draft personal statement", done: false },
      { id: "t-8", label: "Request recommendation letters", done: false },
      { id: "t-9", label: "Polish supplemental essays", done: false },
    ],
  },
  {
    id: "m-4",
    title: "Submit applications",
    window: "Step 4",
    status: "upcoming",
    icon: "Send",
    description: "Submit each application before its round deadline and confirm receipt.",
    tasks: [
      { id: "t-10", label: "Submit early-action rounds", done: false },
      { id: "t-11", label: "Apply for scholarships", done: false },
      { id: "t-12", label: "Prepare for interviews", done: false },
    ],
  },
  {
    id: "m-5",
    title: "Decisions & visa",
    window: "Step 5",
    status: "upcoming",
    icon: "PartyPopper",
    description: "Compare offers, accept the best fit and complete visa and housing.",
    tasks: [
      { id: "t-13", label: "Compare admission offers", done: false },
      { id: "t-14", label: "Accept & pay deposit", done: false },
      { id: "t-15", label: "Apply for student visa", done: false },
    ],
  },
];
