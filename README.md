# Playwright Multi-Strategy Authentication

A small Playwright + TypeScript project that demonstrates four different ways to handle login/authentication in end-to-end tests — from a plain UI login flow up to direct API cookie injection. Each strategy is isolated as its own Playwright "project" so they can be run and compared independently.

Target app: `https://uat.carecoordinations.com/`

## Why four strategies?

Authentication is usually the slowest, flakiest part of an E2E suite. This repo is a reference for picking the right approach depending on context — local dev, CI, or raw speed — rather than committing to one pattern everywhere.

## Project structure

```
playwright-auth/
├── auth/                          # Cached/generated session state files
│   ├── s2_systemAdmin.json        # Strategy 2 local cache
│   └── strategy3_admin.json       # Strategy 3 pipeline-generated state
├── fixtures/                      # Custom test.extend() fixtures
│   ├── Strategy2Fixtures.ts       # Self-healing local fixture
│   ├── Strategy3Fixtures.ts       # Reads pre-built global state
│   └── Strategy4ApiFixtures.ts    # API-based cookie injection
├── pages/                         # Page Object Model
│   ├── HomePage.ts
│   └── LoginPage.ts
├── tests/
│   ├── auth.setup.ts              # Strategy 3 global setup script
│   ├── strategy-1-ui.spec.ts
│   ├── strategy-2-fixtures.spec.ts
│   ├── strategy-3-global.spec.ts
│   └── strategy-4-api.spec.ts
├── package.json
└── playwright.config.ts
```

## The four strategies

### 1. Linear UI login (`strategy-1-ui.spec.ts`)
Each test opens a fresh browser, navigates to the login page, fills the form, submits, and asserts the redirect.

- **Good for:** smoke-testing the login form itself.
- **Trade-off:** slow if reused across many tests — every test re-runs the full login flow.

### 2. Self-healing local fixture (`strategy-2-fixtures.spec.ts`)
A custom fixture checks `fs.existsSync` for a cached session file. If found, it reuses it. If not, it logs in via the UI once and caches the result to disk.

- **Good for:** fast local development — you only "pay" for login once.
- **Trade-off:** not safe for parallel CI runs. If multiple workers start with no cache at the same time, they'll all try to log in simultaneously and can hit the server at once.

### 3. Global setup pipeline (`strategy-3-global.spec.ts` + `auth.setup.ts`)
`playwright.config.ts` defines a `setup` project that runs once, before any test files, and logs in each required role (admin, manager, staff, etc.), saving each session to `auth/`. Test fixtures just load the saved state via `browser.newContext({ storageState })`.

- **Good for:** CI/CD — no race conditions, login happens exactly once regardless of parallelism.
- **Trade-off:** slightly more setup/config than the other approaches.

### 4. API-based cookie injection (`strategy-4-api.spec.ts`)
The fixture sends a direct `POST` request to the app's `/signin` endpoint (bypassing the UI entirely), extracts the `Set-Cookie` headers from the response, and injects them into a new browser context with `context.addCookies()`.

- **Good for:** maximum speed — no page rendering involved at all.
- **Trade-off:** doesn't test the login UI itself, and breaks if the API response shape changes.

## Configuration (`playwright.config.ts`)

Each strategy is its own Playwright project, matched by file name via `testMatch`. Strategy 3 declares a `dependencies: ['setup']` so the global auth setup always runs first.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://uat.carecoordinations.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Runs once, before any spec, to generate session state for Strategy 3
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      testIgnore: /.*\.spec\.ts/,
    },

    {
      name: 'strategy2-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /strategy-2-fixtures\.spec\.ts/,
      testIgnore: /auth\.setup\.ts/,
    },

    {
      name: 'strategy3-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /strategy-3-global\.spec\.ts/,
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },

    {
      name: 'strategy4-api',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /strategy-4-api\.spec\.ts/,
      testIgnore: /auth\.setup\.ts/,
    },
  ],
});
```

## Running the tests

```json
"scripts": {
  "test:strategy1": "npx playwright test tests/strategy-1-ui.spec.ts --headed",
  "test:strategy2": "npx playwright test --project=strategy2-chromium --headed",
  "test:strategy3": "npx playwright test --project=strategy3-chromium",
  "test:strategy4": "npx playwright test --project=strategy4-api"
}
```

```bash
npm run test:strategy1   # Linear UI login
npm run test:strategy2   # Self-healing local fixture
npm run test:strategy3   # Global setup pipeline (CI-safe)
npm run test:strategy4   # API cookie injection (fastest)
```

## Strategy 4 implementation notes

The trickiest part of API-based auth is parsing `Set-Cookie` headers reliably (a single response can contain several, and naive string splitting breaks easily). This implementation reads `response.headersArray()` directly rather than guessing at a combined header string:

```typescript
async function createAuthenticatedContext(
  browser: Browser,
  request: APIRequestContext,
  email: string,
  pass: string
): Promise<BrowserContext> {
  const response = await request.post('https://uat.carecoordinations.com/signin', {
    data: { email, password: pass },
  });
  expect(response.ok()).toBeTruthy();

  const context = await browser.newContext();
  const headers = response.headersArray();
  const setCookieHeaders = headers.filter((h) => h.name.toLowerCase() === 'set-cookie');

  if (setCookieHeaders.length === 0) {
    throw new Error(`No session cookies returned for user: ${email}`);
  }

  const cookiesToInject = setCookieHeaders.map((header) => {
    const [cookieName, cookieValue] = header.value.split(';')[0].split('=');
    return {
      name: cookieName.trim(),
      value: cookieValue.trim(),
      domain: 'uat.carecoordinations.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax' as const,
    };
  });

  await context.addCookies(cookiesToInject);
  return context;
}
```

## Picking a strategy

| Strategy | Use case |
|---|---|
| 1 – UI login | Testing the login form itself |
| 2 – Local fixture | Solo local development |
| 3 – Global setup | CI / parallel test runs |
| 4 – API injection | Maximum speed, login flow not under test |
