# Job Creation Form

Comprehensive job creation form component for the OwoWork escrow platform.

## Features Implemented

### ✅ Form Structure
- **Job Description**: Text input with min/max length validation (10-200 characters)
- **Trade Type Dropdown**: Select from Plumber, Electrician, Carpenter, Painter, Other
- **Amount (XLM)**: Number input with real-time stroops conversion display
- **Artisan Selection**: Searchable dropdown with filtering by name/public key
- **Job Details**: Textarea for detailed job information (min 20 characters)

### ✅ Validation
- All required fields have field-level validation
- Form cannot submit with missing required fields
- Amount validation: must be positive, minimum 1 stroop (0.0000001 XLM)
- Description length validation (10-200 chars)
- Job details minimum length (20 chars)
- Submit button disabled when form is pristine or invalid

### ✅ Currency Conversion
- **XLM to Stroops**: Automatic conversion (1 XLM = 10,000,000 stroops)
- **Stroops to XLM**: Reverse conversion available
- **Format utilities**: Clean display with proper decimal places
- Real-time stroops display under amount input

### ✅ Fee Display
- Estimated gas fees shown (0.00001 XLM per transaction)
- Breakdown showing:
  - Job amount
  - Gas fee
  - Total amount
- All amounts displayed in XLM with proper formatting

### ✅ Artisan Selector
- Search/filter artisans by:
  - Public key
  - Verified name
  - Trade type
- Displays artisan info:
  - Name (or "Unverified")
  - Public key
  - Verification status badge
  - Completed jobs count
  - Trade specialization
- Selected artisan shown with clear badge
- Easy clear/remove selection

### ✅ Error Handling
- Field-level validation errors displayed inline
- Submit error alert with retry capability
- Network error simulation (15% failure rate for demo)
- Graceful error display with icon and message

### ✅ Success Feedback
- Success screen after job creation
- Displays created job ID
- Visual confirmation with check icon
- "Back to Dashboard" button

### ✅ UI/UX Features
- **Modal overlay**: Centered form with backdrop
- **Loading states**: Submit button shows spinner during submission
- **Disabled states**: Form disabled during submission
- **Cancel button**: Exit without submitting
- **Back button**: Return to dashboard
- **Responsive design**: Mobile-friendly layout
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation

### ✅ Mock Endpoint
- No actual API submission yet
- `mockCreateJob()` function simulates network call
- 2-second delay to simulate latency
- Generates random job ID (OWO-XXXX format)
- 15% failure rate for testing error handling

## Technology Stack

### Dependencies Installed
- **react-hook-form**: Form state management and validation
- **lucide-react**: Icons (already installed)
- **react**: UI framework (already installed)

### File Structure
```
src/
├── components/
│   ├── JobForm.tsx              # Main form component
│   ├── FormInput.tsx            # Reusable text input
│   ├── FormTextarea.tsx         # Reusable textarea
│   ├── FormSelect.tsx           # Reusable dropdown select
│   └── ArtisanSelector.tsx      # Custom artisan search/select
├── types/
│   └── job.ts                   # TypeScript types for jobs
├── utils/
│   └── currency.ts              # XLM/stroops conversion helpers
├── App.tsx                      # Updated with modal integration
└── styles.css                   # Updated with form styles
```

## Usage

### Opening the Form
Click the "New job" button in the top-right corner of the dashboard.

### Filling Out the Form

1. **Job Description**: Brief title (e.g., "Fix burst pipe in kitchen")
2. **Trade Type**: Select appropriate trade from dropdown
3. **Job Details**: Comprehensive details about scope, materials, access, etc.
4. **Artisan**: Search and select an artisan by name or public key
5. **Amount**: Enter payment amount in XLM (auto-converts to stroops)
6. Review estimated fees and total
7. Click "Create Job" to submit

### Form Sections

#### Job Information
- Description and trade type selection
- Detailed job scope and requirements

#### Artisan Selection
- Searchable artisan database
- Filter by name, key, or trade
- Shows verification status and job history

#### Payment
- Amount input in XLM
- Real-time stroops conversion
- Fee breakdown with estimates
- Total calculation

## Component API

### JobForm Props
```typescript
interface JobFormProps {
  onCancel: () => void;        // Called when cancel/back is clicked
  onSuccess: (jobId: string) => void;  // Called after successful submission
}
```

### Currency Utilities
```typescript
xlmToStroops(xlm: number): number
stroopsToXlm(stroops: number): number
formatXlm(xlm: number): string
formatStroops(stroops: number): string
```

### Form Data Types
```typescript
interface JobFormData {
  description: string;
  tradeType: TradeType;
  amount: string;              // XLM as string
  artisanPublicKey: string;
  jobDetails: string;
}

type TradeType = 'Plumber' | 'Electrician' | 'Carpenter' | 'Painter' | 'Other';
```

## Styling

All form styles are in `styles.css` with these key classes:
- `.modal-overlay`: Full-screen backdrop
- `.job-form-card`: Main form container
- `.form-section`: Grouped form fields
- `.form-field`: Individual field wrapper
- `.form-input`, `.form-select`, `.form-textarea`: Form controls
- `.artisan-selector`: Custom artisan picker
- `.fee-summary`: Payment breakdown
- `.form-success`: Success confirmation screen

## Validation Rules

| Field | Rules |
|-------|-------|
| Description | Required, 10-200 characters |
| Trade Type | Required, must be valid option |
| Job Details | Required, minimum 20 characters |
| Artisan | Required, must select an artisan |
| Amount | Required, > 0, minimum 1 stroop (0.0000001 XLM) |

## Next Steps for API Integration

When ready to connect to real API, replace `mockCreateJob()` in `JobForm.tsx`:

```typescript
async function createJob(payload: JobFormData): Promise<{ jobId: string }> {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      amountStroops: xlmToStroops(parseFloat(payload.amount)),
      estimatedFees: xlmToStroops(ESTIMATED_GAS_FEE_XLM)
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  
  return response.json();
}
```

## Testing the Form

1. Start development server: `npm run dev`
2. Click "New job" button
3. Try submitting with missing fields (validation errors)
4. Fill out all fields correctly
5. Submit form (simulated 2s delay)
6. Observe success screen or error message
7. Test artisan search/filter functionality
8. Verify XLM to stroops conversion
9. Check fee calculations

## Accessibility

- All inputs have proper labels
- Required fields marked with asterisk
- Error messages associated with fields
- Keyboard navigation supported
- Modal has proper ARIA attributes
- Focus management on modal open/close
