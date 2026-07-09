import React, { useState } from 'react';
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Gavel,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";
import { ToastProvider } from './components/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Dashboard } from './components/dashboard/Dashboard';

type NavItem = "dashboard" | "jobs" | "artisans" | "settlements" | "disputes";

function AppContent() {
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="OwoWork navigation">
        <div className="brand-mark">
          <span>OW</span>
        </div>
        <nav className="rail" aria-label="Primary navigation">
          <button
            className={`rail-button ${activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveNav("dashboard")}
            aria-label="Dashboard"
            aria-current={activeNav === "dashboard" ? "page" : undefined}
          >
            <LayoutDashboard size={20} />
          </button>
          <button
            className={`rail-button ${activeNav === "jobs" ? "active" : ""}`}
            onClick={() => setActiveNav("jobs")}
            aria-label="Jobs"
            aria-current={activeNav === "jobs" ? "page" : undefined}
          >
            <BriefcaseBusiness size={20} />
          </button>
          <button
            className={`rail-button ${activeNav === "artisans" ? "active" : ""}`}
            onClick={() => setActiveNav("artisans")}
            aria-label="Artisans"
            aria-current={activeNav === "artisans" ? "page" : undefined}
          >
            <UsersRound size={20} />
          </button>
          <button
            className={`rail-button ${activeNav === "settlements" ? "active" : ""}`}
            onClick={() => setActiveNav("settlements")}
            aria-label="Settlements"
            aria-current={activeNav === "settlements" ? "page" : undefined}
          >
            <CircleDollarSign size={20} />
          </button>
          <button
            className={`rail-button ${activeNav === "disputes" ? "active" : ""}`}
            onClick={() => setActiveNav("disputes")}
            aria-label="Disputes"
            aria-current={activeNav === "disputes" ? "page" : undefined}
          >
            <Gavel size={20} />
          </button>
        </nav>
      </aside>

      <section className="workspace">
        {activeNav === "dashboard" && <Dashboard />}
        {activeNav !== "dashboard" && (
          <div className="placeholder-page" aria-label={`${activeNav} page`}>
            <p className="eyebrow">{activeNav}</p>
            <h1>Coming soon</h1>
            <p style={{ color: "var(--muted)", marginTop: "12px" }}>
              This section is under construction.
            </p>
          </div>
        )}
      </section>

      {/* Job creation form modal */}
      {showJobForm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create new job">
          <div className="modal-body">
            <JobForm onCancel={handleCloseJobForm} onSuccess={handleJobSuccess} />
          </div>
        </div>
      )}
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
