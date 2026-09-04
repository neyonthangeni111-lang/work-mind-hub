export type CaseStatus = "Open" | "Under Review" | "Action Required" | "Resolved" | "Closed";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export type WorkCase = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: CaseStatus;
  owner: string;
  opened: string;
  nextAction: string;
  deadline: string;
  notes: string;
};

export const caseCategories = [
  "Employee grievance",
  "Workplace conflict",
  "Disciplinary matter",
  "Absence-related concern",
  "Performance concern",
  "Interpersonal conflict",
  "Workplace complaint",
  "Mediation",
  "Employee wellbeing concern",
];

export const caseStatuses: CaseStatus[] = [
  "Open",
  "Under Review",
  "Action Required",
  "Resolved",
  "Closed",
];

export const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];

export const seedCases: WorkCase[] = [
  {
    id: "ER-2041",
    title: "Grievance regarding shift allocation fairness",
    category: "Employee grievance",
    priority: "High",
    status: "Action Required",
    owner: "N. Nthangeni",
    opened: "2026-08-24",
    nextAction: "Issue written response to grievance",
    deadline: "2026-09-05",
    notes: "Employee raised concerns about weekend roster distribution across the packing team.",
  },
  {
    id: "ER-2038",
    title: "Interpersonal conflict between two team leads",
    category: "Interpersonal conflict",
    priority: "Medium",
    status: "Under Review",
    owner: "T. Mokoena",
    opened: "2026-08-19",
    nextAction: "Schedule facilitated discussion",
    deadline: "2026-09-09",
    notes: "Repeated communication breakdowns during handover meetings.",
  },
  {
    id: "LR-1177",
    title: "Disciplinary matter — attendance policy breach",
    category: "Disciplinary matter",
    priority: "Critical",
    status: "Open",
    owner: "P. Naidoo",
    opened: "2026-08-31",
    nextAction: "Prepare investigation pack for hearing",
    deadline: "2026-09-08",
    notes: "Hearing scheduled. Representation confirmed.",
  },
  {
    id: "ER-2030",
    title: "Wellbeing concern raised by line manager",
    category: "Employee wellbeing concern",
    priority: "Medium",
    status: "Under Review",
    owner: "L. Dube",
    opened: "2026-08-12",
    nextAction: "Offer support options and review workload",
    deadline: "2026-09-12",
    notes: "Workload pressure indicator elevated in the department.",
  },
  {
    id: "ER-2019",
    title: "Workplace complaint — communication conduct",
    category: "Workplace complaint",
    priority: "Low",
    status: "Resolved",
    owner: "N. Nthangeni",
    opened: "2026-07-28",
    nextAction: "Close file after 30-day review",
    deadline: "2026-09-15",
    notes: "Agreement reached during mediation session.",
  },
  {
    id: "LR-1164",
    title: "Collective dispute — overtime interpretation",
    category: "Workplace conflict",
    priority: "High",
    status: "Under Review",
    owner: "P. Naidoo",
    opened: "2026-08-04",
    nextAction: "Consultation meeting with representatives",
    deadline: "2026-09-11",
    notes: "Parties agreed to a further consultation round before escalation.",
  },
];

export type Grievance = {
  id: string;
  title: string;
  party: string;
  issue: string;
  raised: string;
  status: CaseStatus;
  actions: string;
  nextStep: string;
};

export const seedGrievances: Grievance[] = [
  {
    id: "GRV-311",
    title: "Shift allocation fairness",
    party: "Packing team representative",
    issue: "Perceived uneven distribution of weekend shifts",
    raised: "2026-08-24",
    status: "Action Required",
    actions: "Initial meeting held; roster data requested",
    nextStep: "Written response within grievance timeframe",
  },
  {
    id: "GRV-308",
    title: "Acting allowance not paid",
    party: "Administration department",
    issue: "Allowance for acting role disputed",
    raised: "2026-08-15",
    status: "Under Review",
    actions: "Payroll records under review",
    nextStep: "Feedback meeting with employee",
  },
  {
    id: "GRV-299",
    title: "Supervisor communication conduct",
    party: "Warehouse team member",
    issue: "Concerns about tone during team briefings",
    raised: "2026-07-30",
    status: "Resolved",
    actions: "Facilitated discussion completed",
    nextStep: "30-day follow-up review",
  },
];

export type Disciplinary = {
  id: string;
  matter: string;
  employee: string;
  date: string;
  policy: string;
  stage: string;
  requiredAction: string;
  hearing: string;
  outcome: string;
};

export const seedDisciplinaries: Disciplinary[] = [
  {
    id: "DIS-084",
    matter: "Repeated unauthorised absence",
    employee: "Employee #4471",
    date: "2026-08-31",
    policy: "Attendance & Timekeeping Policy",
    stage: "Investigation",
    requiredAction: "Complete investigation report",
    hearing: "2026-09-10",
    outcome: "Pending",
  },
  {
    id: "DIS-081",
    matter: "Failure to follow safety procedure",
    employee: "Employee #3390",
    date: "2026-08-18",
    policy: "Occupational Health & Safety Policy",
    stage: "Hearing scheduled",
    requiredAction: "Confirm representation and evidence bundle",
    hearing: "2026-09-06",
    outcome: "Pending",
  },
  {
    id: "DIS-072",
    matter: "Misuse of company communication channels",
    employee: "Employee #2210",
    date: "2026-07-22",
    policy: "ICT Acceptable Use Policy",
    stage: "Concluded",
    requiredAction: "File outcome documentation",
    hearing: "2026-08-05",
    outcome: "Written warning (6 months)",
  },
];

export type Dispute = {
  id: string;
  parties: string;
  nature: string;
  keyIssues: string[];
  timelineStage: number;
  outstanding: string[];
};

export const disputeTimeline = [
  "Issue Raised",
  "Investigation",
  "Meeting",
  "Mediation",
  "Agreement",
  "Resolution",
];

export const seedDisputes: Dispute[] = [
  {
    id: "DSP-042",
    parties: "Operations management ↔ Shopfloor representatives",
    nature: "Interpretation of overtime arrangement",
    keyIssues: ["Overtime rotation", "Consultation process", "Notice periods"],
    timelineStage: 2,
    outstanding: ["Share roster data", "Confirm consultation date"],
  },
  {
    id: "DSP-039",
    parties: "Team Lead A ↔ Team Lead B",
    nature: "Ongoing interpersonal conflict affecting handovers",
    keyIssues: ["Handover communication", "Role boundaries"],
    timelineStage: 3,
    outstanding: ["Mediation session follow-up"],
  },
];

export type WorkTask = {
  id: string;
  title: string;
  caseRef: string;
  deadline: string;
  duration: string;
  priority: Priority;
  category: string;
  done: boolean;
};

export const taskCategories = [
  "Employee Relations",
  "Labour Relations",
  "Meetings",
  "Documentation",
  "Investigation",
  "Communication",
  "Reporting",
  "Personal Productivity",
];

export const seedTasks: WorkTask[] = [
  {
    id: "T-1",
    title: "Draft grievance response letter",
    caseRef: "GRV-311",
    deadline: "2026-09-05",
    duration: "45 min",
    priority: "Critical",
    category: "Communication",
    done: false,
  },
  {
    id: "T-2",
    title: "Complete investigation report",
    caseRef: "DIS-084",
    deadline: "2026-09-08",
    duration: "2 h",
    priority: "High",
    category: "Investigation",
    done: false,
  },
  {
    id: "T-3",
    title: "Prepare consultation agenda",
    caseRef: "DSP-042",
    deadline: "2026-09-11",
    duration: "30 min",
    priority: "Medium",
    category: "Meetings",
    done: false,
  },
  {
    id: "T-4",
    title: "Summarise wellbeing pulse themes",
    caseRef: "ER-2030",
    deadline: "2026-09-12",
    duration: "1 h",
    priority: "Medium",
    category: "Reporting",
    done: false,
  },
  {
    id: "T-5",
    title: "File mediation agreement documentation",
    caseRef: "ER-2019",
    deadline: "2026-09-04",
    duration: "20 min",
    priority: "Low",
    category: "Documentation",
    done: true,
  },
];

export type CalendarEvent = {
  date: string;
  title: string;
  type: "Meeting" | "Hearing" | "Mediation" | "Deadline" | "Milestone" | "Follow-up" | "Report";
  time: string;
};

export const seedEvents: CalendarEvent[] = [
  { date: "2026-09-04", title: "Grievance response due — GRV-311", type: "Deadline", time: "16:00" },
  { date: "2026-09-04", title: "Team climate debrief", type: "Meeting", time: "09:30" },
  { date: "2026-09-06", title: "Disciplinary hearing — DIS-081", type: "Hearing", time: "10:00" },
  { date: "2026-09-08", title: "Investigation report milestone — DIS-084", type: "Milestone", time: "12:00" },
  { date: "2026-09-09", title: "Facilitated discussion — ER-2038", type: "Mediation", time: "14:00" },
  { date: "2026-09-11", title: "Consultation meeting — DSP-042", type: "Meeting", time: "11:00" },
  { date: "2026-09-12", title: "Wellbeing indicator report due", type: "Report", time: "17:00" },
  { date: "2026-09-15", title: "30-day follow-up — ER-2019", type: "Follow-up", time: "10:30" },
];

export type Indicator = {
  label: string;
  value: number;
  note: string;
  direction: "up" | "down" | "flat";
};

export const workplaceIndicators: Indicator[] = [
  { label: "Workplace wellbeing", value: 72, note: "Stable across most departments", direction: "flat" },
  { label: "Team climate", value: 68, note: "Slight improvement after team debriefs", direction: "up" },
  { label: "Psychological safety", value: 64, note: "Lower in one operational area", direction: "down" },
  { label: "Communication patterns", value: 70, note: "Handover clarity remains a theme", direction: "up" },
  { label: "Conflict levels", value: 38, note: "Two active interpersonal matters", direction: "down" },
  { label: "Engagement", value: 75, note: "Consistent participation in pulse checks", direction: "up" },
  { label: "Workload pressure", value: 58, note: "Employees may be experiencing higher workload pressure", direction: "down" },
];

export const safetyThemes: Indicator[] = [
  { label: "Communication", value: 71, note: "Briefings viewed as clear by most teams", direction: "up" },
  { label: "Trust", value: 66, note: "Trust in feedback processes is moderate", direction: "flat" },
  { label: "Inclusion", value: 74, note: "Team members report being heard in meetings", direction: "up" },
  { label: "Psychological safety", value: 64, note: "Some hesitancy to raise concerns early", direction: "down" },
  { label: "Workload", value: 57, note: "Employees may be experiencing increased workload pressure", direction: "down" },
  { label: "Manager support", value: 69, note: "Support perceived as available but inconsistent", direction: "flat" },
  { label: "Team collaboration", value: 77, note: "Cross-team cooperation viewed positively", direction: "up" },
];

export const conflictTrend = [
  { month: "Apr", conflicts: 6, grievances: 4, absence: 12 },
  { month: "May", conflicts: 8, grievances: 5, absence: 14 },
  { month: "Jun", conflicts: 5, grievances: 7, absence: 11 },
  { month: "Jul", conflicts: 7, grievances: 6, absence: 15 },
  { month: "Aug", conflicts: 4, grievances: 8, absence: 10 },
  { month: "Sep", conflicts: 3, grievances: 5, absence: 9 },
];

export const resolutionTrend = [
  { month: "Apr", days: 21 },
  { month: "May", days: 19 },
  { month: "Jun", days: 20 },
  { month: "Jul", days: 17 },
  { month: "Aug", days: 15 },
  { month: "Sep", days: 14 },
];
