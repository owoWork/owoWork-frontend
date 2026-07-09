import React, { useState } from 'react';
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  XCircle,
  Gavel,
  ArrowLeft,
  Star,
  Sparkles,
  KeySquare,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Artisan, DisputeOutcome } from '../data/mockArtisanData';
import { StarRating } from './StarRating';

interface ArtisanProfileProps {
  artisan: Artisan;
  onBack: () => void;
  onHire: (artisanId: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

const disputeOutcomeClass: Record<DisputeOutcome, string> = {
  'Resolved – Artisan': 'outcome-artisan',
  'Resolved – Customer': 'outcome-customer',
  'Settled': 'outcome-settled',
  'Pending': 'outcome-pending'
};

type Tab = 'jobs' | 'disputes';

export const ArtisanProfile: React.FC<ArtisanProfileProps> = ({ artisan, onBack, onHire }) => {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');

  const successRate = artisan.totalJobs > 0
    ? Math.round((artisan.completedJobs / artisan.totalJobs) * 100)
    : 0;

  const disputeRate = artisan.totalJobs > 0
    ? ((artisan.disputes.length / artisan.totalJobs) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="profile-page">
      {/* Back nav */}
      <button className="profile-back ghost-action" onClick={onBack} aria-label="Back to artisans list">
        <ArrowLeft size={16} />
        All artisans
      </button>

      <div className="profile-layout">
        {/* ── Left column: identity card ─────────────────────────── */}
        <aside className="profile-sidebar">
          <div className="profile-id-card">
            <div
              className="profile-avatar"
              style={{ background: artisan.avatarColor }}
              aria-hidden="true"
            >
              {artisan.avatarInitials}
            </div>

            <div className="profile-name-row">
              <h2 className="profile-name">{artisan.name}</h2>
              {artisan.isVerified && (
                <span className="verified-badge" aria-label="Verified artisan">
                  <BadgeCheck size={14} />
                  Verified
                </span>
              )}
            </div>

            <p className="profile-bio">{artisan.bio}</p>

            <ul className="profile-meta-list">
              <li>
                <MapPin size={15} />
                <span>{artisan.location}</span>
              </li>
              <li>
                <Calendar size={15} />
                <span>Joined {formatDate(artisan.joinDate)}</span>
              </li>
              <li className="profile-pubkey">
                <KeySquare size={15} />
                <code>{artisan.publicKey}</code>
              </li>
            </ul>

            <div className="profile-trades">
              <p className="profile-trades-label">Specializations</p>
              <div className="profile-trade-tags">
                {artisan.specializations.map((spec) => (
                  <span key={spec} className="trade-tag trade-tag-lg">{spec}</span>
                ))}
              </div>
            </div>

            <button
              className="primary-action profile-hire-btn"
              onClick={() => onHire(artisan.id)}
              aria-label={`Hire ${artisan.name}`}
            >
              <Sparkles size={17} />
              Hire this artisan
            </button>
          </div>
        </aside>

        {/* ── Right column: reputation & history ─────────────────── */}
        <div className="profile-main">
          {/* Reputation metrics */}
          <section className="rep-metrics-grid" aria-label="Reputation metrics">
            <article className="rep-metric-card rep-metric-loud">
              <span className="rep-metric-icon">
                <Star size={20} />
              </span>
              <p>Average rating</p>
              <strong>{artisan.averageRating.toFixed(1)}</strong>
              <StarRating rating={artisan.averageRating} size={16} className="rep-stars" />
            </article>

            <article className="rep-metric-card">
              <span className="rep-metric-icon">
                <TrendingUp size={20} />
              </span>
              <p>Success rate</p>
              <strong>{successRate}%</strong>
              <div className="rep-progress-bar" role="progressbar" aria-valuenow={successRate} aria-valuemin={0} aria-valuemax={100}>
                <div className="rep-progress-fill" style={{ width: `${successRate}%` }} />
              </div>
            </article>

            <article className="rep-metric-card">
              <span className="rep-metric-icon">
                <Briefcase size={20} />
              </span>
              <p>Total jobs</p>
              <strong>{artisan.totalJobs}</strong>
              <small>{artisan.completedJobs} completed · {artisan.cancelledJobs} cancelled</small>
            </article>

            <article className="rep-metric-card">
              <span className="rep-metric-icon warn">
                <Gavel size={20} />
              </span>
              <p>Disputes</p>
              <strong>{artisan.disputes.length}</strong>
              <small>{disputeRate}% of total jobs</small>
            </article>
          </section>

          {/* Tab bar */}
          <div className="profile-tabs" role="tablist" aria-label="Profile sections">
            <button
              role="tab"
              aria-selected={activeTab === 'jobs'}
              className={`profile-tab ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <CheckCircle2 size={16} />
              Completed jobs
              <span className="tab-count">{artisan.completedJobsList.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'disputes'}
              className={`profile-tab ${activeTab === 'disputes' ? 'active' : ''}`}
              onClick={() => setActiveTab('disputes')}
            >
              <XCircle size={16} />
              Dispute history
              <span className={`tab-count ${artisan.disputes.length > 0 ? 'tab-count-warn' : ''}`}>
                {artisan.disputes.length}
              </span>
            </button>
          </div>

          {/* Completed jobs tab */}
          {activeTab === 'jobs' && (
            <section aria-label="Completed jobs list">
              {artisan.completedJobsList.length === 0 ? (
                <div className="profile-empty-state">
                  <Briefcase size={40} />
                  <p>No completed jobs yet.</p>
                </div>
              ) : (
                <div className="profile-job-list">
                  {artisan.completedJobsList.map((job) => (
                    <article key={job.id} className="profile-job-row">
                      <div className="profile-job-token" aria-hidden="true">
                        {job.trade.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="profile-job-info">
                        <div className="profile-job-top">
                          <span className="profile-job-id">{job.id}</span>
                          <span className="profile-job-trade trade-tag">{job.trade}</span>
                        </div>
                        <p className="profile-job-customer">
                          Customer: <strong>{job.customer}</strong>
                        </p>
                        {job.reviewNote && (
                          <p className="profile-job-review">
                            <MessageSquare size={12} />
                            "{job.reviewNote}"
                          </p>
                        )}
                      </div>
                      <div className="profile-job-right">
                        <StarRating rating={job.rating} size={14} />
                        <span className="profile-job-amount">{formatCurrency(job.amount)}</span>
                        <time className="profile-job-date" dateTime={job.completedDate}>
                          {formatDate(job.completedDate)}
                        </time>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Dispute history tab */}
          {activeTab === 'disputes' && (
            <section aria-label="Dispute history">
              {artisan.disputes.length === 0 ? (
                <div className="profile-empty-state profile-empty-good">
                  <CheckCircle2 size={40} />
                  <p>No disputes on record. Clean track record!</p>
                </div>
              ) : (
                <div className="profile-dispute-list">
                  {artisan.disputes.map((dispute) => (
                    <article key={dispute.id} className="profile-dispute-row">
                      <div className="profile-dispute-header">
                        <span className="profile-dispute-id">{dispute.id}</span>
                        <span className={`dispute-outcome-pill ${disputeOutcomeClass[dispute.outcome]}`}>
                          {dispute.outcome}
                        </span>
                      </div>
                      <p className="profile-dispute-job">
                        Job <strong>{dispute.jobId}</strong> · Customer: <strong>{dispute.customer}</strong>
                      </p>
                      <p className="profile-dispute-summary">{dispute.summary}</p>
                      <time className="profile-dispute-date" dateTime={dispute.date}>
                        {formatDate(dispute.date)}
                      </time>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfile;
