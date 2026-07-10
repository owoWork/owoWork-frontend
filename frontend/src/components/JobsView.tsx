import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, Search } from 'lucide-react';
import { mockJobsById } from '../data/mockJobs';
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

function setHashJob(jobId: string) {
    window.location.hash = `#/jobs/${jobId}`;
}

export const JobsView: React.FC = () => {
    const [q, setQ] = useState('');

    const jobs: JobDetailModel[] = useMemo(() => Object.values(mockJobsById), []);

    const filtered = jobs.filter((j) => {
        const hay = `${j.id} ${j.customer} ${j.artisan} ${j.trade} ${j.description}`.toLowerCase();
        return hay.includes(q.trim().toLowerCase());
    });

    return (
        <div className="job-list-page">
            <header className="artisans-header">
                <div>
                    <p className="eyebrow">Escrow jobs</p>
                    <h1>Jobs</h1>
                </div>
            </header>

            <div className="artisans-filters" role="search" aria-label="Search jobs">
                <div className="artisans-search-wrap">
                    <Search size={16} className="artisans-search-icon" aria-hidden="true" />
                    <input
                        className="artisans-search"
                        type="search"
                        placeholder="Search jobs by ID, customer, artisan, trade…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        aria-label="Search jobs"
                    />
                </div>
            </div>

            <div className="job-list" role="list" aria-label="Jobs list">
                {filtered.map((job) => (
                    <article
                        role="listitem"
                        key={job.id}
                        className="job-row"
                        onClick={() => setHashJob(job.id)}
                        style={{ cursor: 'pointer' }}
                        aria-label={`Open job ${job.id}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setHashJob(job.id);
                        }}
                    >
                        <div className="job-token" aria-hidden="true">
                            {job.trade.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="job-main">
                            <div>
                                <p style={{ fontWeight: 900, marginBottom: 6 }}>{job.id}</p>
                                <p style={{ color: 'var(--muted)', fontWeight: 700 }}>
                                    {job.customer} · {job.artisan}
                                </p>
                            </div>
                            <span className={statePillClass[job.status]}>{job.status}</span>
                        </div>
                        <div className="job-meta">
                            <strong className="profile-job-amount">{formatXlm(job.amount)}</strong>
                            <p style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 12, marginTop: 4 }}>
                                {job.trade}
                            </p>
                            <BriefcaseBusiness size={16} style={{ display: 'none' }} />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

