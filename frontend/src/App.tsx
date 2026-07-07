import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  Gavel,
  Hammer,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Loader2
} from "lucide-react";
import { ToastProvider, useToast } from './components/ToastContext';
import { MetricPanelSkeleton, JobRowSkeleton } from './components/Skeleton';
import { ErrorBoundary } from './components/ErrorBoundary';

type JobState = "Open" | "Active" | "Disputed" | "Completed" | "Refunded";

type Job = {
  id: string;
  customer: string;
  artisan: string;
  trade: string;
  state: JobState;
  amount: number;
  started: string;
  location: string;
  hash: string;
};

const mockJobs: Job[] = [
  {
    id: "OWO-1042",
    customer: "Ada N.",
    artisan: "Musa K.",
    trade: "Plumbing",
    state: "Active",
    amount: 240,
    started: "09:20",
    location: "Yaba",
    hash: "a7f31c"
  },
  {
    id: "OWO-1043",
    customer: "Timi R.",
    artisan: "Efe A.",
    trade: "Electrical",
    state: "Disputed",
    amount: 410,
    started: "11:45",
    location: "Surulere",
    hash: "91dc08"
  },
  {
    id: "OWO-1044",
    customer: "Lara O.",
    artisan: "Bayo S.",
    trade: "Carpentry",
    state: "Open",
    amount: 185,
    started: "13:10",
    location: "Ikeja",
    hash: "6bdf77"
  },
  {
    id: "OWO-1045",
    customer: "Kunle A.",
    artisan: "Nneka I.",
    trade: "Painting",
    state: "Completed",
    amount: 620,
    started: "15:05",
    location: "Lekki",
    hash: "c40a12"
  }
];

const stateMeta: Record<JobState, { label: string; className: string }> = {
  Open: { label: "Open", className: "state-open" },
  Active: { label: "Active", className: "state-active" },
  Disputed: { label: "Disputed", className: "state-disputed" },
  Completed: { label: "Completed", className: "state-completed" },
  Refunded: { label: "Refunded", className: "state-refunded" }
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [creatingJob, setCreatingJob] = useState(false);
  const { addToast } = useToast();

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateJob = async () => {
    setCreatingJob(true);
    // Simulate API call
    setTimeout(() => {
      const newJob: Job = {
        id: `OWO-${1000 + Math.floor(Math.random() * 999)}`,
        customer: "New Customer",
        artisan: "New Artisan",
        trade: "General",
        state: "Open",
        amount: Math.floor(Math.random() * 500) + 100,
        started: new Date().toLocaleTimeString(),
        location: "Lagos",
        hash: Math.random().toString(36).substring(2, 8)
      };
      setJobs(prev => [...prev, newJob]);
      setCreatingJob(false);
      addToast({
        type: "success",
        message: "Job created successfully!"
      });
    }, 2000);
  };

  const simulateError = () => {
    addToast({
      type: "error",
      message: "Network error occurred. Please check your connection.",
      onRetry: () => {
        addToast({
          type: "info",
          message: "Retrying..."
        });
      }
    });
  };

  const activeValue = jobs.reduce((total, job) => total + job.amount, 0);
  const activeJobs = jobs.filter((job) => job.state === "Active").length;
  const disputes = jobs.filter((job) => job.state === "Disputed").length;

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="OwoWork navigation">
        <div className="brand-mark">
          <span>OW</span>
        </div>
        <nav className="rail" aria-label="Primary">
          <button className="rail-button active" aria-label="Jobs">
            <BriefcaseBusiness size={20} />
          </button>
          <button className="rail-button" aria-label="Artisans">
            <UsersRound size={20} />
          </button>
          <button className="rail-button" aria-label="Settlements">
            <CircleDollarSign size={20} />
          </button>
          <button className="rail-button" aria-label="Disputes">
            <Gavel size={20} />
          </button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Escrow desk</p>
            <h1>OwoWork settlement board</h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="ghost-action" onClick={simulateError}>
              Test Error
            </button>
            <button 
              className="primary-action" 
              onClick={handleCreateJob}
              disabled={creatingJob}
            >
              {creatingJob ? (
                <Loader2 size={18} className="loading-spinner" />
              ) : (
                <Sparkles size={18} />
              )}
              {creatingJob ? "Creating..." : "New job"}
            </button>
          </div>
        </header>

        <section className="overview-grid" aria-label="Marketplace overview">
          {loading ? (
            <>
              <MetricPanelSkeleton />
              <MetricPanelSkeleton />
              <MetricPanelSkeleton />
            </>
          ) : (
            <>
              <article className="metric-panel loud">
                <span className="metric-icon">
                  <ShieldCheck size={22} />
                </span>
                <p>Locked value</p>
                <strong>{formatCurrency(activeValue)}</strong>
                <small>Across {jobs.length} on-chain job records</small>
              </article>
              <article className="metric-panel">
                <span className="metric-icon ink">
                  <Hammer size={22} />
                </span>
                <p>Active jobs</p>
                <strong>{activeJobs}</strong>
                <small>Accepted and in progress</small>
              </article>
              <article className="metric-panel">
                <span className="metric-icon warn">
                  <AlertTriangle size={22} />
                </span>
                <p>Disputes</p>
                <strong>{disputes}</strong>
                <small>48 hour resolution window</small>
              </article>
            </>
          )}
        </section>

        <section className="content-grid">
          <article className="job-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Live book</p>
                <h2>Jobs moving through escrow</h2>
              </div>
              <button className="ghost-action">
                View all
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="job-list">
              {loading ? (
                <>
                  <JobRowSkeleton />
                  <JobRowSkeleton />
                  <JobRowSkeleton />
                  <JobRowSkeleton />
                </>
              ) : (
                jobs.map((job) => (
                  <article className="job-row" key={job.id}>
                    <div className="job-token">
                      <span>{job.trade.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="job-main">
                      <div>
                        <h3>{job.id}</h3>
                        <p>
                          {job.customer} to {job.artisan} - {job.location}
                        </p>
                      </div>
                      <code>sha:{job.hash}</code>
                    </div>
                    <div className="job-meta">
                      <strong>{formatCurrency(job.amount)}</strong>
                      <span className={`state-pill ${stateMeta[job.state].className}`}>
                        {stateMeta[job.state].label}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </article>

          <aside className="side-stack">
            <article className="route-panel">
              <div className="route-map" aria-hidden="true">
                <span className="node open">Open</span>
                <span className="node active">Active</span>
                <span className="node done">Done</span>
                <span className="node dispute">Dispute</span>
              </div>
              <h2>Contract route</h2>
              <p>Open jobs can become active, completed, or disputed before a final settlement event.</p>
            </article>

            <article className="reputation-panel">
              <div className="rep-header">
                <BadgeCheck size={22} />
                <div>
                  <h2>Artisan signal</h2>
                  <p>Reputation updates after settlement.</p>
                </div>
              </div>
              <div className="rep-bars" aria-label="Reputation metrics">
                <span style={{ "--value": "82%" } as React.CSSProperties} />
                <span style={{ "--value": "64%" } as React.CSSProperties} />
                <span style={{ "--value": "91%" } as React.CSSProperties} />
              </div>
              <div className="rep-footer">
                <span>
                  <Clock3 size={16} />
                  48h dispute timer
                </span>
                <strong>91%</strong>
              </div>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
