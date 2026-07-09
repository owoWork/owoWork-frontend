export type TradeType = 'Plumber' | 'Electrician' | 'Carpenter' | 'Painter' | 'Other';

export const TRADE_TYPES: TradeType[] = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Other'];

export interface JobFormData {
  description: string;
  tradeType: TradeType;
  amount: string; // XLM as string for input
  artisanPublicKey: string;
  jobDetails: string;
}

export interface CreateJobPayload {
  description: string;
  tradeType: TradeType;
  amountStroops: number; // Amount in stroops
  artisanPublicKey: string;
  jobDetails: string;
  estimatedFees: number;
}
