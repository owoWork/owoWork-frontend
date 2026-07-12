import React, { useMemo, useState } from 'react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Copy,
    DollarSign,
    Gavel,
    MapPin,
    ShieldCheck,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import { getMockJobById } from '../data/mockJobs';
import type { JobDetailModel, JobRole } from '../types/jobDetail';
import { isActionAllowed, nextJobStates, STAGES, JOB_STATE_TO_STAGE, type EscrowStage, type JobAction } from '../utils/jobStateMachine';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatXlm(v: number): string {
    return `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })} XLM`;
}

async function copyText(text: string) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
}

function statusPillClass(status: JobDetailModel['status']): string {
    const m: Record<JobDetailModel['status'], string> = {
        Open: 'state-pill state-open',
        Active: 'state-pill state-active',
        Disputed: 'state-pill state-disputed',
        Completed: 'state-pill state-completed',
        Refunded: 'state-pill state-refunded',
    };
    return m[status];
}

function stageLabel(stage: EscrowStage): string {
    switch (stage) {
        case 'OPEN':
            return 'Open';
        case 'ACTIVE':
            return 'Active';
        case 'DISPUTED':
            return 'Disputed';
        case 'COMPLETED':
            return 'Completed';
        case 'REFUNDED':
            return 'Refunded';
    }
}

export const JobDetail: React.FC<{ jobId: string; userRole: JobRole; onBackToJobs?: () => void }> = ({
    jobId,
    userRole,
    onBackToJobs,
}) => {
    const [submittingAction, setSubmittingAction] = useState<JobAction | null>(null);

    const job: JobDetailModel | null = useMemo(() => getMockJobById(jobId), [jobId]);

    const [optimisticStatus, setOptimisticStatus] = useState<JobDetailModel['status'] | null>(null);
    const status = optimisticStatus ?? job?.status;

    const handleAction = async (action: JobAction) => {
        if (!job) return;
        setSubmittingAction(action);

        // simulate contract call
        await new Promise((r) => setTimeout(r, 900));

        // optimistic state update
        const allowedNext = nextJobStates(status!);
        let next: JobDetailModel['status'] | null = null;
        if (action === 'accept_job') next = 'Active';
        if (action === 'confirm_completion') next = 'Completed';
        if (action === 'raise_dispute') next = 'Disputed';
        if (action === 'resolve_dispute') next = allowedNext.includes('Refunded') ? 'Completed' : allowedNext[0];

        setOptimisticStatus(next);
        setSubmittingAction(null);
    };

    const actionState = {
        accept_job: isActionAllowed({ role: userRole, state: status ?? 'Open', action: 'accept_job' }),
        confirm_completion: isActionAllowed({ role: userRole, state: status ?? 'Open', action: 'confirm_completion' }),
        raise_dispute: isActionAllowed({ role: userRole, state: status ?? 'Open', action: 'raise_dispute' }),
        resolve_dispute: isActionAllowed({ role: userRole, state: status ?? 'Open', action: 'resolve_dispute' }),
    };

    if (!job || !status) {
        return (
            <div className="job-detail">
                <header className="detail-header">
                    <button className="ghost-action back-button" onClick={onBackToJobs} aria-label="Back to jobs">
                        <ArrowLeft size={18} />
                        Back to jobs
                    </button>
                    <h2 className="detail-title">Job not found</h2>
                </header>
            </div>
        );
    }

    const escrowStage = JOB_STATE_TO_STAGE[status];
    const nextStates = nextJobStates(status);
    const nextStages = new Set(nextStates.map((s) => JOB_STATE_TO_STAGE[s]));

    const contractJobId = job.contractRefs?.jobId ?? job.id;
    const contractHash = job.contractRefs?.hash;
    const escrowRef = job.escrowContractRef;

    const possibleActions: Array<{ key: JobAction; label: string; icon: React.ReactNode; allowed: boolean }> = [
        {
            key: 'confirm_completion',
            label: 'Confirm Completion',
            icon: <CheckCircle2 size={18} />,
            allowed: actionState.confirm_completion,
        },
        {
            key: 'raise_dispute',
            label: 'Raise Dispute',
            icon: <AlertTriangle size={18} />,
            allowed: actionState.raise_dispute,
        },
        {
            key: 'accept_job',
            label: 'Accept Job',
            icon: <ShieldCheck size={18} />,
            allowed: actionState.accept_job,
        },
        {
            key: 'resolve_dispute',
            label: 'Resolve Dispute',
            icon: <Gavel size={18} />,
            allowed: actionState.resolve_dispute,
        },
    ];

    const disputeHistory = job.disputeHistory ?? [];

    return (
        <div className="job-detail">
            <header className="detail-header">
                <button className="ghost-action back-button" onClick={onBackToJobs} aria-label="Back to jobs">
                    <ArrowLeft size={18} />
                    Back to jobs
                </button>

                <div className="detail-title-row">
                    <div>
                        <p className="eyebrow">Job detail</p>
                        <h2 className="detail-title">
                            {job.id}{' '}
                            <span className={statusPillClass(status)} style={{ marginLeft: 10 }}>
                                {status}
                            </span>
                        </h2>
                    </div>
                </div>
            </header>

            <div className="detail-grid job-detail-grid">
                <div className="detail-main">
                    <section className="detail-card" aria-label="Job information">
                        <h3 className="card-title">
                            <Gavel size={16} /> Job information
                        </h3>

                        <dl className="job-details-grid">
                            <dt>
                                <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                                    ID
                                </span>
                            </dt>
                            <dd>
                                <div className="copy-row">
                                    <code>{contractJobId}</code>
                                    <button
                                        className="copy-btn"
                                        onClick={() => copyText(contractJobId)}
                                        aria-label="Copy job ID"
                                        disabled={submittingAction !== null}
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </dd>

                            <dt>Status</dt>
                            <dd>{status}</dd>

                            <dt>Description</dt>
                            <dd>{job.description}</dd>

                            <dt>
                                <DollarSign size={14} /> Amount
                            </dt>
                            <dd>{formatXlm(job.amount)}</dd>

                            <dt>Artisan</dt>
                            <dd>{job.artisan}</dd>

                            <dt>Customer</dt>
                            <dd>{job.customer}</dd>

                            <dt>Trade</dt>
                            <dd>{job.trade}</dd>

                            <dt>
                                <Calendar size={14} /> Created
                            </dt>
                            <dd>{formatDate(job.createdAt)}</dd>

                            <dt>
                                <Calendar size={14} /> Updated
                            </dt>
                            <dd>{formatDate(job.updatedAt)}</dd>
                        </dl>

                        {(contractHash || escrowRef) && (
                            <div className="contract-ref-block" aria-label="Contract references">
                                <h4 className="contract-ref-title">Contract references</h4>
                                <div className="contract-ref-grid">
                                    {contractHash && (
                                        <div className="copy-row">
                                            <span className="contract-ref-label">Hash</span>
                                            <code>{contractHash}</code>
                                            <button
                                                className="copy-btn"
                                                onClick={() => copyText(contractHash)}
                                                aria-label="Copy contract hash"
                                                disabled={submittingAction !== null}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    )}
                                    {escrowRef && (
                                        <div className="copy-row">
                                            <span className="contract-ref-label">Escrow</span>
                                            <code>{escrowRef}</code>
                                            <button
                                                className="copy-btn"
                                                onClick={() => copyText(escrowRef)}
                                                aria-label="Copy escrow contract reference"
                                                disabled={submittingAction !== null}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="detail-card" aria-label="Escrow state">
                        <h3 className="card-title">Escrow lifecycle</h3>

                        <div className="escrow-map" role="list" aria-label="Escrow stages">
                            {STAGES.map((stage) => {
                                const isCurrent = stage === escrowStage;
                                const isNext = nextStages.has(stage);

                                return (
                                    <div
                                        key={stage}
                                        role="listitem"
                                        className={`escrow-node escrow-node--${stage.toLowerCase()} ${isCurrent ? 'escrow-node--current' : ''} ${isNext ? 'escrow-node--next' : ''}`}
                                        aria-label={`${stageLabel(stage)}${isCurrent ? ', current stage' : isNext ? ', next stage' : ''}`}
                                    >
                                        <span className="escrow-node__label">{stageLabel(stage)}</span>
                                        {isCurrent && <span className="escrow-node__badge">Current</span>}
                                        {isNext && !isCurrent && <span className="escrow-node__badge escrow-node__badge--next">Next</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <p className="escrow-hint">
                            Available transitions from <strong>{status}</strong>:
                            {nextStates.length === 0 ? ' — none' : ` ${nextStates.join(', ')}`}
                        </p>
                    </section>

                    {(disputeHistory?.length ?? 0) > 0 && (
                        <section className="detail-card" aria-label="Dispute history">
                            <h3 className="card-title">
                                <AlertTriangle size={16} /> Dispute history
                            </h3>

                            <ol className="dispute-timeline" aria-label="Dispute timeline">
                                {disputeHistory.map((d) => (
                                    <li key={d.id} className="timeline-item">
                                        <span className="timeline-dot" aria-hidden="true">
                                            <Gavel size={14} />
                                        </span>
                                        <div>
                                            <p className="timeline-label">
                                                Dispute {d.id} · {d.reason}
                                            </p>
                                            <time className="timeline-time">{formatDate(d.raisedAt)}</time>
                                            {d.resolvedAt && (
                                                <p className="timeline-meta">
                                                    Resolved: <strong>{d.resolvedOutcome ?? '—'}</strong> at {formatDate(d.resolvedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>

                <aside className="detail-sidebar">
                    <section className="detail-card" aria-label="Available actions">
                        <h3 className="card-title">Actions</h3>

                        <div className="resolution-buttons">
                            {possibleActions.filter((a) => a.allowed).length === 0 ? (
                                <p className="resolution-hint">No actions available for your role in this job state.</p>
                            ) : (
                                possibleActions
                                    .filter((a) => a.allowed)
                                    .map((a) => (
                                        <button
                                            key={a.key}
                                            className="primary-action"
                                            onClick={() => handleAction(a.key)}
                                            disabled={submittingAction !== null}
                                            aria-label={a.label}
                                        >
                                            {a.icon}
                                            {submittingAction === a.key ? 'Working…' : a.label}
                                        </button>
                                    ))
                            )}
                        </div>

                        <div className="role-hint" aria-label="Role hint">
                            <span className="role-hint-pill">{userRole}</span>
                            <span className="role-hint-text">Buttons render only when valid.</span>
                        </div>
                    </section>

                    <section className="detail-card" aria-label="Next steps">
                        <h3 className="card-title">Next states</h3>
                        {nextStates.length === 0 ? (
                            <p className="resolution-hint">This job is terminal.</p>
                        ) : (
                            <ul className="next-state-list">
                                {nextStates.map((s) => (
                                    <li key={s} className="next-state-item">
                                        <span className={statusPillClass(s)}>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
};

