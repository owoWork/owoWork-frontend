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
    id: 'OWO-1001',
    status: 'Open' as JobState,
    artisan: 'Efe A.',
    customer: 'Timi R.',
    trade: 'Plumbing',
    amount: 380,
    createdAt: iso(daysAgo(10)),
    updatedAt: iso(hoursAgo(4)),
    description: 'Replace leaking tap in the master bathroom and pressure test.',
  }),

  'OWO-1002': makeJob({
    id: 'OWO-1002',
    status: 'Active' as JobState,
    artisan: 'Musa K.',
    customer: 'Ada N.',
    trade: 'Plumbing',
    amount: 290,
    createdAt: iso(daysAgo(9)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Repair leaking pipe in the living room and ensure no further drips.',
  }),

  'OWO-1003': makeJob({
    id: 'OWO-1003',
    status: 'Disputed' as JobState,
    artisan: 'Efe A.',
    customer: 'Timi R.',
    trade: 'Electrical',
    amount: 410,
    createdAt: iso(daysAgo(8)),
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
    id: 'OWO-1004',
    status: 'Completed' as JobState,
    artisan: 'Bayo S.',
    customer: 'Kunle A.',
    trade: 'Carpentry',
    amount: 1550,
    createdAt: iso(daysAgo(7)),
    updatedAt: iso(daysAgo(1)),
    description: 'Build and install a custom wardrobe frame. Deliver by end of week.',
  }),

  'OWO-1005': makeJob({
    id: 'OWO-1005',
    status: 'Refunded' as JobState,
    artisan: 'Chidi U.',
    customer: 'Lara O.',
    trade: 'Painting',
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

  'OWO-1006': makeJob({
    id: 'OWO-1006',
    status: 'Open' as JobState,
    artisan: 'Amina D.',
    customer: 'Fola M.',
    trade: 'Electrical',
    amount: 520,
    createdAt: iso(daysAgo(5)),
    updatedAt: iso(hoursAgo(6)),
    description: 'Install whole-house surge protector and upgrade main circuit breaker.',
  }),

  'OWO-1007': makeJob({
    id: 'OWO-1007',
    status: 'Active' as JobState,
    artisan: 'Samuel O.',
    customer: 'Ngozi B.',
    trade: 'Carpentry',
    amount: 850,
    createdAt: iso(daysAgo(5)),
    updatedAt: iso(hoursAgo(2)),
    description: 'Build bespoke kitchen shelving unit with solid oak finish.',
  }),

  'OWO-1008': makeJob({
    id: 'OWO-1008',
    status: 'Completed' as JobState,
    artisan: 'Ibrahim T.',
    customer: 'Kemi J.',
    trade: 'Tiling',
    amount: 1100,
    createdAt: iso(daysAgo(4)),
    updatedAt: iso(daysAgo(1)),
    description: 'Retile master ensuite shower walls and waterproof floor base.',
  }),

  'OWO-1009': makeJob({
    id: 'OWO-1009',
    status: 'Disputed' as JobState,
    artisan: 'David K.',
    customer: 'Emeka P.',
    trade: 'Welding',
    amount: 750,
    createdAt: iso(daysAgo(4)),
    updatedAt: iso(hoursAgo(5)),
    description: 'Fabricate iron security gate for front perimeter.',
  }),

  'OWO-1010': makeJob({
    id: 'OWO-1010',
    status: 'Active' as JobState,
    artisan: 'Zainab B.',
    customer: 'Tunde V.',
    trade: 'Painting',
    amount: 450,
    createdAt: iso(daysAgo(3)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Exterior front facade coating with weather-resistant primer.',
  }),

  'OWO-1011': makeJob({
    id: 'OWO-1011',
    status: 'Open' as JobState,
    artisan: 'Chinedu W.',
    customer: 'Blessing K.',
    trade: 'HVAC',
    amount: 1300,
    createdAt: iso(daysAgo(3)),
    updatedAt: iso(hoursAgo(10)),
    description: 'Service split air conditioning unit and recharge refrigerant gas.',
  }),

  'OWO-1012': makeJob({
    id: 'OWO-1012',
    status: 'Completed' as JobState,
    artisan: 'Fatima S.',
    customer: 'Alhaji G.',
    trade: 'Masonry',
    amount: 2100,
    createdAt: iso(daysAgo(3)),
    updatedAt: iso(hoursAgo(8)),
    description: 'Rebuild collapsed garden boundary wall with reinforced concrete lintels.',
  }),

  'OWO-1013': makeJob({
    id: 'OWO-1013',
    status: 'Refunded' as JobState,
    artisan: 'Victor M.',
    customer: 'Sola Q.',
    trade: 'General',
    amount: 220,
    createdAt: iso(daysAgo(2)),
    updatedAt: iso(daysAgo(1)),
    description: 'Assemble flatpack furniture units and hang picture frames.',
  }),

  'OWO-1014': makeJob({
    id: 'OWO-1014',
    status: 'Active' as JobState,
    artisan: 'Grace E.',
    customer: 'Gbenga D.',
    trade: 'Plumbing',
    amount: 680,
    createdAt: iso(daysAgo(2)),
    updatedAt: iso(hoursAgo(3)),
    description: 'Install water booster pump and header tank connections.',
  }),

  'OWO-1015': makeJob({
    id: 'OWO-1015',
    status: 'Open' as JobState,
    artisan: 'Hassan U.',
    customer: 'Bukola Y.',
    trade: 'Electrical',
    amount: 340,
    createdAt: iso(daysAgo(2)),
    updatedAt: iso(hoursAgo(7)),
    description: 'Diagnose intermittent tripping on water heater circuit.',
  }),

  'OWO-1016': makeJob({
    id: 'OWO-1016',
    status: 'Completed' as JobState,
    artisan: 'Musa K.',
    customer: 'Yusuf R.',
    trade: 'Carpentry',
    amount: 980,
    createdAt: iso(daysAgo(2)),
    updatedAt: iso(hoursAgo(2)),
    description: 'Custom hardwood door fitting with brass mortise lockset.',
  }),

  'OWO-1017': makeJob({
    id: 'OWO-1017',
    status: 'Disputed' as JobState,
    artisan: 'Efe A.',
    customer: 'Ronke L.',
    trade: 'Plumbing',
    amount: 890,
    createdAt: iso(daysAgo(1)),
    updatedAt: iso(hoursAgo(4)),
    description: 'Replace sewer line section; dispute raised regarding excavation depth.',
  }),

  'OWO-1018': makeJob({
    id: 'OWO-1018',
    status: 'Active' as JobState,
    artisan: 'Bayo S.',
    customer: 'Kolawole E.',
    trade: 'Welding',
    amount: 1400,
    createdAt: iso(daysAgo(1)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Weld structural steel brackets for rooftop solar panel mounts.',
  }),

  'OWO-1019': makeJob({
    id: 'OWO-1019',
    status: 'Open' as JobState,
    artisan: 'Amina D.',
    customer: 'Ifeanyi O.',
    trade: 'Painting',
    amount: 720,
    createdAt: iso(daysAgo(1)),
    updatedAt: iso(hoursAgo(2)),
    description: 'Interior drywall preparation and emulsion finish for 3 bedrooms.',
  }),

  'OWO-1020': makeJob({
    id: 'OWO-1020',
    status: 'Completed' as JobState,
    artisan: 'Chidi U.',
    customer: 'Simi A.',
    trade: 'Tiling',
    amount: 1850,
    createdAt: iso(daysAgo(1)),
    updatedAt: iso(hoursAgo(3)),
    description: 'Vitrified floor tiles for 60 sqm living room and hallway area.',
  }),

  'OWO-1021': makeJob({
    id: 'OWO-1021',
    status: 'Open' as JobState,
    artisan: 'Samuel O.',
    customer: 'Dapo Z.',
    trade: 'HVAC',
    amount: 950,
    createdAt: iso(hoursAgo(12)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Clean ducting filters and re-gas commercial chiller compressor.',
  }),

  'OWO-1022': makeJob({
    id: 'OWO-1022',
    status: 'Active' as JobState,
    artisan: 'Ibrahim T.',
    customer: 'Morayo C.',
    trade: 'Masonry',
    amount: 1650,
    createdAt: iso(hoursAgo(8)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Lay interlocking paving stones on driveway and drainage slopes.',
  }),

  'OWO-1023': makeJob({
    id: 'OWO-1023',
    status: 'Disputed' as JobState,
    artisan: 'David K.',
    customer: 'Segun H.',
    trade: 'General',
    amount: 310,
    createdAt: iso(hoursAgo(6)),
    updatedAt: iso(hoursAgo(2)),
    description: 'Install kitchen exhaust hood and external duct vent flap.',
  }),

  'OWO-1024': makeJob({
    id: 'OWO-1024',
    status: 'Open' as JobState,
    artisan: 'Zainab B.',
    customer: 'Toyin W.',
    trade: 'Electrical',
    amount: 620,
    createdAt: iso(hoursAgo(4)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Wire backup generator changeover switch and auxiliary distribution box.',
  }),

  'OWO-1025': makeJob({
    id: 'OWO-1025',
    status: 'Completed' as JobState,
    artisan: 'Victor M.',
    customer: 'Gbemi F.',
    trade: 'Plumbing',
    amount: 470,
    createdAt: iso(hoursAgo(2)),
    updatedAt: iso(hoursAgo(1)),
    description: 'Clear grease blockage in kitchen main sewer trap and flush line.',
  }),
};

export function getMockJobById(jobId: string): JobDetailModel | null {
  return mockJobsById[jobId] ?? null;
}
