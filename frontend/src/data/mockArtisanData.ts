export type TradeSpecialization =
  | "Plumbing"
  | "Electrical"
  | "Carpentry"
  | "Painting"
  | "Welding"
  | "Tiling"
  | "Masonry"
  | "HVAC"
  | "General";

export type DisputeOutcome = "Resolved – Artisan" | "Resolved – Customer" | "Settled" | "Pending";

export interface CompletedJob {
  id: string;
  customer: string;
  trade: TradeSpecialization;
  completedDate: string;
  amount: number;
  rating: number;
  reviewNote?: string;
}

export interface DisputeRecord {
  id: string;
  jobId: string;
  customer: string;
  date: string;
  outcome: DisputeOutcome;
  summary: string;
}

export interface Artisan {
  id: string;
  name: string;
  publicKey: string;
  specializations: TradeSpecialization[];
  joinDate: string;
  avatarInitials: string;
  avatarColor: string;
  isVerified: boolean;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  averageRating: number;
  completedJobsList: CompletedJob[];
  disputes: DisputeRecord[];
  bio: string;
  location: string;
}

export const mockArtisans: Artisan[] = [
  {
    id: "art-001",
    name: "Musa Kabiru",
    publicKey: "0x7aF3...d91C",
    specializations: ["Plumbing", "HVAC"],
    joinDate: "2023-03-14",
    avatarInitials: "MK",
    avatarColor: "#0f8f5f",
    isVerified: true,
    totalJobs: 58,
    completedJobs: 53,
    cancelledJobs: 2,
    averageRating: 4.7,
    bio: "Certified plumber and HVAC specialist with 8 years field experience across Lagos and Abuja. Specialises in emergency repairs and new installations.",
    location: "Yaba, Lagos",
    completedJobsList: [
      {
        id: "OWO-0991",
        customer: "Ada N.",
        trade: "Plumbing",
        completedDate: "2025-06-28",
        amount: 240,
        rating: 5,
        reviewNote: "Excellent work, very thorough."
      },
      {
        id: "OWO-0954",
        customer: "Taiwo B.",
        trade: "Plumbing",
        completedDate: "2025-05-19",
        amount: 310,
        rating: 5,
        reviewNote: "Fixed the issue fast."
      },
      {
        id: "OWO-0912",
        customer: "Chidi O.",
        trade: "HVAC",
        completedDate: "2025-04-03",
        amount: 580,
        rating: 4,
        reviewNote: "Good work, slightly delayed."
      },
      {
        id: "OWO-0876",
        customer: "Ngozi F.",
        trade: "Plumbing",
        completedDate: "2025-03-17",
        amount: 195,
        rating: 5,
      },
      {
        id: "OWO-0841",
        customer: "Emeka T.",
        trade: "HVAC",
        completedDate: "2025-02-10",
        amount: 720,
        rating: 4,
        reviewNote: "Professional and courteous."
      }
    ],
    disputes: [
      {
        id: "DIS-017",
        jobId: "OWO-0833",
        customer: "Kunle A.",
        date: "2025-01-28",
        outcome: "Resolved – Artisan",
        summary: "Customer claimed incomplete work. Evidence showed full scope was completed per contract."
      }
    ]
  },
  {
    id: "art-002",
    name: "Efe Adesanya",
    publicKey: "0x3bC9...11Aa",
    specializations: ["Electrical"],
    joinDate: "2022-11-05",
    avatarInitials: "EA",
    avatarColor: "#3159ff",
    isVerified: true,
    totalJobs: 91,
    completedJobs: 84,
    cancelledJobs: 3,
    averageRating: 4.5,
    bio: "Licensed electrician specialising in residential wiring, panel upgrades, and solar installations. 10+ years experience.",
    location: "Surulere, Lagos",
    completedJobsList: [
      {
        id: "OWO-1030",
        customer: "Lara O.",
        trade: "Electrical",
        completedDate: "2025-07-01",
        amount: 415,
        rating: 5,
        reviewNote: "Superb wiring job."
      },
      {
        id: "OWO-1002",
        customer: "Bolu M.",
        trade: "Electrical",
        completedDate: "2025-06-12",
        amount: 370,
        rating: 4,
      },
      {
        id: "OWO-0988",
        customer: "Femi A.",
        trade: "Electrical",
        completedDate: "2025-05-29",
        amount: 600,
        rating: 5,
        reviewNote: "Top-tier work."
      },
      {
        id: "OWO-0970",
        customer: "Sade W.",
        trade: "Electrical",
        completedDate: "2025-05-08",
        amount: 280,
        rating: 4,
      }
    ],
    disputes: [
      {
        id: "DIS-022",
        jobId: "OWO-0960",
        customer: "Timi R.",
        date: "2025-04-20",
        outcome: "Settled",
        summary: "Dispute over additional materials cost. Both parties agreed to a 50/50 split on extras."
      },
      {
        id: "DIS-031",
        jobId: "OWO-0922",
        customer: "Dele K.",
        date: "2025-03-05",
        outcome: "Resolved – Customer",
        summary: "Rewiring incomplete on scheduled date. Partial refund issued."
      }
    ]
  },
  {
    id: "art-003",
    name: "Bayo Sanni",
    publicKey: "0x9dE2...77Fb",
    specializations: ["Carpentry", "Painting"],
    joinDate: "2024-01-22",
    avatarInitials: "BS",
    avatarColor: "#ff6b27",
    isVerified: false,
    totalJobs: 21,
    completedJobs: 18,
    cancelledJobs: 1,
    averageRating: 4.2,
    bio: "Furniture maker and interior finishing specialist. Custom woodwork, cabinetry, and full-room paint jobs.",
    location: "Ikeja, Lagos",
    completedJobsList: [
      {
        id: "OWO-1035",
        customer: "Nkem P.",
        trade: "Carpentry",
        completedDate: "2025-06-30",
        amount: 800,
        rating: 5,
        reviewNote: "Beautiful custom shelving."
      },
      {
        id: "OWO-1018",
        customer: "Yemi D.",
        trade: "Painting",
        completedDate: "2025-06-10",
        amount: 340,
        rating: 4,
      },
      {
        id: "OWO-0997",
        customer: "Amina H.",
        trade: "Carpentry",
        completedDate: "2025-05-20",
        amount: 620,
        rating: 4,
        reviewNote: "Good craftsmanship."
      }
    ],
    disputes: []
  },
  {
    id: "art-004",
    name: "Nneka Igwe",
    publicKey: "0xC51b...3dE0",
    specializations: ["Painting", "Tiling", "Masonry"],
    joinDate: "2023-07-08",
    avatarInitials: "NI",
    avatarColor: "#c6415d",
    isVerified: true,
    totalJobs: 44,
    completedJobs: 42,
    cancelledJobs: 0,
    averageRating: 4.9,
    bio: "Multi-trade finisher with expertise in decorative tiling, textured paint, and block-laying. Meticulous attention to detail.",
    location: "Lekki, Lagos",
    completedJobsList: [
      {
        id: "OWO-1040",
        customer: "Kunle A.",
        trade: "Painting",
        completedDate: "2025-07-03",
        amount: 620,
        rating: 5,
        reviewNote: "Flawless finish!"
      },
      {
        id: "OWO-1025",
        customer: "Ifeoma C.",
        trade: "Tiling",
        completedDate: "2025-06-22",
        amount: 980,
        rating: 5,
        reviewNote: "Perfect alignment, no issues."
      },
      {
        id: "OWO-1011",
        customer: "Chukwu B.",
        trade: "Masonry",
        completedDate: "2025-06-08",
        amount: 1200,
        rating: 5,
      },
      {
        id: "OWO-0990",
        customer: "Ngozi E.",
        trade: "Tiling",
        completedDate: "2025-05-18",
        amount: 760,
        rating: 5,
        reviewNote: "Best tiler I've ever hired."
      },
      {
        id: "OWO-0971",
        customer: "Remi S.",
        trade: "Painting",
        completedDate: "2025-04-30",
        amount: 440,
        rating: 4,
      }
    ],
    disputes: []
  }
];
