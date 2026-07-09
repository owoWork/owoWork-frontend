import React from "react";
import {
  ShieldCheck,
  Hammer,
  AlertTriangle,
  CheckSquare,
  TrendingUp,
  RefreshCw,
  Clock,
  Activity,
} from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import { MetricCard } from "./MetricCard";
import { HealthBadge } from "./HealthBadge";
import { ActivityFeed } from "./ActivityFeed";
import {
  JobsByStatusChart,
  CompletionTrendChart,
  ArtisanEarningsChart,
} from "./Charts";
import { MetricPanelSkeleton } from "../Skeleton";

function formatXLM(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M XLM`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K XLM`;
  return `${val.toLocaleString("en-US", { maximumFractionDigits: 1 })} XLM`;
}

export const Dashboard: React.FC = () => {
  const { metrics, loading, error, lastUpdated, refresh, countdown } = useDashboard();

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="dashboard__header">
        <div className="dashboard__title-block">
          <p className="eyebrow">Escrow desk</p>
          <h1>OwoWork settlement board</h1>
        </div>

        <div className="dashboard__controls">
          {metrics && (
            <HealthBadge status={metrics.healthStatus} />
          )}

          <div className="refresh-strip">
            <span className="refresh-strip__countdown" aria-live="polite" aria-label={`Auto-refresh in ${countdown} seconds`}>
              <Clock size={13} aria-hidden="true" />
              {countdown}s
            </span>
            <button
              className="ghost-action refresh-strip__btn"
              onClick={refresh}
              disabled={loading}
              aria-label="Refresh dashboard now"
            >
              <RefreshCw size={16} className={loading && metrics ? "loading-spinner" : ""} aria-hidden="true" />
              Refresh
            </button>
          </div>

          {lastUpdated && (
            <time
              className="dashboard__last-updated"
              dateTime={lastUpdated.toISOString()}
              aria-label={`Last updated at ${lastUpdated.toLocaleTimeString()}`}
            >
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </time>
          )}
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────── */}
      {error && (
        <div className="dashboard__error-banner" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          {error}
          <button className="ghost-action" onClick={refresh}>
            Retry
          </button>
        </div>
      )}

      {/* ── Metric cards ───────────────────────────────────────────────── */}
      <section className="dashboard__metrics" aria-label="Key marketplace metrics">
        {loading && !metrics ? (
          <>
            <MetricPanelSkeleton />
            <MetricPanelSkeleton />
            <MetricPanelSkeleton />
            <MetricPanelSkeleton />
          </>
        ) : metrics ? (
          <>
            <MetricCard
              icon={<ShieldCheck size={22} />}
              label="Total Escrow Volume"
              value={formatXLM(metrics.totalEscrowVolume)}
              subtext="Total XLM currently locked in escrow"
              variant="accent"
            />
            <MetricCard
              icon={<Hammer size={22} />}
              label="Active Jobs"
              value={metrics.activeJobsCount}
              subtext="Accepted and in progress"
              variant="default"
            />
            <MetricCard
              icon={<CheckSquare size={22} />}
              label="Completed Today"
              value={metrics.completedToday}
              subtext={`${metrics.completionRate}% completion rate`}
              variant="default"
            />
            <MetricCard
              icon={<AlertTriangle size={22} />}
              label="Dispute Rate"
              value={`${metrics.disputeRate}%`}
              subtext="48 hour resolution window"
              variant={
                metrics.disputeRate > 20
                  ? "danger"
                  : metrics.disputeRate > 10
                  ? "warn"
                  : "default"
              }
            />
          </>
        ) : null}
      </section>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <section className="dashboard__charts" aria-label="Marketplace analytics">
        <article className="chart-panel">
          <div className="chart-panel__heading">
            <Activity size={18} aria-hidden="true" />
            <h2>Jobs by status</h2>
          </div>
          {loading && !metrics ? (
            <div className="chart-skeleton skeleton" aria-hidden="true" />
          ) : metrics ? (
            <JobsByStatusChart data={metrics.jobsByStatus} />
          ) : null}
        </article>

        <article className="chart-panel">
          <div className="chart-panel__heading">
            <TrendingUp size={18} aria-hidden="true" />
            <h2>Completion rate (7 days)</h2>
          </div>
          {loading && !metrics ? (
            <div className="chart-skeleton skeleton" aria-hidden="true" />
          ) : metrics ? (
            <CompletionTrendChart data={metrics.completionTrend} />
          ) : null}
        </article>

        <article className="chart-panel">
          <div className="chart-panel__heading">
            <ShieldCheck size={18} aria-hidden="true" />
            <h2>Artisan earnings by trade (XLM)</h2>
          </div>
          {loading && !metrics ? (
            <div className="chart-skeleton skeleton" aria-hidden="true" />
          ) : metrics ? (
            <ArtisanEarningsChart data={metrics.artisanEarnings} />
          ) : null}
        </article>
      </section>

      {/* ── Recent Activity ─────────────────────────────────────────────── */}
      <section className="dashboard__activity" aria-label="Recent job activity">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live feed</p>
            <h2>Recent state changes</h2>
          </div>
          <p className="dashboard__activity-sub">Last 5 escrow transitions</p>
        </div>
        <ActivityFeed
          events={metrics?.recentActivity ?? []}
          loading={loading && !metrics}
        />
      </section>
    </div>
  );
};
