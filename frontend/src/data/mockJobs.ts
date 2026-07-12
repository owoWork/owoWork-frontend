import type { JobDetailModel, JobState } from '../types/jobDetail';

const now = new Date();
const iso = (d: Date) => d.toISOString();

function daysAgo(n: number) {
  return new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
}

function hoursAgo(n: number) {
  return new Date(now.getTime() - n * 60 * 60 * 1000);
}

function randHash() {
  const chars = 'abcdef0123456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const BASE: Omit<JobDetailModel, 'status'> = {
  id: 'OWO-1001',
  description: 'Fix burst pipe under the kitchen sink. Replace faulty valve and test for leaks.',
  amount: 420.5,
  artisan: 'Efe A.',
  customer: 'Timi R.',
  trade: 'Electrical',
  createdAt: iso(daysAgo(3)),
  updatedAt: iso(hoursAgo(2)),
  contractRefs: { jobId: 'OWO-1001', hash: randHash() },
  escrowContractRef: `ESCROW-${randHash()}`,
};

function makeJob(partial: Partial<JobDetailModel>): JobDetailModel {
  return {
    ...((BASE as unknown) as JobDetailModel),
    ...partial,
  };
}

export const mockJobsById: Record<string, JobDetailModel> = {
  'OWO-1001': makeJob({
    status: 'Open' as JobState,
    artisan: 'Efe A.',
    customer: 'Timi R.',
    trade: 'Plumbing',
    amount: 380,
    createdAt: iso(daysAgo(4)),
    updatedAt: iso(hoursAgo(4)),
    description: 'Replace leaking tap in the master bathroom and pressure test.',
  }),

  'OWO-1002': makeJob({
    status: 'Active' as JobState,
    artisan: 'Musa K.',
    customer: 'Ada N.',
    trade: 'Plumbing',
    amount: 290,
    createdAt: iso(daysAgo(2)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Repair leaking pipe in the living room and ensure no further drips.',
  }),

  'OWO-1003': makeJob({
    status: 'Disputed' as JobState,
    artisan: 'Efe A.',
    customer: 'Timi R.',
    trade: 'Electrical',
    amount: 410,
    createdAt: iso(daysAgo(2)),
    updatedAt: iso(hoursAgo(18)),
    description: 'Replace 5 electrical outlets. Customer alleges only 2 were replaced.',
    disputeHistory: [
      {
        id: 'DSP-001',
        raisedAt: iso(hoursAgo(18)),
        reason:
          'Work left incomplete — only 2 of 5 outlets were replaced. Artisan left site without finishing.',
        resolvedAt: undefined,
        resolvedOutcome: undefined,
        mediator: 'Mediator (System)',
      },
    ],
  }),

  'OWO-1004': makeJob({
    status: 'Completed' as JobState,
    artisan: 'Bayo S.',
    customer: 'Kunle A.',
    trade: 'Carpentry',
    amount: 1550,
    createdAt: iso(daysAgo(5)),
    updatedAt: iso(daysAgo(1)),
    description: 'Build and install a custom wardrobe frame. Deliver by end of week.',
  }),

  'OWO-1005': makeJob({
    status: 'Refunded' as JobState,
    artisan: 'Chidi U.',
    customer: 'Lara O.',
    trade: 'Painter',
    amount: 600,
    createdAt: iso(daysAgo(6)),
    updatedAt: iso(daysAgo(2)),
    description: 'Paint living room (2 coats). Customer reports unsatisfactory finish.',
    disputeHistory: [
      {
        id: 'DSP-009',
        raisedAt: iso(daysAgo(5)),
        reason: 'Customer reported patchy finish after first coat.',
        resolvedAt: iso(daysAgo(2)),
        resolvedOutcome: 'Refund Customer',
        mediator: 'Mediator (you)',
      },
    ],
  }),
};

export function getMockJobById(jobId: string): JobDetailModel | null {
  return mockJobsById[jobId] ?? null;
}

