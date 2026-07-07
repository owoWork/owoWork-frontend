# OwoWork

OwoWork is a website for an artisan services marketplace backed by escrow-style job settlement. It contains a production-shaped frontend, a TypeScript backend API, and a Soroban smart contract that tracks job states, disputes, and artisan reputation.

The project is intentionally split into three clear workspaces:

- `frontend/` - Vite + React interface for customers, artisans, and marketplace operators.
- `backend/` - Fastify API for job orchestration, event handling, and future Stellar/Soroban integration.
- `contract/` - Rust Soroban contract for job escrow state, dispute flow, and reputation storage.

## Repository Structure

```text
owowork/
├── backend/
│   ├── src/
│   │   ├── config.ts
│   │   ├── routes/
│   │   │   └── jobs.ts
│   │   ├── server.ts
│   │   ├── services/
│   │   │   ├── jobs.ts
│   │   │   └── soroban.ts
│   │   └── types.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── contract/
│   ├── src/
│   │   └── lib.rs
│   └── Cargo.toml
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Product Concept

OwoWork helps customers hire verified local artisans while keeping payment tied to a transparent job lifecycle.

1. A customer creates a job, names an artisan, and locks an agreed amount.
2. The artisan accepts the job.
3. The customer confirms completion and the backend releases funds.
4. If the job goes wrong, the customer can raise a dispute.
5. A mediator can resolve the dispute, or the artisan can be favored after the 48 hour dispute window.
6. Completed and disputed outcomes update artisan reputation.

The current scaffold gives you the application shape for that flow. The contract stores canonical job state and emits events. The backend is ready to become the bridge between the frontend, contract invocations, Horizon payments, and off-chain metadata.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Rust stable
- `wasm32-unknown-unknown` target for contract builds
- Soroban CLI for contract deployment and invocation

Install the Rust WASM target:

```bash
rustup target add wasm32-unknown-unknown
```

Install Soroban CLI using the current Stellar documentation for your platform, then verify:

```bash
soroban version
```

## Quick Start

Install JavaScript dependencies from the repository root:

```bash
npm install
```

Run the backend:

```bash
npm run dev:backend
```

Run the frontend in another terminal:

```bash
npm run dev:frontend
```

Build all JavaScript workspaces:

```bash
npm run build
```

Build the contract:

```bash
npm run contract:build
```

Run contract tests once you add test coverage:

```bash
npm run contract:test
```

## Environment Variables

Root-level examples live in `.env.example`. Each workspace also has its own example where local configuration belongs.

### Frontend

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Backend API origin used by browser requests. |

### Backend

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | HTTP server port. |
| `HOST` | `0.0.0.0` | HTTP bind host. |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin. |
| `SOROBAN_NETWORK` | `testnet` | Target Stellar/Soroban network. |
| `SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` | Soroban RPC endpoint. |
| `STELLAR_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Horizon endpoint for payment operations. |
| `JOB_ESCROW_CONTRACT_ID` | empty | Deployed contract ID. |
| `MEDIATOR_PUBLIC_KEY` | empty | Public key allowed by your backend policy to resolve disputes. |

## Frontend Workspace

The frontend is a Vite + React application with a distinctive operations-dashboard aesthetic. It is intentionally not a landing page: the first screen is the working product surface, showing escrow volume, dispute pressure, job state, route actions, and reputation signals.

Useful commands:

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run test          # Run tests in watch mode
npm run test:ci      # Run tests once (for CI)
npm run test:coverage # Run tests with coverage
```

## Testing

### Frontend Tests

The frontend uses **Vitest** and **React Testing Library** for unit and component tests.

- **Component tests** are located alongside components (e.g., `JobRow.test.tsx` next to `JobRow.tsx`)
- **Testing utilities**: `@testing-library/react` for rendering, `@testing-library/user-event` for user interactions
- **Accessibility checks**: Use axe-core for automated accessibility testing

### Running Tests

```bash
cd frontend
npm test                # Watch mode
npm run test:ci         # Single run (for CI)
npm run test:coverage   # Generate coverage report
```

### Pre-commit Hooks

Husky + lint-staged automatically runs relevant tests before commits:

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": ["vitest related --run"]
}
```

## Accessibility

The frontend is designed to meet **WCAG 2.1 AA standards**:

- ✅ **Keyboard navigation**: All interactive elements are reachable and usable via keyboard (Tab, Enter, Escape)
- ✅ **Screen reader support**: Semantic HTML and ARIA attributes
- ✅ **Color contrast**: WCAG 2.1 AA compliant contrast ratios
- ✅ **Form labels**: All inputs have proper associated labels
- ✅ **Heading hierarchy**: Proper semantic heading levels (h1, h2, h3)

### Accessibility Testing Tools

- **axe-core**: Automated accessibility testing in tests
- **Browser DevTools**: Lighthouse for accessibility audits



Recommended next steps:

- Replace the sample data in `src/App.tsx` with API calls to `GET /api/jobs`.
- Add wallet connection for customer, artisan, and mediator signatures.
- Create job forms that submit to `POST /api/jobs`.
- Add optimistic state transitions for accepting, confirming, disputing, and resolving jobs.
- Add role-based views so customers, artisans, and mediators see only the actions relevant to them.

## Backend Workspace

The backend is a Fastify API with typed job lifecycle routes and an in-memory service. This keeps local development fast while making the eventual database and Soroban integration points explicit.

Useful commands:

```bash
cd backend
cp .env.example .env
npm run dev
npm run build
```

### API Endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check service status and configured network. |
| `GET` | `/api/jobs` | List all tracked jobs. |
| `GET` | `/api/jobs/:jobId` | Read one job by ID. |
| `POST` | `/api/jobs` | Create a job record and prepare contract invocation. |
| `POST` | `/api/jobs/:jobId/accept` | Mark an open job as active for the assigned artisan. |
| `POST` | `/api/jobs/:jobId/confirm` | Mark an active job as completed. |
| `POST` | `/api/jobs/:jobId/dispute` | Move an active job into dispute. |
| `POST` | `/api/jobs/:jobId/resolve` | Resolve a dispute in favor of `artisan` or `customer`. |

### Example Create Job Request

```json
{
  "customer": "GAK...",
  "artisan": "GDL...",
  "amount": "250000000",
  "jobHash": "1d7f0d4c5a0f...",
  "trade": "plumber",
  "description": "Replace kitchen sink valve and pressure test"
}
```

Amounts are represented as stroops. One XLM is `10_000_000` stroops.

### Backend Responsibilities

The backend should eventually own:

- API authentication and role authorization.
- Off-chain job metadata storage.
- Job description hashing before contract submission.
- Contract transaction construction and submission.
- Horizon payment release or Stellar Asset Contract token transfer flow.
- Event indexing for contract events such as `created`, `accepted`, `completed`, `disputed`, and `resolved`.
- Idempotency keys for payment release and dispute resolution.
- Audit logs for mediator actions.

## Contract Workspace

The contract is a Soroban Rust crate named `owowork-contract`. It stores job records and artisan reputation.

Useful commands:

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
cargo test
```

### Contract State Machine

| State | Meaning | Next Valid States |
| --- | --- | --- |
| `Open` | Customer created the job and funds are expected to be locked. | `Active` |
| `Active` | Artisan accepted and work is in progress. | `Completed`, `Disputed` |
| `Disputed` | Customer raised a dispute during active work. | `Completed`, `Refunded` |
| `Completed` | Customer confirmed completion or dispute favored artisan. | terminal |
| `Refunded` | Dispute resolved in customer's favor. | terminal |

### Contract Functions

| Function | Caller | Purpose |
| --- | --- | --- |
| `create_job` | Customer | Create a job and persist escrow metadata. |
| `accept_job` | Artisan | Accept an open job. |
| `confirm_done` | Customer | Complete an active job and increase artisan reputation. |
| `raise_dispute` | Customer | Move an active job into a 48 hour dispute window. |
| `resolve_dispute` | Mediator | Complete or refund a disputed job. |
| `get_job` | Anyone | Read a job record. |
| `get_reputation` | Anyone | Read an artisan reputation record. |

### Important Contract Note

This scaffold records escrow state and emits settlement events. Production escrow should also enforce asset movement on-chain or use a rigorously controlled backend settlement process. If you want purely on-chain escrow, add Stellar Asset Contract token transfers to `create_job`, `confirm_done`, and dispute resolution paths. If you keep backend-mediated Horizon payments, the backend must treat contract events as settlement instructions and enforce idempotent payout/refund handling.

## Suggested Development Flow

1. Start with the backend API and frontend mocked states.
2. Add persistent storage to the backend, such as PostgreSQL.
3. Add wallet authentication and request signing.
4. Deploy the Soroban contract to testnet.
5. Wire backend route handlers to contract invocations.
6. Add an event indexer that watches the contract and mirrors state into the backend database.
7. Add payment release logic with strict idempotency.
8. Add end-to-end tests for happy path, dispute path, and invalid caller path.

## Security Checklist

- Never trust frontend role claims; verify signatures server-side.
- Validate every Stellar public key and contract ID.
- Hash job descriptions consistently before contract submission.
- Store full job descriptions off-chain; store only hashes on-chain.
- Add idempotency keys to every payment or refund operation.
- Prevent duplicate payouts for repeated `completed` or `resolved` events.
- Add mediator authorization policy before enabling dispute resolution.
- Record audit logs for all state-changing backend requests.
- Add rate limits for job creation and dispute endpoints.
- Add monitoring for stuck `Open`, `Active`, and `Disputed` jobs.

## Testing Roadmap

Frontend:

- Component tests for job state badges, action availability, and empty states.
- Browser tests for customer, artisan, and mediator workflows.
- Accessibility checks for keyboard navigation and contrast.

Backend:

- Unit tests for each service state transition.
- Route tests for validation failures and not-found responses.
- Contract adapter tests using mocked Soroban clients.
- Idempotency tests for settlement actions.

Contract:

- `create_job` rejects duplicate IDs.
- `accept_job` rejects the wrong artisan.
- `confirm_done` rejects non-customers and inactive jobs.
- `raise_dispute` records `dispute_at`.
- `resolve_dispute` enforces the 48 hour artisan-favor window.
- Reputation counters update correctly.

## Deployment Notes

Frontend can be deployed to any static host after `npm run build --workspace frontend`.

Backend should be deployed as a long-running Node service with environment variables configured for the target Stellar network.

Contract deployment flow:

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/owowork_contract.wasm
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/owowork_contract.optimized.wasm \
  --source <DEPLOYER_ACCOUNT> \
  --network testnet
```

Store the deployed contract ID as `JOB_ESCROW_CONTRACT_ID` in the backend environment.

## Troubleshooting

If `npm install` fails, confirm your Node and npm versions first.

If the frontend cannot reach the API, check `VITE_API_BASE_URL` and `CORS_ORIGIN`.

If contract builds fail because the WASM target is missing, run:

```bash
rustup target add wasm32-unknown-unknown
```


## License

MIT. 
