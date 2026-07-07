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
import { MetricPanelSkeleton } from './components/Skeleton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { JobList, Job } from './components/JobList';
import { MetricPanel } from './components/MetricPanel';
import { JobRow } from './components/JobRow';

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

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
        <div className="brand-mark" aria-label="OwoWork brand">
          <span>OW</span>
        </div>
        <nav className="rail" aria-label="Primary navigation">
          <button className="rail-button active" aria-label="Jobs" aria-current="page">
            <BriefcaseBusiness size={20} aria-hidden="true" />
          </button>
          <button className="rail-button" aria-label="Artisans">
            <UsersRound size={20} aria-hidden="true" />
          </button>
          <button className="rail-button" aria-label="Settlements">
            <CircleDollarSign size={20} aria-hidden="true" />
          </button>
          <button className="rail-button" aria-label="Disputes">
            <Gavel size={20} aria-hidden="true" />
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
            <button 
              className="ghost-action" 
              onClick={simulateError}
              aria-label="Test error notification"
            >
              Test Error
            </button>
            <button 
              className="primary-action" 
              onClick={handleCreateJob}
              disabled={creatingJob}
              aria-label={creatingJob ? "Creating new job" : "Create new job"}
              aria-busy={creatingJob}
            >
              {creatingJob ? (
                <Loader2 size={18} className="loading-spinner" aria-hidden="true" />
              ) : (
                <Sparkles size={18} aria-hidden="true" />
              )}
              {creatingJob ? "Creating..." : "New job"}
            </button>
          </div>
        </header>

        <section className="overview-grid" aria-label="Marketplace overview metrics">
          {loading ? (
            <>
              <MetricPanelSkeleton />
              <MetricPanelSkeleton />
              <MetricPanelSkeleton />
            </>
          ) : (
            <>
              <MetricPanel 
                loud
                icon={<ShieldCheck size={22} aria-hidden="true" />}
                title="Locked value"
                value={formatCurrency(activeValue)}
                subtitle={`Across ${jobs.length} on-chain job records`}
              />
              <MetricPanel 
                icon={<Hammer size={22} aria-hidden="true" />}
                iconVariant="ink"
                title="Active jobs"
                value={activeJobs}
                subtitle="Accepted and in progress"
              />
              <MetricPanel 
                icon={<AlertTriangle size={22} aria-hidden="true" />}
                iconVariant="warn"
                title="Disputes"
                value={disputes}
                subtitle="48 hour resolution window"
              />
            </>
          )}
        </section>

        <section className="content-grid">
          <article className="job-panel" aria-label="Jobs list">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Live book</p>
                <h2>Jobs moving through escrow</h2>
              </div>
              <button className="ghost-action" aria-label="View all jobs">
                View all
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>

            <JobList jobs={jobs} loading={loading} />
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
                <BadgeCheck size={22} aria-hidden="true" />
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
                  <Clock3 size={16} aria-hidden="true" />
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
