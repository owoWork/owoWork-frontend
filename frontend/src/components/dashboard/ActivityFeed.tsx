import React from "react";
import { ArrowRight } from "lucide-react";
import { ActivityEvent, JobState } from "../../data/mockDashboard";

const statePillClass: Record<JobState, string> = {
  Open: "state-pill state-open",
  Active: "state-pill state-active",
  Disputed: "state-pill state-disputed",
  Completed: "state-pill state-completed",
  Refunded: "state-pill state-refunded",
};

type Props = {
  events: ActivityEvent[];
  loading?: boolean;
};

function formatXLM(val: number): string {
  return `${val.toLocaleString("en-US", { maximumFractionDigits: 1 })} XLM`;
}

export const ActivityFeed: React.FC<Props> = ({ events, loading }) => {
  if (loading) {
    return (
      <div className="activity-feed" aria-busy="true" aria-label="Recent activity loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="activity-row activity-row--skeleton">
            <div className="skeleton skeleton-text skeleton-text-short" />
            <div className="skeleton skeleton-text skeleton-text-long" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="activity-feed activity-feed--empty" aria-label="No recent activity">
        <p className="empty-state__text">No state changes yet — jobs will appear here as they move through escrow.</p>
      </div>
    );
  }

  return (
    <ol className="activity-feed" aria-label="Recent job state changes">
      {events.map((ev) => (
        <li key={ev.id} className="activity-row">
          <div className="activity-row__trade">
            <span className="job-token job-token--sm">{ev.trade.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="activity-row__body">
            <span className="activity-row__job-id">{ev.jobId}</span>
            <span className="activity-row__artisan">{ev.artisan} · {ev.trade}</span>
          </div>
          <div className="activity-row__transition" aria-label={`${ev.from ?? "new"} to ${ev.to}`}>
            {ev.from && (
              <>
                <span className={statePillClass[ev.from]}>{ev.from}</span>
                <ArrowRight size={14} className="activity-row__arrow" aria-hidden="true" />
              </>
            )}
            <span className={statePillClass[ev.to]}>{ev.to}</span>
          </div>
          <div className="activity-row__meta">
            <strong>{formatXLM(ev.amount)}</strong>
            <time className="activity-row__time" dateTime={new Date(ev.timestamp).toISOString()}>
              {ev.time}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
};
