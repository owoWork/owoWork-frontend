import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Loader2, CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FormSelect } from './FormSelect';
import { ArtisanSelector } from './ArtisanSelector';
import { JobFormData, TRADE_TYPES } from '../types/job';
import { xlmToStroops, formatStroops, formatXlm } from '../utils/currency';
import { mockCreateJob } from '../utils/mockApi';

// Estimated gas fee in XLM per transaction
const ESTIMATED_GAS_FEE_XLM = 0.00001;

interface JobFormProps {
  onCancel: () => void;
  onSuccess: (jobId: string) => void;
}

export function JobForm({ onCancel, onSuccess }: JobFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty }
  } = useForm<JobFormData>({
    defaultValues: {
      description: '',
      tradeType: undefined,
      amount: '',
      artisanPublicKey: '',
      jobDetails: ''
    }
  });

  const amountXlm = parseFloat(watch('amount') || '0') || 0;
  const amountStroops = xlmToStroops(amountXlm);
  const totalXlm = amountXlm + ESTIMATED_GAS_FEE_XLM;

  const onSubmit = async (data: JobFormData) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await mockCreateJob(data);
      setCreatedJobId(result.jobId);
      onSuccess(result.jobId);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Success state ---
  if (createdJobId) {
    return (
      <div className="job-form-card">
        <div className="form-success">
          <div className="success-icon-wrap">
            <CheckCircle2 size={48} />
          </div>
          <h2>Job Created!</h2>
          <p>Your job has been submitted to the escrow contract.</p>
          <div className="job-id-badge">
            <span className="eyebrow">Job ID</span>
            <strong>{createdJobId}</strong>
          </div>
          <button className="primary-action" onClick={onCancel}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Form state ---
  return (
    <div className="job-form-card">
      <div className="form-header">
        <button
          type="button"
          className="ghost-action form-back-btn"
          onClick={onCancel}
          disabled={submitting}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div>
          <p className="eyebrow">Create job</p>
          <h2>New job record</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="job-form">
        {/* --- Section: Job Info --- */}
        <fieldset className="form-section">
          <legend className="form-section-label">Job Information</legend>

          <FormInput
            label="Job Description"
            name="description"
            placeholder="e.g. Fix burst pipe in the kitchen"
            required
            error={errors.description?.message}
            register={register('description', {
              required: 'Job description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
              maxLength: { value: 200, message: 'Description cannot exceed 200 characters' }
            })}
            disabled={submitting}
          />

          <FormSelect
            label="Trade Type"
            name="tradeType"
            options={TRADE_TYPES}
            placeholder="Select a trade"
            required
            error={errors.tradeType?.message}
            register={register('tradeType', {
              required: 'Please select a trade type'
            })}
            disabled={submitting}
          />

          <FormTextarea
            label="Job Details"
            name="jobDetails"
            placeholder="Provide additional details about the job scope, materials needed, access instructions, etc."
            required
            rows={4}
            error={errors.jobDetails?.message}
            register={register('jobDetails', {
              required: 'Job details are required',
              minLength: { value: 20, message: 'Job details must be at least 20 characters' }
            })}
            disabled={submitting}
          />
        </fieldset>

        {/* --- Section: Artisan --- */}
        <fieldset className="form-section">
          <legend className="form-section-label">Artisan Selection</legend>

          <Controller
            name="artisanPublicKey"
            control={control}
            rules={{ required: 'Please select an artisan' }}
            render={({ field }) => (
              <ArtisanSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.artisanPublicKey?.message}
                disabled={submitting}
              />
            )}
          />
        </fieldset>

        {/* --- Section: Payment --- */}
        <fieldset className="form-section">
          <legend className="form-section-label">Payment</legend>

          <FormInput
            label="Amount (XLM)"
            name="amount"
            type="number"
            placeholder="0.0000000"
            required
            helperText={
              amountXlm > 0
                ? `= ${formatStroops(amountStroops)} stroops`
                : 'Enter amount in XLM — auto-converted to stroops'
            }
            error={errors.amount?.message}
            register={register('amount', {
              required: 'Amount is required',
              validate: {
                positive: (v: string) =>
                  parseFloat(v) > 0 || 'Amount must be greater than 0',
                minimum: (v: string) =>
                  parseFloat(v) >= 0.0000001 || 'Minimum amount is 1 stroop (0.0000001 XLM)'
              }
            })}
            disabled={submitting}
          />

          {/* Fee breakdown */}
          <div className="fee-summary">
            <div className="fee-row">
              <span>
                <Zap size={14} />
                Job amount
              </span>
              <span>{formatXlm(amountXlm)} XLM</span>
            </div>
            <div className="fee-row">
              <span>
                <Zap size={14} />
                Estimated gas fee
              </span>
              <span>{formatXlm(ESTIMATED_GAS_FEE_XLM)} XLM</span>
            </div>
            <div className="fee-row fee-total">
              <span>Total</span>
              <span>{formatXlm(totalXlm)} XLM</span>
            </div>
          </div>
        </fieldset>

        {/* --- Submit error --- */}
        {submitError && (
          <div className="submit-error" role="alert">
            <AlertCircle size={18} />
            <p>{submitError}</p>
          </div>
        )}

        {/* --- Actions --- */}
        <div className="form-actions">
          <button
            type="button"
            className="ghost-action"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-action"
            disabled={submitting || !isDirty}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="loading-spinner" />
                Submitting…
              </>
            ) : (
              'Create Job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
