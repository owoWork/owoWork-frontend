import React from 'react';

type JobState = "Open" | "Active" | "Disputed" | "Completed" | "Refunded";

export interface Job {
  id: string;
  customer: string;
  artisan: string;
  trade: string;
  state: JobState;
  amount: number;
  started: string;
  location: string;
  hash: string;
}

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

interface JobRowProps {
  job: Job;
}

export const JobRow: React.FC<JobRowProps> = ({ job }) => {
  return (
    <article className="job-row" data-testid={`job-row-${job.id}`}>
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
        <span 
          className={`state-pill ${stateMeta[job.state].className}`}
          role="status"
          aria-label={`Job status: ${stateMeta[job.state].label}`}
        >
          {stateMeta[job.state].label}
        </span>
      </div>
    </article>
  );
};
