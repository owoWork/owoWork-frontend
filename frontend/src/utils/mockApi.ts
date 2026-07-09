/**
 * Mock API utilities for job creation
 * Replace these with actual API calls when backend is ready
 */

import { JobFormData } from '../types/job';
import { xlmToStroops } from './currency';

export interface CreateJobResponse {
  jobId: string;
  transactionHash?: string;
}

/**
 * Mock job creation endpoint
 * Simulates network call with random delay and occasional failures
 */
export async function mockCreateJob(formData: JobFormData): Promise<CreateJobResponse> {
  // Simulate network latency (1.5-2.5 seconds)
  const delay = 1500 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate occasional network failures (15% chance)
  if (Math.random() < 0.15) {
    throw new Error('Network error: Failed to submit job to the contract.');
  }

  // Simulate server validation errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Validation error: Artisan is not available for this trade type.');
  }

  // Convert to API payload format
  const payload = {
    description: formData.description,
    tradeType: formData.tradeType,
    amountStroops: xlmToStroops(parseFloat(formData.amount)),
    artisanPublicKey: formData.artisanPublicKey,
    jobDetails: formData.jobDetails,
    estimatedFees: xlmToStroops(0.00001) // Gas fee in stroops
  };

  console.log('Mock API - Job Creation Payload:', payload);

  // Generate mock response
  const jobId = `OWO-${1000 + Math.floor(Math.random() * 9000)}`;
  const transactionHash = generateMockHash();

  return {
    jobId,
    transactionHash
  };
}

/**
 * Generate a mock Stellar transaction hash
 */
function generateMockHash(): string {
  const chars = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Example of actual API call structure for future implementation
 */
export async function createJobAPI(formData: JobFormData): Promise<CreateJobResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers as needed
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      description: formData.description,
      tradeType: formData.tradeType,
      amountStroops: xlmToStroops(parseFloat(formData.amount)),
      artisanPublicKey: formData.artisanPublicKey,
      jobDetails: formData.jobDetails
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create job');
  }

  return response.json();
}
