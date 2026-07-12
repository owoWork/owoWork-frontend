import type { JobState, JobRole } from '../types/jobDetail';

export type EscrowStage =
    | 'OPEN'
    | 'ACTIVE'
    | 'DISPUTED'
    | 'COMPLETED'
    | 'REFUNDED';

export const JOB_STATE_TO_STAGE: Record<JobState, EscrowStage> = {
    Open: 'OPEN',
    Active: 'ACTIVE',
    Disputed: 'DISPUTED',
    Completed: 'COMPLETED',
    Refunded: 'REFUNDED',
};

export const STAGES: EscrowStage[] = ['OPEN', 'ACTIVE', 'DISPUTED', 'COMPLETED', 'REFUNDED'];

export type NextState = JobState;

export function nextJobStates(state: JobState): NextState[] {
    switch (state) {
        case 'Open':
            return ['Active'];
        case 'Active':
            return ['Completed', 'Disputed'];
        case 'Disputed':
            return ['Completed', 'Refunded'];
        case 'Completed':
            return [];
        case 'Refunded':
            return [];
        default:
            return [];
    }
}

export type JobAction =
    | 'confirm_completion'
    | 'raise_dispute'
    | 'accept_job'
    | 'resolve_dispute';

export function isActionAllowed(args: {
    role: JobRole;
    state: JobState;
    action: JobAction;
}): boolean {
    const { role, state, action } = args;

    switch (action) {
        case 'accept_job':
            return role === 'Artisan' && state === 'Open';
        case 'confirm_completion':
            return role === 'Customer' && state === 'Active';
        case 'raise_dispute':
            return role === 'Customer' && state === 'Active';
        case 'resolve_dispute':
            return role === 'Mediator' && state === 'Disputed';
        default:
            return false;
    }
}

