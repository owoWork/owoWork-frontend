import React from 'react';
import type { JobDetailModel, JobState } from '../types/jobDetail';

const statePillClass: Record<JobState, string> = {
  Open: 'state-pill state-open',
  Active: 'state-pill state-active',
  Disputed: 'state-pill state-disputed',
  Completed: 'state-pill state-completed',
  Refunded: 'state-pill state-refunded',
};

function formatXlm(v: number) {
  return `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })} XLM`;
}

function formatDate(isoStr: string) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoStr;
  }
}

export interface JobCardProps {
  job: JobDetailModel;
  onClick?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(job.id);
    } else {
      window.location.hash = `#/jobs/${job.id}`;
    }
  };

  return (
    <article
      role="listitem"
      className="job-row"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      aria-label={`Open job ${job.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="job-token" aria-hidden="true">
        {job.trade.slice(0, 2).toUpperCase()}
      </div>

      <div className="job-main">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 900 }}>{job.id}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
              Created: {formatDate(job.createdAt)}
            </span>
          </div>
          <p style={{ color: 'var(--muted)', fontWeight: 700, margin: '2px 0 6px' }}>
            Customer: <strong style={{ color: 'var(--ink)' }}>{job.customer}</strong> · Artisan: <strong style={{ color: 'var(--ink)' }}>{job.artisan}</strong>
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineClamp: 1, WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </p>
        </div>
        <span className={statePillClass[job.status]}>{job.status}</span>
      </div>

      <div className="job-meta">
        <strong className="profile-job-amount">{formatXlm(job.amount)}</strong>
        <span className="job-trade-tag" style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 12, marginTop: 4 }}>
          {job.trade}
        </span>
      </div>
    </article>
  );
};
