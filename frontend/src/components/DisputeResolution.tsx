import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Gavel,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  User,
  Wrench,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { useToast } from './ToastContext';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ResolutionOutcome = 'favor_artisan' | 'refund_customer';

export interface DisputePartyMessage {
  id: string;
  author: 'customer' | 'artisan';
  authorName: string;
  text: string;
  timestamp: string;
  evidence?: string[];
}

export interface DisputeAuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  jobId: string;
  trade: string;
  customer: string;
  artisan: string;
  amount: number;
  location: string;
  jobStarted: string;
  disputeRaisedAt: string;
  disputeReason: string;
  resolutionDeadline: string;
  status: 'pending' | 'resolved';
  resolution?: ResolutionOutcome;
  resolvedBy?: string;
  resolvedAt?: string;
  mediatorNotes?: string;
  messages: DisputePartyMessage[];
  auditLog: DisputeAuditEntry[];
  hash: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = new Date();
const in30h = new Date(now.getTime() + 30 * 60 * 60 * 1000).toISOString();
const in5h  = new Date(now.getTime() +  5 * 60 * 60 * 1000).toISOString();
const ago2h = new Date(now.getTime() -  2 * 60 * 60 * 1000).toISOString();
const ago18h = new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString();

export const mockDisputes: Dispute[] = [
  {
    id: 'DSP-001',
    jobId: 'OWO-1043',
    trade: 'Electrical',
    customer: 'Timi R.',
    artisan: 'Efe A.',
    amount: 410,
    location: 'Surulere',
    jobStarted: '2026-07-08T11:45:00Z',
    disputeRaisedAt: ago18h,
    disputeReason: 'Work left incomplete — only 2 of 5 outlets were replaced. Artisan left site without finishing.',
    resolutionDeadline: in30h,
    status: 'pending',
    hash: '91dc08',
    messages: [
      {
        id: 'm1',
        author: 'customer',
        authorName: 'Timi R.',
        text: 'Efe only fixed 2 outlets and claimed the job was done. I have photos showing the other 3 are still broken.',
        timestamp: ago18h,
        evidence: ['outlet_photo_1.jpg', 'outlet_photo_2.jpg'],
      },
      {
        id: 'm2',
        author: 'artisan',
        authorName: 'Efe A.',
        text: 'The original scope was for 2 outlets. The customer requested extra work on-site without updating the job. I completed what was agreed.',
        timestamp: ago2h,
        evidence: ['original_quote.pdf'],
      },
    ],
    auditLog: [
      { id: 'a1', action: 'Dispute raised by customer', actor: 'Timi R.', timestamp: ago18h },
      { id: 'a2', action: 'Dispute assigned to mediator', actor: 'System', timestamp: ago18h },
    ],
  },
  {
    id: 'DSP-002',
    jobId: 'OWO-1051',
    trade: 'Plumbing',
    customer: 'Ada N.',
    artisan: 'Musa K.',
    amount: 290,
    location: 'Yaba',
    jobStarted: '2026-07-09T09:00:00Z',
    disputeRaisedAt: ago2h,
    disputeReason: 'Pipe repaired but started leaking again within 4 hours of completion.',
    resolutionDeadline: in5h,
    status: 'pending',
    hash: 'b33f90',
    messages: [
      {
        id: 'm3',
        author: 'customer',
        authorName: 'Ada N.',
        text: 'The leak came back almost immediately. This was a botched repair — I had to call a different plumber.',
        timestamp: ago2h,
        evidence: ['leak_video.mp4'],
      },
      {
        id: 'm4',
        author: 'artisan',
        authorName: 'Musa K.',
        text: 'I replaced the section as agreed. If there is a new leak it is from a different pipe I was not hired to fix.',
        timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      },
    ],
    auditLog: [
      { id: 'a3', action: 'Dispute raised by customer', actor: 'Ada N.', timestamp: ago2h },
      { id: 'a4', action: 'Dispute assigned to mediator', actor: 'System', timestamp: ago2h },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────

interface CountdownProps {
  deadline: string;
}

function CountdownTimer({ deadline }: CountdownProps) {
  const calc = useCallback(() => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true, urgent: true };
    const hours   = Math.floor(diff / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1_000);
    return { hours, minutes, seconds, expired: false, urgent: hours < 6 };
  }, [deadline]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000);
    return () => clearInterval(id);
  }, [calc]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (time.expired) {
    return (
      <div className="countdown expired" role="timer" aria-label="Resolution window expired">
        <Clock size={16} />
        <span>Window expired</span>
      </div>
    );
  }

  return (
    <div className={`countdown ${time.urgent ? 'urgent' : ''}`} role="timer" aria-label="Time remaining for resolution">
      <Clock size={16} />
      <span>
        {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)} remaining
      </span>
      {time.urgent && <span className="countdown-badge">Act now</span>}
    </div>
  );
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────

interface ConfirmModalProps {
  outcome: ResolutionOutcome;
  dispute: Dispute;
  mediatorNotes: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  submitting: boolean;
}

function ConfirmModal({ outcome, dispute, mediatorNotes, onConfirm, onCancel, submitting }: ConfirmModalProps) {
  const [reason, setReason] = useState('');

  const isFavorArtisan = outcome === 'favor_artisan';
  const label = isFavorArtisan ? 'Favour Artisan' : 'Refund Customer';
  const colorClass = isFavorArtisan ? 'confirm-artisan' : 'confirm-customer';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className={`modal-header ${colorClass}`}>
          {isFavorArtisan ? <ShieldCheck size={22} /> : <XCircle size={22} />}
          <h2 id="modal-title">{label}</h2>
        </div>

        <div className="modal-body">
          <p className="modal-summary">
            You are about to resolve <strong>{dispute.id}</strong> ({dispute.jobId}) by{' '}
            <strong>{isFavorArtisan ? 'releasing funds to the artisan' : 'refunding the customer'}</strong>.
            This action is permanent and will be recorded in the audit log.
          </p>

          <label className="field-label" htmlFor="modal-reason">
            Resolution reason <span className="required">*</span>
          </label>
          <textarea
            id="modal-reason"
            className="modal-textarea"
            placeholder="Provide a clear reason for this decision..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            disabled={submitting}
          />

          {mediatorNotes && (
            <div className="modal-notes-preview">
              <p className="field-label">Your notes (included)</p>
              <p className="modal-notes-text">{mediatorNotes}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="ghost-action" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button
            className={`primary-action ${colorClass}`}
            onClick={() => onConfirm(reason)}
            disabled={submitting || reason.trim().length < 10}
            aria-describedby={reason.trim().length < 10 ? 'reason-hint' : undefined}
          >
            {submitting ? 'Submitting…' : `Confirm — ${label}`}
          </button>
        </div>
        {reason.trim().length < 10 && reason.length > 0 && (
          <p id="reason-hint" className="field-hint">Reason must be at least 10 characters.</p>
        )}
      </div>
    </div>
  );
}

// ─── Evidence / Message thread ────────────────────────────────────────────────

interface MessageThreadProps {
  messages: DisputePartyMessage[];
}

function MessageThread({ messages }: MessageThreadProps) {
  return (
    <div className="message-thread" aria-label="Dispute messages and evidence">
      {messages.map((msg) => {
        const isCustomer = msg.author === 'customer';
        return (
          <div key={msg.id} className={`message-bubble ${isCustomer ? 'msg-customer' : 'msg-artisan'}`}>
            <div className="msg-avatar" aria-hidden="true">
              {isCustomer ? <User size={16} /> : <Wrench size={16} />}
            </div>
            <div className="msg-content">
              <div className="msg-header">
                <span className="msg-author">{msg.authorName}</span>
                <span className="msg-role">{isCustomer ? 'Customer' : 'Artisan'}</span>
                <time className="msg-time">{formatDate(msg.timestamp)}</time>
              </div>
              <p className="msg-text">{msg.text}</p>
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="msg-evidence">
                  <Paperclip size={13} />
                  <span>Evidence:</span>
                  {msg.evidence.map((file) => (
                    <span key={file} className="evidence-chip">{file}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Dispute Timeline ─────────────────────────────────────────────────────────

interface TimelineProps {
  dispute: Dispute;
}

function DisputeTimeline({ dispute }: TimelineProps) {
  const entries = [
    { label: 'Job started',       time: dispute.jobStarted,          icon: <Calendar size={14} /> },
    { label: 'Dispute raised',    time: dispute.disputeRaisedAt,      icon: <AlertTriangle size={14} /> },
    { label: 'Resolution window', time: dispute.resolutionDeadline,   icon: <Clock size={14} />, deadline: true },
  ];

  if (dispute.resolvedAt) {
    entries.push({ label: 'Resolved', time: dispute.resolvedAt, icon: <CheckCircle size={14} /> });
  }

  return (
    <ol className="dispute-timeline" aria-label="Dispute timeline">
      {entries.map((e, i) => (
        <li key={i} className={`timeline-item ${e.deadline ? 'timeline-deadline' : ''}`}>
          <span className="timeline-dot" aria-hidden="true">{e.icon}</span>
          <div>
            <p className="timeline-label">{e.label}</p>
            <time className="timeline-time">{formatDate(e.time)}</time>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

interface AuditLogProps {
  entries: DisputeAuditEntry[];
}

function AuditLog({ entries }: AuditLogProps) {
  return (
    <div className="audit-log" aria-label="Audit log">
      <div className="audit-heading">
        <FileText size={16} />
        <span>Audit log</span>
      </div>
      <ul className="audit-list">
        {entries.map((e) => (
          <li key={e.id} className="audit-entry">
            <span className="audit-action">{e.action}</span>
            <span className="audit-meta">
              {e.actor} · <time>{formatDate(e.timestamp)}</time>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Dispute Detail Page ──────────────────────────────────────────────────────

interface DisputeDetailProps {
  dispute: Dispute;
  onBack: () => void;
  onResolved: (updated: Dispute) => void;
}

export function DisputeDetail({ dispute: initial, onBack, onResolved }: DisputeDetailProps) {
  const { addToast } = useToast();
  const [dispute, setDispute] = useState<Dispute>(initial);
  const [mediatorNotes, setMediatorNotes] = useState(initial.mediatorNotes ?? '');
  const [pendingOutcome, setPendingOutcome] = useState<ResolutionOutcome | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isResolved = dispute.status === 'resolved';

  const handleResolve = async (reason: string) => {
    if (!pendingOutcome) return;
    setSubmitting(true);

    // Simulate API call
    await new Promise<void>((res) => setTimeout(res, 1_500));

    const resolvedAt = new Date().toISOString();
    const newEntry: DisputeAuditEntry = {
      id: `a${Date.now()}`,
      action: `Resolved: ${pendingOutcome === 'favor_artisan' ? 'Favour Artisan' : 'Refund Customer'} — "${reason}"`,
      actor: 'Mediator (you)',
      timestamp: resolvedAt,
    };

    const updated: Dispute = {
      ...dispute,
      status: 'resolved',
      resolution: pendingOutcome,
      resolvedBy: 'Mediator (you)',
      resolvedAt,
      mediatorNotes,
      auditLog: [...dispute.auditLog, newEntry],
    };

    setDispute(updated);
    setSubmitting(false);
    setPendingOutcome(null);
    onResolved(updated);

    addToast({
      type: 'success',
      message: `Dispute ${dispute.id} resolved — ${pendingOutcome === 'favor_artisan' ? 'artisan favoured' : 'customer refunded'}.`,
    });
  };

  return (
    <div className="dispute-detail">
      {/* Header */}
      <header className="detail-header">
        <button className="ghost-action back-button" onClick={onBack} aria-label="Back to disputes list">
          <ArrowLeft size={18} />
          Back to disputes
        </button>
        <div className="detail-title-row">
          <div>
            <p className="eyebrow">Dispute resolution</p>
            <h2 className="detail-title">{dispute.id} · {dispute.jobId}</h2>
          </div>
          {!isResolved && <CountdownTimer deadline={dispute.resolutionDeadline} />}
          {isResolved && (
            <div className="resolution-badge resolved">
              <CheckCircle size={16} />
              {dispute.resolution === 'favor_artisan' ? 'Artisan favoured' : 'Customer refunded'}
            </div>
          )}
        </div>
      </header>

      <div className="detail-grid">
        {/* Left column: job info + messages */}
        <div className="detail-main">
          {/* Job info card */}
          <section className="detail-card" aria-label="Job information">
            <h3 className="card-title"><Gavel size={16} /> Job details</h3>
            <dl className="job-details-grid">
              <dt><DollarSign size={14} /> Escrow amount</dt>
              <dd><strong>{formatCurrency(dispute.amount)}</strong></dd>
              <dt><User size={14} /> Customer</dt>
              <dd>{dispute.customer}</dd>
              <dt><Wrench size={14} /> Artisan</dt>
              <dd>{dispute.artisan}</dd>
              <dt><MapPin size={14} /> Location</dt>
              <dd>{dispute.location}</dd>
              <dt><Calendar size={14} /> Job started</dt>
              <dd>{formatDate(dispute.jobStarted)}</dd>
              <dt><FileText size={14} /> Trade</dt>
              <dd>{dispute.trade}</dd>
            </dl>
          </section>

          {/* Dispute reason */}
          <section className="detail-card reason-card" aria-label="Dispute reason">
            <h3 className="card-title"><AlertTriangle size={16} /> Dispute reason</h3>
            <p className="reason-text">{dispute.disputeReason}</p>
          </section>

          {/* Message thread */}
          <section className="detail-card" aria-label="Party messages">
            <h3 className="card-title"><MessageSquare size={16} /> Party arguments &amp; evidence</h3>
            <MessageThread messages={dispute.messages} />
          </section>

          {/* Mediator notes */}
          {!isResolved && (
            <section className="detail-card" aria-label="Mediator notes">
              <h3 className="card-title"><FileText size={16} /> Mediator notes</h3>
              <textarea
                className="notes-textarea"
                placeholder="Add internal notes before resolving (optional)..."
                value={mediatorNotes}
                onChange={(e) => setMediatorNotes(e.target.value)}
                rows={4}
                aria-label="Mediator notes"
              />
            </section>
          )}

          {/* Resolution buttons */}
          {!isResolved && (
            <section className="resolution-actions" aria-label="Resolution actions">
              <h3 className="card-title"><Gavel size={16} /> Make a decision</h3>
              <p className="resolution-hint">Review all evidence carefully before resolving. This action cannot be undone.</p>
              <div className="resolution-buttons">
                <button
                  className="primary-action resolution-btn artisan-btn"
                  onClick={() => setPendingOutcome('favor_artisan')}
                  aria-label="Favour artisan — release escrow funds to artisan"
                >
                  <ShieldCheck size={18} />
                  Favour Artisan
                </button>
                <button
                  className="primary-action resolution-btn customer-btn"
                  onClick={() => setPendingOutcome('refund_customer')}
                  aria-label="Refund customer — return escrow funds to customer"
                >
                  <XCircle size={18} />
                  Refund Customer
                </button>
              </div>
            </section>
          )}

          {isResolved && (
            <section className="resolved-summary" aria-label="Resolution summary">
              <CheckCircle size={20} />
              <div>
                <p><strong>Resolved by:</strong> {dispute.resolvedBy}</p>
                <p><strong>At:</strong> {dispute.resolvedAt ? formatDate(dispute.resolvedAt) : '—'}</p>
                {dispute.mediatorNotes && <p><strong>Notes:</strong> {dispute.mediatorNotes}</p>}
              </div>
            </section>
          )}
        </div>

        {/* Right column: timeline + audit */}
        <aside className="detail-sidebar">
          <section className="detail-card" aria-label="Timeline">
            <h3 className="card-title"><Clock size={16} /> Timeline</h3>
            <DisputeTimeline dispute={dispute} />
          </section>
          <section className="detail-card" aria-label="Audit log">
            <AuditLog entries={dispute.auditLog} />
          </section>
        </aside>
      </div>

      {/* Confirmation modal */}
      {pendingOutcome && (
        <ConfirmModal
          outcome={pendingOutcome}
          dispute={dispute}
          mediatorNotes={mediatorNotes}
          onConfirm={handleResolve}
          onCancel={() => setPendingOutcome(null)}
          submitting={submitting}
        />
      )}
    </div>
  );
}

// ─── Dispute Dashboard (list) ─────────────────────────────────────────────────

interface DisputeDashboardProps {
  disputes: Dispute[];
  onSelect: (dispute: Dispute) => void;
}

export function DisputeDashboard({ disputes, onSelect }: DisputeDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending');

  const filtered = filter === 'all' ? disputes : disputes.filter((d) => d.status === filter);
  const pendingCount  = disputes.filter((d) => d.status === 'pending').length;
  const resolvedCount = disputes.filter((d) => d.status === 'resolved').length;

  return (
    <div className="dispute-dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mediator desk</p>
          <h2>Dispute resolution</h2>
          <p style={{ color: 'var(--muted)', marginTop: '6px' }}>
            Review disputes and make binding resolutions within the 48-hour window.
          </p>
        </div>
      </header>

      {/* Stats row */}
      <div className="dispute-stats">
        <article className="stat-chip urgent">
          <AlertTriangle size={18} />
          <div>
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </div>
        </article>
        <article className="stat-chip done">
          <CheckCircle size={18} />
          <div>
            <strong>{resolvedCount}</strong>
            <span>Resolved</span>
          </div>
        </article>
        <article className="stat-chip neutral">
          <Gavel size={18} />
          <div>
            <strong>{disputes.length}</strong>
            <span>Total</span>
          </div>
        </article>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Filter disputes">
        {(['pending', 'resolved', 'all'] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pendingCount > 0 && (
              <span className="tab-badge">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Disputes list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <p>No {filter} disputes.</p>
        </div>
      ) : (
        <ul className="dispute-list" aria-label="Disputes">
          {filtered.map((d) => (
            <li key={d.id}>
              <button
                className="dispute-row"
                onClick={() => onSelect(d)}
                aria-label={`Open dispute ${d.id} — ${d.trade}, ${d.customer} vs ${d.artisan}`}
              >
                <div className="dispute-token" aria-hidden="true">
                  {d.trade.slice(0, 2).toUpperCase()}
                </div>
                <div className="dispute-info">
                  <div className="dispute-id-row">
                    <span className="dispute-id">{d.id}</span>
                    <span className="dispute-job-id">{d.jobId}</span>
                    <span className={`state-pill ${d.status === 'pending' ? 'state-disputed' : 'state-completed'}`}>
                      {d.status === 'pending' ? 'Pending' : 'Resolved'}
                    </span>
                  </div>
                  <p className="dispute-reason-preview">{d.disputeReason}</p>
                  <div className="dispute-parties">
                    <span><User size={12} /> {d.customer}</span>
                    <span>vs</span>
                    <span><Wrench size={12} /> {d.artisan}</span>
                    <span>·</span>
                    <span><MapPin size={12} /> {d.location}</span>
                  </div>
                </div>
                <div className="dispute-right">
                  <strong className="dispute-amount">{formatCurrency(d.amount)}</strong>
                  {d.status === 'pending' && (
                    <CountdownTimer deadline={d.resolutionDeadline} />
                  )}
                  {d.status === 'resolved' && d.resolution && (
                    <span className={`resolution-chip ${d.resolution === 'favor_artisan' ? 'chip-artisan' : 'chip-customer'}`}>
                      {d.resolution === 'favor_artisan' ? 'Artisan favoured' : 'Customer refunded'}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
