// Mock data and simulation logic for the dashboard

export type JobState = "Open" | "Active" | "Disputed" | "Completed" | "Refunded";

export type Job = {
  id: string;
  customer: string;
  artisan: string;
  trade: string;
  state: JobState;
  amount: number; // XLM
  started: string;
  location: string;
  hash: string;
  timestamp: number;
};

export type DashboardMetrics = {
  totalEscrowVolume: number; // XLM
  activeJobsCount: number;
  completedToday: number;
  disputeRate: number; // percentage 0-100
  completionRate: number; // percentage 0-100
  healthStatus: "healthy" | "warning" | "critical";
  recentActivity: ActivityEvent[];
  jobsByStatus: StatusCount[];
  completionTrend: TrendPoint[];
  artisanEarnings: EarningsSlice[];
};

export type ActivityEvent = {
  id: string;
  jobId: string;
  from: JobState | null;
  to: JobState;
  artisan: string;
  trade: string;
  amount: number;
  time: string;
  timestamp: number;
};

export type StatusCount = {
  status: JobState;
  count: number;
  fill: string;
};

export type TrendPoint = {
  day: string;
  rate: number;
};

export type EarningsSlice = {
  trade: string;
  earnings: number;
  fill: string;
};

const TRADES = ["Plumbing", "Electrical", "Carpentry", "Painting", "Tiling", "Masonry", "Welding", "AC Repair"];
const CUSTOMERS = ["Ada N.", "Timi R.", "Lara O.", "Kunle A.", "Sade B.", "Emeka F.", "Nkechi O.", "Yusuf M.", "Fatima H.", "Bisi A."];
const ARTISANS = ["Musa K.", "Efe A.", "Bayo S.", "Nneka I.", "Chidi U.", "Jide O.", "Amaka P.", "Gbenga T.", "Halima D.", "Seun L."];
const LOCATIONS = ["Yaba", "Surulere", "Ikeja", "Lekki", "Ajah", "Maryland", "Isale-Eko", "Gbagada", "Ikoyi", "VI"];
const ALL_STATES: JobState[] = ["Open", "Active", "Disputed", "Completed", "Refunded"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomHash(): string {
  return Math.random().toString(36).substring(2, 8);
}

function randomAmount(): number {
  return Math.round((Math.random() * 2000 + 50) * 10) / 10;
}

let jobCounter = 1042;

function generateJob(): Job {
  const state = randomFrom(ALL_STATES);
  return {
    id: `OWO-${jobCounter++}`,
    customer: randomFrom(CUSTOMERS),
    artisan: randomFrom(ARTISANS),
    trade: randomFrom(TRADES),
    state,
    amount: randomAmount(),
    started: `${String(Math.floor(Math.random() * 12) + 7).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    location: randomFrom(LOCATIONS),
    hash: randomHash(),
    timestamp: Date.now() - Math.floor(Math.random() * 86400000),
  };
}

// Generate initial job pool
const INITIAL_JOBS: Job[] = Array.from({ length: 24 }, generateJob);

// Ensure some variety in states
INITIAL_JOBS[0].state = "Active";
INITIAL_JOBS[1].state = "Disputed";
INITIAL_JOBS[2].state = "Completed";
INITIAL_JOBS[3].state = "Open";
INITIAL_JOBS[4].state = "Active";
INITIAL_JOBS[5].state = "Completed";
INITIAL_JOBS[6].state = "Refunded";
INITIAL_JOBS[7].state = "Completed";

let currentJobs: Job[] = [...INITIAL_JOBS];
let activityLog: ActivityEvent[] = [];

function generateTrend(): TrendPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    rate: Math.round(65 + Math.random() * 30),
  }));
}

let completionTrend = generateTrend();

function computeMetrics(): DashboardMetrics {
  const total = currentJobs.length;
  const active = currentJobs.filter((j) => j.state === "Active").length;
  const completed = currentJobs.filter((j) => j.state === "Completed").length;
  const disputed = currentJobs.filter((j) => j.state === "Disputed").length;
  const totalVolume = currentJobs.reduce((s, j) => s + j.amount, 0);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const disputeRate = total > 0 ? Math.round((disputed / total) * 100) : 0;

  let healthStatus: DashboardMetrics["healthStatus"] = "healthy";
  if (disputeRate > 20) healthStatus = "critical";
  else if (disputeRate > 10 || completionRate < 60) healthStatus = "warning";

  const jobsByStatus: StatusCount[] = [
    { status: "Open", count: currentJobs.filter((j) => j.state === "Open").length, fill: "#f4bd2f" },
    { status: "Active", count: active, fill: "#9bd9ff" },
    { status: "Completed", count: completed, fill: "#86ddb2" },
    { status: "Disputed", count: disputed, fill: "#ff9aaa" },
    { status: "Refunded", count: currentJobs.filter((j) => j.state === "Refunded").length, fill: "#d8d5cd" },
  ];

  // earnings by trade
  const earningsMap: Record<string, number> = {};
  currentJobs
    .filter((j) => j.state === "Completed")
    .forEach((j) => {
      earningsMap[j.trade] = (earningsMap[j.trade] || 0) + j.amount;
    });

  const TRADE_COLORS = ["#0f8f5f", "#3159ff", "#ff6b27", "#c6415d", "#f4bd2f", "#9bd9ff", "#86ddb2", "#ff9aaa"];
  const artisanEarnings: EarningsSlice[] = Object.entries(earningsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([trade, earnings], i) => ({
      trade,
      earnings: Math.round(earnings * 10) / 10,
      fill: TRADE_COLORS[i % TRADE_COLORS.length],
    }));

  return {
    totalEscrowVolume: Math.round(totalVolume * 10) / 10,
    activeJobsCount: active,
    completedToday: completed,
    disputeRate,
    completionRate,
    healthStatus,
    recentActivity: [...activityLog].slice(0, 5),
    jobsByStatus,
    completionTrend: [...completionTrend],
    artisanEarnings,
  };
}

// Simulate a state change on a random job
function simulateUpdate() {
  if (currentJobs.length === 0) return;

  const transitions: Partial<Record<JobState, JobState[]>> = {
    Open: ["Active"],
    Active: ["Completed", "Disputed"],
    Disputed: ["Refunded", "Completed"],
  };

  const eligibleJobs = currentJobs.filter((j) => transitions[j.state]);
  if (eligibleJobs.length === 0) return;

  const job = randomFrom(eligibleJobs);
  const possibleNext = transitions[job.state]!;
  const nextState = randomFrom(possibleNext);
  const prevState = job.state;

  const event: ActivityEvent = {
    id: randomHash(),
    jobId: job.id,
    from: prevState,
    to: nextState,
    artisan: job.artisan,
    trade: job.trade,
    amount: job.amount,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    timestamp: Date.now(),
  };

  activityLog = [event, ...activityLog].slice(0, 20);
  currentJobs = currentJobs.map((j) => (j.id === job.id ? { ...j, state: nextState } : j));

  // occasionally refresh the trend
  if (Math.random() > 0.7) {
    const lastDay = completionTrend[completionTrend.length - 1];
    completionTrend = [
      ...completionTrend.slice(1),
      { ...lastDay, rate: Math.round(65 + Math.random() * 30) },
    ];
  }
}

/** Fetch a fresh snapshot of dashboard metrics (simulates API call) */
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  simulateUpdate();
  return new Promise((resolve) => {
    setTimeout(() => resolve(computeMetrics()), 300 + Math.random() * 200);
  });
}

/** Get a copy of current jobs for the job list */
export async function fetchJobs(): Promise<Job[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...currentJobs]), 200);
  });
}
