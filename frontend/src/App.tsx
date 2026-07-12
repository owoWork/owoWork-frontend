import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from './components/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { Layout } from './components/Layout';
import { JobsView } from './components/JobsView';
import { JobDetail } from './components/JobDetail';
import { ArtisansView } from './components/ArtisansView';
import { DisputeDashboard, DisputeDetail } from './components/DisputeResolution';
import { mockDisputes } from './components/DisputeResolution';

import type { JobRole } from './types/jobDetail';

type NavItem = 'dashboard' | 'jobs' | 'artisans' | 'settlements' | 'disputes';

function parseHashRoute() {
  const raw = window.location.hash || '';
  const hash = raw.replace(/^#/, '');
  // supported:
  //   #/jobs
  //   #/jobs/:jobId
  const parts = hash.split('/').filter(Boolean);
  if (parts[0] === 'jobs') {
    if (parts.length >= 2) return { route: 'jobDetail' as const, jobId: parts[1] };
    return { route: 'jobs' as const };
  }
  if (parts[0] === 'disputes') return { route: 'disputes' as const };
  return { route: 'dashboard' as const };
}

function AppInner() {
  const { addToast } = useToast();
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [userRole, setUserRole] = useState<JobRole>('Customer');
  const [jobDetailJobId, setJobDetailJobId] = useState<string | null>(null);
  const [disputeDetailId, setDisputeDetailId] = useState<string | null>(null);

  const route = useMemo(() => parseHashRoute(), [jobDetailJobId, disputeDetailId]);

  useEffect(() => {
    const onHash = () => {
      const r = parseHashRoute();
      if (r.route === 'jobDetail') {
        setActiveNav('jobs');
        setJobDetailJobId(r.jobId);
        setDisputeDetailId(null);
      } else if (r.route === 'jobs') {
        setActiveNav('jobs');
        setJobDetailJobId(null);
        setDisputeDetailId(null);
      } else if (r.route === 'disputes') {
        setActiveNav('disputes');
        setJobDetailJobId(null);
      } else {
        setActiveNav('dashboard');
        setJobDetailJobId(null);
        setDisputeDetailId(null);
      }
    };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleNavigate = (item: string) => {
    if (item === 'logout') {
      addToast({ type: 'info', message: 'Logout is a mock action in this UI.' });
      return;
    }

    if (item === 'dashboard') window.location.hash = '#/';
    if (item === 'jobs') window.location.hash = '#/jobs';
    if (item === 'disputes') window.location.hash = '#/disputes';
    if (item === 'artisans') window.location.hash = '#/artisans';
    if (item === 'settlements') addToast({ type: 'info', message: 'Settlements page is coming soon.' });
  };

  // keep sidebar user role mock-switch simple: role based on activeNav changes for demo
  // (actual app should use auth)
  useEffect(() => {
    // no-op; leaving default role
  }, [activeNav]);

  const selectedDispute = disputeDetailId ? mockDisputes.find((d) => d.id === disputeDetailId) : null;

  return (
    <Layout userRole={userRole} userName={'John Doe'} activeNavItem={activeNav} onNavigate={handleNavigate}>
      {activeNav === 'dashboard' && <Dashboard />}

      {activeNav === 'jobs' && !jobDetailJobId && <JobsView />}

      {activeNav === 'jobs' && jobDetailJobId && (
        <JobDetail
          jobId={jobDetailJobId}
          userRole={userRole}
          onBackToJobs={() => (window.location.hash = '#/jobs')}
        />
      )}

      {activeNav === 'artisans' && <ArtisansView />}

      {activeNav === 'disputes' && !selectedDispute && (
        <DisputeDashboard
          disputes={mockDisputes}
          onSelect={(d) => setDisputeDetailId(d.id)}
          onBack={() => setDisputeDetailId(null)}
        />
      )}


      {activeNav === 'disputes' && selectedDispute && (
        <DisputeDetail
          dispute={selectedDispute}
          onBack={() => setDisputeDetailId(null)}
          onResolved={() => {
            // mock only
            setDisputeDetailId(null);
          }}
        />
      )}

      {activeNav === 'settlements' && (
        <div className="placeholder-page" aria-label="settlements page">
          <p className="eyebrow">settlements</p>
          <h1>Coming soon</h1>
        </div>
      )}

      {/* Quick demo role switch (hidden from production) */}
      <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 200, display: 'flex', gap: 8 }}>
        {(['Customer', 'Artisan', 'Mediator'] as JobRole[]).map((r) => (
          <button
            key={r}
            className="ghost-action"
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              borderColor: r === userRole ? 'var(--green)' : 'var(--line)',
            }}
            onClick={() => setUserRole(r)}
            aria-label={`Switch to ${r}`}
          >
            {r}
          </button>
        ))}
      </div>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

