import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`skeleton ${className}`}></div>;
};

export const MetricPanelSkeleton: React.FC = () => {
  return (
    <article className="metric-panel">
      <Skeleton className="skeleton-icon" />
      <Skeleton className="skeleton-text skeleton-text-short" />
      <Skeleton className="skeleton-text skeleton-text-large" />
      <Skeleton className="skeleton-text skeleton-text-long" />
    </article>
  );
};

export const JobRowSkeleton: React.FC = () => {
  return (
    <article className="job-row">
      <div className="job-token skeleton"></div>
      <div className="job-main">
        <div>
          <Skeleton className="skeleton-text skeleton-text-short" />
          <Skeleton className="skeleton-text skeleton-text-long" />
        </div>
        <Skeleton className="skeleton-text skeleton-text-short" />
      </div>
      <div className="job-meta">
        <Skeleton className="skeleton-text skeleton-text-short" />
        <Skeleton className="skeleton-pill" />
      </div>
    </article>
  );
};
