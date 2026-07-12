export type JobRole = 'Customer' | 'Artisan' | 'Mediator';

export type JobState = 'Open' | 'Active' | 'Disputed' | 'Completed' | 'Refunded';

export type ContractRef = {
    jobId: string;
    hash?: string;
};

export interface JobDetailModel {
    id: string;
    status: JobState;
    description: string;
    amount: number; // XLM
    artisan: string;
    customer: string;
    trade: string;
    createdAt: string;
    updatedAt: string;
    contractRefs: ContractRef;
    escrowContractRef?: string;
    disputeHistory?: Array<{
        id: string;
        raisedAt: string;
        reason: string;
        resolvedAt?: string;
        resolvedOutcome?: 'Favour Artisan' | 'Refund Customer';
        mediator?: string;
    }>;
}

