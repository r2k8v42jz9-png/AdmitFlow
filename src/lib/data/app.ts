import type { ApplicationItem, ActivityItem, DeadlineItem, RoadmapMilestone } from "@/lib/types";

export const currentUser = {
  name: "Aziz Saburov",
  email: "aziz2008listik@gmail.com",
  avatar: "",
  plan: "Pro" as const,
  intendedMajor: "Computer Science",
  targetIntake: "Fall 2027",
  gpa: 3.84,
  gpaScale: 4.0,
  ielts: 7.5,
  sat: 1520,
  countries: ["United States", "United Kingdom", "Switzerland"],
  budget: 45000,
  profileCompletion: 78,
  admissionScore: 74,
  streakDays: 12,
};

export const applications: ApplicationItem[] = [
  {
    id: "app-1",
    universityId: "mit",
    program: "Computer Science & Engineering",
    status: "in-progress",
    progress: 62,
    deadline: "2026-11-01",
    tasksDone: 8,
    tasksTotal: 13,
    round: "Early Action",
  },
  {
    id: "app-2",
    universityId: "eth",
    program: "Computer Science (MSc)",
    status: "in-progress",
    progress: 45,
    deadline: "2026-12-15",
    tasksDone: 5,
    tasksTotal: 11,
    round: "Regular",
  },
  {
    id: "app-3",
    universityId: "toronto",
    program: "Computer Science (PEY)",
    status: "submitted",
    progress: 100,
    deadline: "2027-01-15",
    tasksDone: 12,
    tasksTotal: 12,
    round: "International",
  },
  {
    id: "app-4",
    universityId: "oxford",
    program: "Computer Science",
    status: "interview",
    progress: 88,
    deadline: "2026-10-15",
    tasksDone: 10,
    tasksTotal: 11,
    round: "UCAS",
  },
  {
    id: "app-5",
    universityId: "tum",
    program: "Informatics",
    status: "researching",
    progress: 15,
    deadline: "2027-01-15",
    tasksDone: 2,
    tasksTotal: 10,
    round: "Winter",
  },
];

export const statusMeta: Record<
  ApplicationItem["status"],
  { label: string; tone: string; dot: string }
> = {
  researching: { label: "Researching", tone: "text-muted-foreground", dot: "bg-muted-foreground" },
  "in-progress": { label: "In progress", tone: "text-brand-blue", dot: "bg-brand-blue" },
  submitted: { label: "Submitted", tone: "text-brand-violet", dot: "bg-brand-violet" },
  interview: { label: "Interview", tone: "text-warning", dot: "bg-warning" },
  accepted: { label: "Accepted", tone: "text-success", dot: "bg-success" },
  rejected: { label: "Rejected", tone: "text-destructive", dot: "bg-destructive" },
};

export const deadlines: DeadlineItem[] = [
  { id: "d-0", title: "Oxford interview prep call", universityId: "oxford", date: "2026-06-04", type: "application" },
  { id: "d-1", title: "MIT Early Action submission", universityId: "mit", date: "2026-11-01", type: "application" },
  { id: "d-2", title: "Knight-Hennessy essay draft", universityId: "stanford", date: "2026-06-12", type: "scholarship" },
  { id: "d-3", title: "Upload IELTS certificate", date: "2026-06-08", type: "document" },
  { id: "d-4", title: "ETH Zürich application", universityId: "eth", date: "2026-12-15", type: "application" },
  { id: "d-5", title: "GRE general test", date: "2026-07-20", type: "exam" },
  { id: "d-6", title: "Recommendation letter #2", date: "2026-06-22", type: "document" },
];

export const activity: ActivityItem[] = [
  { id: "a-1", type: "ai", title: "AI Mentor generated your essay outline", detail: "Common App — personal statement", time: "12m ago" },
  { id: "a-2", type: "milestone", title: "Submitted University of Toronto application", detail: "Computer Science (PEY)", time: "2h ago" },
  { id: "a-3", type: "document", title: "Uploaded transcript", detail: "Verified · 4 documents complete", time: "5h ago" },
  { id: "a-4", type: "university", title: "Saved ETH Zürich to your list", detail: "Fit score 91 · likely match", time: "Yesterday" },
  { id: "a-5", type: "deadline", title: "Oxford interview scheduled", detail: "Computer Science · Jun 4", time: "Yesterday" },
  { id: "a-6", type: "ai", title: "Admission score updated to 74", detail: "+6 after adding extracurriculars", time: "2d ago" },
];

export const admissionTrend = [
  { month: "Jan", score: 52 },
  { month: "Feb", score: 57 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 64 },
  { month: "May", score: 68 },
  { month: "Jun", score: 74 },
];

export const profileRadar = [
  { axis: "Academics", value: 88 },
  { axis: "Test scores", value: 76 },
  { axis: "Essays", value: 64 },
  { axis: "Extracurric.", value: 82 },
  { axis: "Recommend.", value: 70 },
  { axis: "Experience", value: 58 },
];

export const roadmap: RoadmapMilestone[] = [
  {
    id: "m-1",
    title: "Profile & test scores",
    window: "Jan – Mar 2026",
    status: "done",
    icon: "GraduationCap",
    description: "Lock in academics, sit standardized tests and translate documents.",
    tasks: [
      { id: "t-1", label: "Achieve target IELTS (7.5)", done: true },
      { id: "t-2", label: "Sit SAT (1520)", done: true },
      { id: "t-3", label: "Translate & notarize transcript", done: true },
    ],
  },
  {
    id: "m-2",
    title: "Shortlist universities",
    window: "Apr – Jun 2026",
    status: "active",
    icon: "Telescope",
    description: "Build a balanced list of reach, target and safety schools with AI fit analysis.",
    tasks: [
      { id: "t-4", label: "Finalize list of 8 universities", done: true },
      { id: "t-5", label: "Compare tuition & scholarships", done: true },
      { id: "t-6", label: "Run admission probability for each", done: false },
    ],
  },
  {
    id: "m-3",
    title: "Essays & recommendations",
    window: "Jul – Sep 2026",
    status: "upcoming",
    icon: "PenLine",
    description: "Draft, refine and get AI feedback on essays; secure recommenders.",
    tasks: [
      { id: "t-7", label: "Draft personal statement", done: false },
      { id: "t-8", label: "Request 2 recommendation letters", done: false },
      { id: "t-9", label: "Polish supplemental essays", done: false },
    ],
  },
  {
    id: "m-4",
    title: "Submit applications",
    window: "Oct 2026 – Jan 2027",
    status: "upcoming",
    icon: "Send",
    description: "Submit each application before its round deadline and confirm receipt.",
    tasks: [
      { id: "t-10", label: "Submit Early Action rounds", done: false },
      { id: "t-11", label: "Apply for scholarships", done: false },
      { id: "t-12", label: "Prepare for interviews", done: false },
    ],
  },
  {
    id: "m-5",
    title: "Decisions & visa",
    window: "Feb – Jul 2027",
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

export const savedUniversityIds = ["mit", "eth", "oxford", "toronto", "tum", "stanford"];
