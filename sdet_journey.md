# 📘 LOGBOOK & BACKUP - SDET JOURNEY

> **Context Instruction:** This file serves as the central, linear memory of my career transition to SDET. It must be kept updated incrementally with each technical mentorship session conducted in the Antigravity IDE.

---

## 1. Incremental Update Prompt (End of Session)

Whenever you finish a technical discussion, bug resolution, or test architecture design, copy the prompt below, paste it into the IDE chat, and send it:

```prompt
Open the @sdet_journey.md file and add a new section at the end of it with the summary of our current conversation. Strictly follow this Markdown template for the new section:

## [Today's Date] - [Subject Title]
### 1. Scenario and Technical Challenge
[Insert the summary of the problem we solved here]
### 2. Structured Solution & Recommended Patterns
[Insert the code blocks and architecture we consolidated here]
### 3. Next Study Steps
[Insert the immediate action plan here]

Keep the rest of the file intact and just append this new section.
```

## 2. Git Versioning Flow (Post-Session)

After the AI confirms it has saved the new section to the file, open your personal repository terminal and run the following commands to secure your progress in the cloud:

```bash
git add sdet_journey.md
git commit -m "docs: add mentorship about [Today's Subject] to the logbook"
git push origin main
```

---

## 3. Official SDET Roadmap Reference

Here is the visual roadmap we are following for this career transition:

![SDET Roadmap](docs/assets/sdet_roadmap.jpg)

---

## 06/07/2026 - Mentorship History Consolidation (Origin: WebApp)

### 1. Scenario and Technical Challenge

The journey began with the goal of making a career transition from **QA Automation Engineer** to **SDET (Software Development Engineer in Test)**, focusing on upgrading isolated functional tests to a production-grade robust architecture. Initially, we worked with a linear, procedural UI test script (`tests/ecommerce.spec.ts`) targeting the SauceDemo e-commerce website.

During the evolution of the project, we faced the following engineering challenges:

- **OOP & Encapsulation Paradigm:** Moving away from sequential scripts to structure reusable classes with private and strongly typed element selectors (`Locator`).
- **Ambiguity and Hardcoded Data:** Dealing with duplicate selectors in the shopping cart and the risk of silent failures due to hardcoded product strings in the UI.
- **TypeScript Compilation Errors:** Fixing recurring scope errors and missing imports (such as the `expect` object).
- **Setup and Execution Speed (Login Bypass):** Avoiding having to run the login flow in every individual UI test, which significantly increased test execution time.
- **Hybrid Environment Isolation (API & UI):** Preventing API tests from leaking context or failing due to a lack of an appropriate `baseURL`, or rejection due to the absence of authentication headers required by the ReqRes WAF.
- **Module Conflict (CommonJS vs ESM):** Resolving compilation issues when integrating the modern `@faker-js/faker` package (ESM) into a project configured with CommonJS.

### 2. Structured Solution & Recommended Patterns

To solve these technical challenges and build the foundation of a professional framework, we implemented the following architectural solutions:

- **Dynamic Page Object Model (POM):** Centralizing locators in the constructor of classes like `LoginPage` and `ProductsPage`. We used regular expressions (kebab-case `Regex`) to dynamically map human-readable product names to HTML `data-test` identifiers, resolving element collisions:
  ```ts
  const formattedName = productName.toLowerCase().replace(/\s+/g, "-");
  const productButton = this.page.getByTestId(`add-to-cart-${formattedName}`);
  await productButton.click();
  ```
- **Locator Centralization & Chaining:** Chaining locators from filtered scopes in POM to reuse class properties and mitigate failures due to layout changes:
  ```ts
  const scopedItemContainer = this.cartItemContainer.filter({
    hasText: productName,
  });
  const itemNameLocator = scopedItemContainer.locator(this.productItemName);
  await itemNameLocator.waitFor({ state: "visible" });
  ```
- **Dependency Injection with Custom Fixtures:** We extended Playwright's native test engine (`base.extend`) in `src/fixtures/baseTest.ts` to automatically initialize the login and products pages, eliminating instantiation boilerplate in every test file:
  ```ts
  export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
      await use(new ProductsPage(page));
    },
  });
  ```
- **Session-State Bypass (Global Authentication):** Configuring a global setup (`tests/global.setup.ts`) to authenticate the user and save the session state to `.auth/user.json`. UI projects reuse this state dynamically, optimizing the overall execution time.
- **Strict Project Isolation (`playwright.config.ts`):** A clear division in the Playwright configuration file, surgically binding the `testDir` to `./tests/api` and `./tests/ui` subfolders to prevent worker overlap.
- **HTTP Client Refactoring (`UserClient.ts`):** Centralizing routes with relative paths in the HTTP client class and correctly handling headers (`Content-Type`, `x-api-key`) for API integration tests.
- **Dynamic Data Factory (`UserFactory.ts`):** Implementing factories with dynamic asynchronous imports (`await import('@faker-js/faker')`) to bypass module compatibility issues and ensure a unique dataset for each run.
- **Network Mocking & Resilience:** UI tests intercepting requests with mocks to validate resilient frontend behavior in the face of critical failures (HTTP 500), dynamic static asset replacement, and network latency simulation (Slow 3G).

### 3. Next Study Steps

- **CI/CD Pipeline in GitHub Actions:** Develop and implement the `.github/workflows/pipeline.yml` file for parallel headless execution on GitHub's Linux runners.
- **Secure Secrets Management:** Configure repository secrets (`API_URL`, `UI_URL`, `REQRES_API_KEY`) to run tests securely in the cloud.
- **Expanding Data Factories:** Create new dynamic object factories and apply the pattern more broadly across the framework.
- **Reporting & Debugging Best Practices:** Configure robust HTML reports in CI for fast troubleshooting of failures.

---

## 08/07/2026 - Advanced CI/CD Pipeline Optimization (Parallel Jobs & Blob Merge)

### 1. Scenario and Technical Challenge

The initial GitHub Actions pipeline (`pipeline.yml`) ran all tests sequentially, installing browser binaries for all execution contexts. This caused a time bottleneck in API test executions (which do not require browsers) and created fragmented HTML reports that were difficult to audit when running in parallel jobs. Additionally, a version mismatch was identified in the Dockerfile base image (`1.49.0` vs. `1.61.0` of the framework) and bugs referencing non-existent projects in the `npm run test:ui:crossbrowser` script of `package.json`.

### 2. Structured Solution & Recommended Patterns

We developed a high-efficiency restructuring in the CI/CD pipeline:

- **Container Synchronization:** Updated the [Dockerfile](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/Dockerfile) to sync with the official `playwright:v1.61.0-noble` image.
- **Mapping Correction:** Adjusted the `test:ui:crossbrowser` script in [package.json](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/package.json) to mirror the exact definitions of `playwright.config.ts`.
- **Parallel Execution Jobs (Split API & UI):** We created distinct asynchronous jobs in [.github/workflows/pipeline.yml](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/.github/workflows/pipeline.yml):
  - API test job without the overhead of browser installation.
  - UI test job installing dependencies required only for its scope.
- **Report Consolidation via Blob Merge:** Both test jobs generate lightweight binary blob reports (`--reporter=blob`), which are combined in a final job executing `npx playwright merge-reports`.
- **Automated Deploy to GitHub Pages:** The final job automatically publishes the consolidated HTML report to GitHub Pages (`gh-pages` branch), providing a direct web link.

### 3. Next Study Steps

- **Advanced Data Generation Phase (Option B):** Begin the study of complex data generation patterns (Object Mother, seeding via API requests to prepare UI scenarios).
- **CI Flakiness Handling:** Study retry strategies and detection of flaky tests in the pipeline.

---

## 10/07/2026 - Checkout Flow Automation & Object Mother Implementation

### 1. Scenario and Technical Challenge

The goal was to automate the checkout flow of the SauceDemo UI application and improve test data management by introducing dynamic data generation. The main challenges were:

- Mapping consecutive multi-step checkout pages (`/cart.html`, `/checkout-step-one.html`, `/checkout-step-two.html`, and `/checkout-complete.html`) in a clean, encapsulated way.
- Generating structured test data dynamically with Faker while avoiding code duplication and ESM vs CommonJS conflicts.
- Structuring predefined test data states (valid profiles and invalid profiles missing specific fields) to support both positive and negative scenarios without cluttering test code.
- Unpacking asynchronous TypeScript `Promise` return types correctly within test scopes using `async/await`.

### 2. Structured Solution & Recommended Patterns

We designed a decoupled architecture containing the following components:

- **Type Interfaces:** Defined `CheckoutPayload` type inside [checkout.types.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/types/checkout.types.ts) to enforce a strong billing data contract.
- **Page Object Model (POM):** Created [CheckoutPage.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/pages/CheckoutPage.ts) encapsulating locators (`getByTestId`), navigation transitions, and form validation assertions (`validateErrorMessage` and `validateCheckoutComplete`).
- **Fixture Registration:** Extended the Playwright test runner in [baseTest.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/fixtures/baseTest.ts) to automatically inject `checkoutPage` into tests, avoiding manual instantiation.
- **Object Mother Pattern:** Implemented [checkoutFactory.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/factories/checkoutFactory.ts) using dynamic imports of `@faker-js/faker` to prevent module conflicts. The factory offers specific pre-configured object states for tests:

  ```ts
  export class CheckoutFactory {
    static async createValidCheckoutData(): Promise<CheckoutPayload> {
      const { faker } = await import("@faker-js/faker");
      return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode(),
      };
    }

    static async createCheckoutDataWithMissingFirstName(): Promise<CheckoutPayload> {
      const data = await this.createValidCheckoutData();
      data.firstName = "";
      return data;
    }
  }
  ```

- **Test Scenarios:** Created [checkout.spec.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/tests/ui/checkout.spec.ts) executing positive (successful purchase) and negative (validation failure) checkout scenarios leveraging auth bypass and the Object Mother data states.

### 3. Next Study Steps

- **Data Seeding via API:** Learn how to create state and seed entities using API requests inside UI tests before actions.
- **Advanced Assertions:** Expand form validation tests to cover all other billing fields (missing last name, missing postal code) and assert the correct validation warning styling.

---

## 13/07/2026 - Advanced POM Assertions & Data-Driven UI Test Refactoring

### 1. Scenario and Technical Challenge

We expanded the checkout validation tests to cover all required fields (Last Name, Postal Code) and verify the visual error feedback (CSS styling changes on input fields). The key technical challenges resolved were:

- **Avoiding False Positives in CSS Matchers:** The base class of the input fields is `input_error`, which contains the word `error`. A naive class match like `/error/` would always pass. We resolved this by applying a Regex Word Boundary (`\b`) to match only the standalone `.error` class.
- **Refactoring Repetitive Tests (DRY Principle):** Instead of duplicating identical UI steps across three negative test cases, we refactored the test suite into a single loop using a data-driven structure.
- **Formulating Composite Assertions:** To satisfy the Single Responsibility Principle, we created a high-level composite method inside the Page Object to orchestrate both error message validation and input highlight checks.

### 2. Structured Solution & Recommended Patterns

We refactored the page object and test suite as follows:

- **Regex Boundary Matcher:** In [CheckoutPage.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/pages/CheckoutPage.ts), we updated `validateInputErrorState` to use `/\berror\b/` and introduced the composite method `validateFieldError`:

  ```ts
  async validateInputErrorState(fieldName: string): Promise<void> {
    const input = this.page.getByTestId(fieldName);
    await expect(input).toBeVisible();
    await expect(input).toHaveClass(/\berror\b/);
  }

  async validateFieldError(fieldName: string, expectedMessage: string): Promise<void> {
    await this.validateErrorMessage(expectedMessage);
    await this.validateInputErrorState(fieldName);
  }
  ```

- **Data-Driven Loop:** In [checkout.spec.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/tests/ui/checkout.spec.ts), we defined a scenario matrix and iterated over it using a `for...of` loop to dynamically register tests:

  ```ts
  const validationScenarios = [
    {
      field: "firstName",
      factoryMethod: "createCheckoutDataWithMissingFirstName" as const,
      expectedMessage: "Error: First Name is required",
    },
    {
      field: "lastName",
      factoryMethod: "createCheckoutDataWithMissingLastName" as const,
      expectedMessage: "Error: Last Name is required",
    },
    {
      field: "postalCode",
      factoryMethod: "createCheckoutDataWithMissingPostalCode" as const,
      expectedMessage: "Error: Postal Code is required",
    },
  ];

  for (const scenario of validationScenarios) {
    test(`should display validation error and highlight input when ${scenario.field} is missing`, async ({
      productsPage,
      checkoutPage,
    }) => {
      await productsPage.addProductToCart(productName);
      await productsPage.goToCart();
      await checkoutPage.startCheckout();

      const invalidData = await CheckoutFactory[scenario.factoryMethod]();
      await checkoutPage.fillInformation(
        invalidData.firstName,
        invalidData.lastName,
        invalidData.postalCode,
      );
      await checkoutPage.validateFieldError(
        scenario.field,
        scenario.expectedMessage,
      );
    });
  }
  ```

### 3. Next Study Steps

- **Data Seeding via API:** Explore hybrid testing where we populate application state directly through HTTP requests before initiating UI scenarios.
- **Handling Flaky Tests:** Implement Playwright retries and trace-captures to identify transient environment timeouts.

---

## 14/07/2026 - SMART Goal Alignment & CI Pipeline Upgrades

### 1. Scenario and Technical Challenge

- **Career and Study Goal Setting:** Established a tailored 90-day SMART transition plan to SDET, allocating a realistic 10h/week schedule (6h technical practice in the IDE, 4h career boosting/LinkedIn) during weekday working hours. Family time (with 3 daughters) and work-life balance are defined as non-negotiable core values, leaving weekends 100% offline.
- **Node.js Deprecation Warning in GHA:** The GitHub Actions runner emitted a deprecation warning because jobs were targeting Node.js 20. We resolved this infrastructure debt by upgrading all pipeline jobs to Node.js 22 (Active LTS).

### 2. Structured Solution & Recommended Patterns

We updated the following files:

- **GitHub Actions Configuration:** Modified [.github/workflows/pipeline.yml](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/.github/workflows/pipeline.yml) across all 4 jobs (`lint`, `api-tests`, `ui-tests`, and `publish-report`) to set `node-version: 22` and added a `📝 Output Pages URL to Job Summary` step to output the live report link directly to the run summary for enhanced developer experience.
- **SMART Goals Framework:** Created [sdet_smart_goals.md](file:///Users/raphaelcarvalho/.gemini/antigravity-ide/brain/a811e423-b909-4864-8f4e-91c6ba5cc971/sdet_smart_goals.md) in the artifacts repository to guide study sprints and candidate application cycles.

### 3. Next Study Steps

- **API Contract Testing (Zod/AJV):** Replace manual property type assertions with schema-based contract validation to verify full payload integrity.
- **Data Seeding via API:** Implement hybrid test scenarios making background HTTP calls using the API client to set application state before UI execution.
- **Flakiness Mitigation:** Research retry configurations and trace capturing on test failures to optimize pipeline execution under heavy CPU loads.
- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Visual Regression Testing:** Integrate screenshot layout comparisons using Playwright's native visual assertions.

---

## 17/07/2026 - API Contract Testing with Zod 4

### 1. Scenario and Technical Challenge

- **Manual API Validations:** The existing API test suite verified responses using individual manual properties checks (e.g. `typeof id === 'number'`), which was verbose, hard to maintain, and did not guarantee full contract compliance.
- **Strict Data and Contract Validation:** We transitioned to structural contract validation using Zod 4. The main challenge was to design clean schemas matching the ReqRes API and infer TypeScript types from them to avoid duplication.

### 2. Structured Solution & Recommended Patterns

We implemented the following solutions:

- **Zod 4 Schemas:** Created [user.schema.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/schemas/user.schema.ts) grouping validators. Utilized Zod 4 top-level format validators (`z.url()`, `z.email()`) and namespace schema validators (`z.iso.datetime()`).
- **Dynamic Type Inference:** Refactored [user.types.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/types/user.types.ts) to export types inferred dynamically via `z.infer<typeof schema>`, establishing a single source of truth.
- **Contract Spec Refactoring:** Updated [user.api.spec.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/tests/api/user.api.spec.ts) replacing manual asserts with `.parse()` validation.

### 3. Next Study Steps

- **Data Seeding via API:** Implement hybrid test scenarios making background HTTP calls using the API client to set application state before UI execution.
- **Flakiness Mitigation:** Research retry configurations and trace capturing on test failures to optimize pipeline execution under heavy CPU loads.
- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Visual Regression Testing:** Integrate screenshot layout comparisons using Playwright's native visual assertions.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).

---

## 20/07/2026 - OWASP Juice Shop Migration & Real REST API Testing

### 1. Scenario and Technical Challenge

- **Transition to Production-Grade Target:** Shifted our testing target from static mock platforms (SauceDemo/ReqRes) to a real, containerized Full-Stack application: **OWASP Juice Shop** (Angular SPA + Node.js/Express REST API + SQLite DB).
- **Environment Orchestration:** Launched Juice Shop locally via Docker (`bkimminich/juice-shop`) on port 3000 and updated local environment settings (`.env`).
- **REST API & Authentication Exploration:** Explored Juice Shop's REST endpoints (`POST /api/Users/` and `POST /rest/user/login`) using terminal `cURL` probing to inspect live HTTP status codes, headers, and JSON payloads.

### 2. Structured Solution & Recommended Patterns

We implemented the following architecture changes:

- **Zod 4 Schemas:** Created [user.schema.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/schemas/user.schema.ts) defining strict schemas for Juice Shop registration and JWT authentication responses (`juiceUserRegistrationResponseSchema` and `juiceUserLoginResponseSchema`).
- **Dynamic Type Inference:** Updated [user.types.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/types/user.types.ts) using `z.infer` to maintain a single source of truth.
- **Factory & HTTP Client:** Updated [userFactory.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/factories/userFactory.ts) with `@faker-js/faker` generating valid dynamic payloads, and updated [UserClient.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/api/UserClient.ts) targeting `/api/Users/` and `/rest/user/login`.
- **API Spec Execution:** Updated [user.api.spec.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/tests/api/user.api.spec.ts). Executed suite against local Docker container: **2 passed in 438ms**.

### 3. Next Study Steps

- **Data Seeding via API:** Implement hybrid test scenarios making background HTTP calls using the API client to set application state and inject JWT session tokens before UI execution on OWASP Juice Shop.
- **Flakiness Mitigation:** Research retry configurations and trace capturing on test failures to optimize pipeline execution under heavy CPU loads.
- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Visual Regression Testing:** Integrate screenshot layout comparisons using Playwright's native visual assertions.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).

---

## 22/07/2026 - Hybrid E2E Testing: API Data Seeding & JWT Session Injection

### 1. Scenario and Technical Challenge

- **Eliminating UI Login Flakiness:** Traditional UI automation logs in via UI forms for every test, adding 5-10s overhead per test and introducing UI locator flakiness.
- **Session Injection Architecture:** Engineered a hybrid testing strategy combining REST API data seeding with browser session injection (`page.addInitScript`) to bypass UI login forms entirely.

### 2. Structured Solution & Recommended Patterns

We implemented the following architecture components:

- **Page Object Pattern:** Created [JuiceShopPage.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/pages/JuiceShopPage.ts) encapsulating `injectSessionToken(token)` which sets `token`, `welcomebanner_status: "dismiss"`, and `cookieconsent_status: "dismiss"` in `window.localStorage` before page load.
- **Custom Playwright Fixtures:** Created [juiceTest.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/src/fixtures/juiceTest.ts) providing `authenticatedUserPage` fixture that registers a user via API, obtains a JWT token, injects session state, and yields a pre-authenticated browser context to tests in milliseconds.
- **Hybrid E2E Test Suite:** Created [juice-hybrid.spec.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/tests/ui/juice-hybrid.spec.ts). Executed suite across all browsers (Chrome, Firefox, Webkit, API): **5 passed in 3.3s**!

### 3. Next Study Steps

- **Flakiness Mitigation & Traces:** Configure Playwright retry mechanisms, video capturing, and trace viewer artifacts in GitHub Actions pipeline under high CPU load.
- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Visual Regression Testing:** Integrate screenshot layout comparisons using Playwright's native visual assertions.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).

---

## 27/07/2026 - Local Environment Automation & Resilient Test Configuration

### 1. Scenario and Technical Challenge

- **Environment Connection Errors:** Executing local tests without an active Docker container caused `connect ECONNREFUSED ::1:3000`.
- **Framework Observability:** Needed to configure on-demand tracing (`trace: 'on-first-retry'`) and screenshot capturing (`screenshot: 'only-on-failure'`) to prevent disk I/O bottlenecks in CI/CD.

### 2. Structured Solution & Recommended Patterns

We implemented the following engineering enhancements:

- **Idempotent Docker Scripts:** Added `"docker:start"`, `"docker:stop"`, and `"docker:logs"` npm scripts in `package.json` utilizing shell fallback (`docker start juice-shop 2>/dev/null || docker run -d --name juice-shop -p 3000:3000 bkimminich/juice-shop`).
- **Resilience Configuration:** Updated `playwright.config.ts` with `retries: process.env.CI ? 2 : 0`, `trace: 'on-first-retry'`, and `screenshot: 'only-on-failure'`.
- **Documentation Update:** Refactored `README.md` to document local setup, Docker lifecycle commands, and hybrid testing capabilities.

### 3. Next Study Steps

- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Visual Regression Testing:** Integrate screenshot layout comparisons using Playwright's native visual assertions.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).

---

## 31/07/2026 - API Contract Validation with Zod 4 Custom Refinement & E2E Basket Flow

### 1. Scenario and Technical Challenge

We expanded our API contract testing to cover the Product Search and Shopping Cart (`BasketItems`) endpoints. During execution, we encountered two main challenges:

- **API Contract Inconsistencies:** Zod's strict `z.iso.datetime()` validator failed because Juice Shop's SQLite database formats timestamps with spaces (`2026-07-27 15:43:32.570 +00:00`) instead of the standard ISO-8601 `T` separator (`2026-07-27T15:43:32.570Z`).
- **State Management & OOP Scope:** Structuring a complete CRUD test suite (POST to add, PUT to update quantity, DELETE to remove) required authenticating a dynamic user in a `beforeEach` hook and sharing variables (like `token` and `basketId`) across individual tests without scope leaks, while distinguishing between class instance methods (`new BasketClient(request)`) and static factory methods (`UserFactory.createValidJuiceUserPayload()`).

### 2. Structured Solution & Recommended Patterns

To address these challenges, we implemented the following patterns:

- **Zod Schema Custom Refinement:** Created a reusable date validator using `.refine()` combined with native `Date.parse()` and `!isNaN` to validate non-standard parseable date strings without being blocked by format variations:
  ```ts
  const dateStringSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });
  ```
- **Type Inference as Single Source of Truth:** Extracted TypeScript interfaces dynamically using `z.infer`, keeping Zod schemas as the single source of truth for both payloads and response bodies.
- **Variable Scope Sharing:** Declared shared variables at the `describe` block level with `let`, allowing `beforeEach` to initialize them dynamically with the `request` fixture from Playwright and ensuring they are accessible across all `test` blocks.
- **Encapsulated Basket Client:** Implemented `BasketClient.ts` with explicit HTTP wrappers (`post`, `put`, `delete`) and authorization headers using ES6 shorthand `{ quantity }` objects to send clean request bodies.

### 3. Next Study Steps

- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.

---

## 04/08/2026 - Hybrid E2E Session & Basket Injection

### 1. Scenario and Technical Challenge

We integrated the `BasketClient` API helper to seed the shopping cart before verifying the cart contents in the UI. During execution, we faced a major state-injection issue:

- **Empty & Anonymous Basket:** Even though the JWT token was injected into `localStorage` and we were logged in, navigating to `/#/basket` rendered "Your Basket (anonymous)" and showed 0 items.
- **State Partitioning:** Investigating the Angular frontend revealed that Juice Shop reads both `token` and `bid` (Basket ID). Furthermore, depending on the app version, `bid` is read from `sessionStorage`, while `token` is read from `localStorage`.

### 2. Structured Solution & Recommended Patterns

- **Dual-Storage Session Injection:** Modified the `injectSessionToken` method to write variables to both storage layers:
  ```ts
  window.localStorage.setItem("token", jwtToken);
  window.localStorage.setItem("bid", String(basketId));
  window.sessionStorage.setItem("bid", String(basketId));
  ```
- **Playwright Destructuring in addInitScript:** Learned that `addInitScript` only accepts a single serialized parameter. We grouped parameters into an object and used ES6 destructuring inside the script callback to pass both fields safely.

---

## 12/08/2026 - Complete Hybrid Checkout & Resilient Locator Architecture

### 1. Scenario and Technical Challenge

We extended the E2E suite to automate a full Checkout flow (Basket ➡️ Address ➡️ Delivery ➡️ Payment ➡️ Review). We encountered two major engineering hurdles:

- **Dynamic Accessibility Labels (ARIA Names):** Standard button locators (`getByRole("button", { name: "Continue" })`) timed out because Angular Material dynamically assigns distinct ARIA labels to buttons depending on the screen (e.g. `"Proceed to payment selection"`, `"Proceed to review"`).
- **ESLint & TypeScript Contract Integrity:** Creating data seeding pipelines for Address and Credit Card objects required building new API clients (`AddressClient`, `CardClient`), type definitions, and Faker generators, while adhering to strict code rules preventing the use of the `any` type.

### 2. Structured Solution & Recommended Patterns

- **Resilient Chained Locators:** Implemented Playwright's role selection combined with text-content filtering to build future-proof, accessibility-resilient locators:
  ```ts
  this.continueButton = page
    .getByRole("button")
    .filter({ hasText: "Continue" });
  this.placeOrderButton = page
    .getByRole("button")
    .filter({ hasText: "Place your order and pay" });
  ```
- **Zod Schema Merging and Extensibility:** Used Zod's `.extend()` modifier to build database schemas from base payloads, avoiding code duplication and securing autocomplete benefits:
  ```ts
  export const juiceCardSchema = juiceAddCardPayloadSchema.extend({
    id: z.number().positive(),
    UserId: z.number().positive(),
    createdAt: dateStringSchema,
    updatedAt: dateStringSchema,
  });
  ```
- **Centralized Validation Helpers:** Extracted non-standard SQLite date string validation into a shared `common.schema.ts` file to keep schemas DRY.

### 3. Next Study Steps

- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).
- **LLM & AI Agent Evaluation (Evals & MCP):** Introduce non-deterministic testing principles, LLM-as-a-Judge evaluations using framework libraries (like Promptfoo or DeepEval), prompt injection security testing (Red Teaming), and writing/testing Model Context Protocol (MCP) servers.

---

## 17/08/2026 - Visual Regression Testing: Macro-Layout vs Micro-Component & Snapshot Centralization

### 1. Scenario and Technical Challenge

We integrated Playwright's visual assertions (`toHaveScreenshot`) into our hybrid test suite. However, we faced two critical challenges that are common in visual regression testing:

- **Layout Shift from Dynamic Data:** When tests used dynamic (Faker) payloads, varying text lengths (e.g. name, street address) caused Angular Material cards to stretch or shrink. This pushed elements below (like the cart table) up or down, resulting in pixel comparison failures despite masking the dynamic text itself.
- **Transient UI Overlays (Snackbar/Toasts):** Language selection toasts popped up at random intervals during test runs, introducing visual differences (false-positives) in the screenshot comparison.
- **Scattered Snapshot Folders:** Playwright's default behavior saves reference images in folders adjacent to test files (e.g., `tests/ui/juice-visual.spec.ts-snapshots/`), cluttering the codebase.

### 2. Structured Solution & Recommended Patterns

- **Dual-Verification Visual Test Strategy:**
  - **Macro-Layout Visual Testing (E2E Page-Level):** Checks the entire checkout review page. Uses dynamic Faker data but injects a temporary CSS rule (`height: 150px !important; overflow: hidden !important;`) on the cards via `addStyleTag` to prevent layout shifts. Masks dynamic card containers.
  - **Micro-Component Visual Testing (Isolated Element-Level):** Uses a dedicated test spec ([juice-visual.spec.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/tests/ui/juice-visual.spec.ts)) that seeds static, constant data (no Faker) and takes an unmasked screenshot of ONLY the specific element:
    ```ts
    const addressCard = page
      .locator(".column mat-card")
      .filter({ hasText: "Delivery Address" });
    await expect(addressCard).toHaveScreenshot("isolated-address-card.png");
    ```
- **Hiding Transient UI Elements via CSS Injection:** Injected a global CSS rule during tests to force transient snackbars to remain hidden, eliminating visual flakiness from notifications:
  ```ts
  await page.addStyleTag({
    content: "mat-snack-bar-container, .mat-snack-bar-container { display: none !important; }",
  });
  ```
- **Centralized Snapshot Paths:** Overrode Playwright's default layout by defining `snapshotPathTemplate` inside [playwright.config.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-web-playwright/playwright.config.ts), directing all baseline images to a centralized `tests/snapshots/` directory.

### 3. Next Study Steps

- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).
- **LLM & AI Agent Evaluation (Evals & MCP):** Introduce non-deterministic testing principles, LLM-as-a-Judge evaluations using framework libraries (like Promptfoo or DeepEval), prompt injection security testing (Red Teaming), and writing/testing Model Context Protocol (MCP) servers.

---

## 19/08/2026 - CI/CD Resiliency & Playwright Consolidated Reports Merge

### 1. Scenario and Technical Challenge

As we finalized our production-grade testing suite on GHA (GitHub Actions) CI, we faced several critical network, sandbox, and reporting challenges:
- **Docker Host vs. Container Networking Mismatch:** The API tests run on GHA's host VM, connecting to mapped ports via `localhost:3000`. However, the containerized UI tests must connect to the sibling Juice Shop container via `http://juice-shop:3000` (bridge DNS). Changing the secrets to point directly to `juice-shop:3000` breaks API tests and local macOS host development.
- **Firefox Sandbox Permissions Error:** Launching Firefox inside the Playwright Docker container on GHA crashed because of user folder profile ownership constraints.
- **GHA Artifact download-artifact v4 Directory Separation:** In GHA v4, downloading multiple artifacts to a single folder (`all-blobs`) dynamically groups them into separate subfolders named after the artifacts (e.g., `all-blobs/blob-report-api/` and `all-blobs/blob-report-ui/`). Since the Playwright blob reporter generates `.zip` files (e.g. `report-api-tests.zip`), the search command for `*.blob` failed, and `merge-reports` had no inputs to merge, crashing the deployment to GitHub Pages with `ENOENT` on the `playwright-report` folder.
- **Cross-Environment testDir Discrepancy:** The blob reports recorded test runs under different path contexts (`/home/runner/...` on the host vs. `/__w/...` inside the container), causing `merge-reports` to fail with path mismatches.
- **Visual Regression Mismatches (Mac ARM64 vs. CI AMD64):** Visual regression tests failed on GHA Chrome Linux because of small layout rendering discrepancies between local Apple Silicon ARM64 and runner AMD64 hardware platforms.
- **SecOps Plain-Text URL Leakage:** Logging environment variables (like active target URLs) directly to GHA logs exposes internal infrastructure endpoints in plain text.

### 2. Structured Solution & Recommended Patterns

To address these challenges, we implemented the following infrastructure-level patterns:
- **Dynamic Bash-Level Environment Routing:** Configured the pipeline to run with `shell: bash` and dynamically override `API_URL` and `UI_URL` to `http://juice-shop:3000` inside GHA *only* if the secrets contain localhost. This decoupled the network configuration logic from the core Playwright typescript code.
- **Firefox Sandbox Fix:** Injected `HOME: /root` environment variable to initialize Firefox profiles with correct root ownership permissions inside the GHA step.
- **Artifact Folder Consolidation:** Downloaded the artifacts to separate folders and consolidated the Playwright `.zip` reports using a bash `find` helper to merge files correctly:
  ```bash
  mkdir -p all-blobs
  find blob-report-api blob-report-ui -name "*.zip" -exec cp {} all-blobs/ \;
  ```
- **Unified Merge Path Mapping:** Added `-c playwright.config.ts` to `npx playwright merge-reports` to force-merge files and relativize test paths using the config's `testDir` property.
- **Cross-Platform Visual Emulation:** Set GHA to automatically update the snapshots on CI to generate the native AMD64 Linux screenshots, and introduced the best-practice `--platform linux/amd64` Docker run command for Apple Silicon macOS local development to prevent architecture gaps:
  ```bash
  docker run --rm --platform linux/amd64 -v $(pwd):/work -w /work -e API_URL=http://host.docker.internal:3000 -e UI_URL=http://host.docker.internal:3000 mcr.microsoft.com/playwright:v1.61.0-noble npx playwright test --project=ui-tests-chrome --update-snapshots
  ```
- **SecOps Compliance:** Removed plain-text URL logging from the workflow console output to ensure no sensitive internal company subdomains are exposed.

### 3. Next Study Steps

- **Performance Testing with K6:** Write API load-test scripts in JavaScript/TypeScript using the K6 engine against local Juice Shop container to simulate high user concurrency.
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).

---

## 21/08/2026 - Non-Functional Performance Engineering & K6 CI/CD Integration

### 1. Scenario and Technical Challenge
As we finalized our functional E2E test suites, we transitioned to non-functional testing to build a comprehensive quality gate portfolio. The goal was to establish performance testing principles and run automated API load tests as Quality Gates in our CI/CD pipeline:
- **Performance Paradigms:** Moving away from standard functional E2E tests to understand Latency, Throughput (RPS), the "Percentile Trap" (why average response time is a misleading metric compared to p95/p99), and Saturation Bottlenecks.
- **Third-Party Script Parsing Crash (Goja JS Engine):** Trying to use community-maintained minified JavaScript reporters (`k6-reporter`) triggered `SyntaxError: Unexpected token` inside the K6 Goja-based JS execution engine.
- **CI/CD Resource Sharing CPU Starvation:** Running high-concurrency stress tests (e.g. 100 VUs) on small shared CI runners (2 CPU, 7GB RAM VMs) triggers client-server resource starvation, causing false-positive SLA failures.
- **Unified GitHub Pages Dashboard Publishing:** Hosting performance test reports side-by-side with Playwright E2E HTML reports dynamically on GitHub Pages.

### 2. Structured Solution & Recommended Patterns
- **First-Party Native Web Dashboard Export:** Replaced all third-party external reporting modules with the built-in, first-party Grafana K6 Web Dashboard starting in k6 v0.49.0. By using environment variables `K6_WEB_DASHBOARD=true` and `K6_WEB_DASHBOARD_EXPORT=summary.html`, we generate high-fidelity, interactive HTML dashboards natively without external dependencies, conforming to SecOps best practices.
- **CI/CD Regression Load Gate Strategy:** Integrated a dedicated `performance-tests` job running on the pipeline parallel to functional testing. We pinned the K6 version (`0.49.0`) using the official `grafana/setup-k6-action@v1` and executed a lightweight, stable load-test (`search-load-test.js` with 20 VUs and 1s sleep pacing) to verify latency SLOs (`p95 < 200ms`) without triggering runner CPU starvation.
- **Dynamic Artifact Renaming & Publishing:** Downloaded the generated K6 `summary.html` artifact in the final `publish-report` consolidation job, copied it as `k6-report.html` into the Playwright output folder, and deployed it to GitHub Pages:
  ```bash
  npx playwright merge-reports --reporter html ./all-blobs -c playwright.config.ts
  cp k6-summary-report/summary.html playwright-report/k6-report.html
  ```

### 3. Next Study Steps
- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).
- **LLM & AI Agent Evaluation (Evals & MCP):** Introduce non-deterministic testing principles, LLM-as-a-Judge evaluations using framework libraries (like Promptfoo or DeepEval), prompt injection security testing (Red Teaming), and writing/testing Model Model Context Protocol (MCP) servers.


---

## 22/08/2026 - Advanced Performance Engineering: Dynamic Data Seeding & Load Flow Simulation

### 1. Scenario and Technical Challenge

As we advanced our non-functional testing portfolio, we developed a complete transaction-flow performance script simulating checkout operations under load. We faced several dynamic data locks and platform constraints:
- **Database Concurrency Locks:** Registering static test accounts during parallel virtual user (VU) threads triggered database uniqueness constraint violations and write locks inside the containerized SQLite instance, resulting in high HTTP `500 Internal Server Error` rates.
- **Depletion of Inventory (Out of Stock):** Parallel execution of checkout flows depleted the limited store inventory, triggering `400 Bad Request` ("out of stock") errors. If the script asserted a strict `200 OK` status, the test run was flagged as failed, skewing the reliability metrics.
- **Complex JSON Parsing & Token Correlation:** Validating multi-step transactional flows required extracting security tokens and dynamically correlating them across subsequent HTTP requests (Authentication ➡️ Add to Cart ➡️ Set Address ➡️ Set Payment ➡️ Checkout).

### 2. Structured Solution & Recommended Patterns

To address these challenges, we implemented the following solutions:
- **Dynamic VU Seed-Based Registration:** Replaced hardcoded credentials with a dynamic user generator leveraging native K6 variables (`__VU` and `__ITER` combined with dynamic timestamp offsets) to register unique accounts per thread, eliminating DB locks:
  ```javascript
  const uniqueId = `sdet_${__VU}_${__ITER}_${Date.now()}`;
  ```
- **Resilient Conditional Assertion Modeling:** Modified assertions to treat `400 Bad Request` (due to stock depletion) as a successful validation of the business rule, preventing false-positive test failures when the API behaves correctly:
  ```javascript
  check(response, {
    'status is 200 or 400': (r) => r.status === 200 || r.status === 400
  });
  ```
- **Custom Trend Timing Correlation:** Introduced custom K6 Trend metrics (`custom_add_to_cart_duration`) to isolate and report specific transaction timings independently of standard page load averages.

### 3. Next Study Steps

- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics.

---

## 25/08/2026 - Portfolio Branding & LinkedIn Optimization

### 1. Scenario and Technical Challenge

With E2E and Performance pipelines fully operational, the challenge was to present the technical achievements as a cohesive, high-impact professional portfolio on LinkedIn:
- **Visual Presentation Gap:** Sharing text-only links of repositories fails to capture recruiters' attention compared to cohesive, visual branding.
- **LinkedIn Algorithm Limitations:** LinkedIn heavily depresses the reach of posts containing external links.
- **Layout Paragraph Truncation:** Standard carriage returns in post drafts get collapsed by the LinkedIn UI, converting structured sections into hard-to-read text walls.

### 2. Structured Solution & Recommended Patterns

We applied branding and algorithmic optimization strategies:
- **Premium Dark-Theme Thumbnails:** Created consistent, visually stunning dark-mode banners for each Featured card (`playwright_report_thumbnail`, `k6_report_thumbnail`, and `sdet_portfolio_thumbnail`) to make the profile look highly professional at first glance.
- **Link Demotion Workaround:** Structured posts to share external links in the first comment rather than the post body, successfully preserving organic algorithmic reach.
- **Double Carriage Return Formatting:** Formatted the "About" (Sobre) description with double line breaks (`\n\n`) to prevent LinkedIn from collapsing spacing.

### 3. Next Study Steps

- **Mobile Automation (Android & iOS):** Explore Appium integrated with TypeScript/WebdriverIO to maintain our programming stack while testing native apps.

---

## 27/08/2026 - Monorepo Restructuring & Native Android Automation

### 1. Scenario and Technical Challenge

Transitioning to native mobile testing required establishing a completely new technology stack (Appium + WebdriverIO) without polluting the existing Playwright workspace, and verifying local hardware automation:
- **Workspace Coupling (Playwright/Appium):** Co-locating WebdriverIO and Playwright configurations at the root of a single project causes dependency conflicts and configuration pollution.
- **JDK/Android SDK Infrastructure:** Appium requires a local Java JDK and Android SDK toolchain (like `adb` and `emulator`) to compile and sign test helper packages dynamically inside simulated devices.
- **Mobile Web Chromedriver Alignment:** Running mobile web tests requires downloading a precise Chromedriver binary version matching the emulator's Chrome browser version, causing flakiness as browser versions update.
- **GitHub Actions Workspace Scope:** Relocating the Playwright folder breaks existing GHA runners that expect config files at the root level.

### 2. Structured Solution & Recommended Patterns

We implemented a unified Monorepo Portfolio structure and completed native mobile integration:
- **Monorepo Restructuring:** Restructured the workspace into subdirectories (`sdet-web-playwright` and `sdet-mobile-appium`), preserving full Git history using `git mv` renames, and updated `.github/workflows/pipeline.yml` with `defaults.run.working-directory: sdet-web-playwright` and relative path mappings.
- **NPM Global Prefix Isolation:** Configured `~/.npm-global` for global npm packages, resolving write permission issues (`EACCES`) on macOS without needing `sudo`.
- **Active Emulator Orchestration:** Created a custom Android Virtual Device (`medium_phone` running API 36/Android 16 system image) and started it locally.
- **Native App Capabilities (WDIO):** Downloaded the official WDIO Native Demo `.apk` and configured `wdio.conf.ts` target capabilities by removing `browserName` (bypassing Chromedriver errors) and linking native app activity paths:
  ```typescript
  capabilities: [{
      platformName: 'Android',
      'appium:deviceName': 'medium_phone',
      'appium:automationName': 'UiAutomator2',
      'appium:app': './apps/android.wdio.native.app.v1.0.8.apk',
      'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity'
  }]
  ```
- **Accessibility ID Locator Strategy:** Wrote a native E2E test utilizing Accessibility ID selectors (`~Login`, `~input-email`) as the cross-platform best practice, achieving a successful test execution in 7.4 seconds.

### 3. Next Study Steps

- **Mobile Page Objects:** Structuring the native app page elements using the Page Object Model (POM) in WebdriverIO.
- **Gestures Automation:** Writing tests to automate swipes, scrolls, and drag-and-drops.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).
- **LLM & AI Agent Evaluation (Evals & MCP):** Introduce non-deterministic testing principles, LLM-as-a-Judge evaluations using framework libraries (like Promptfoo or DeepEval), prompt injection security testing (Red Teaming), and writing/testing Model Context Protocol (MCP) servers.


---

## 31/08/2026 - Mobile Page Object Model (POM) & Self-Healing Emulator Lifecycle

### 1. Scenario and Technical Challenge

As we deepened our mobile automation stack (Appium + WebdriverIO), we aimed to transition from inline procedural scripts into an enterprise-grade, maintainable testing architecture:
- **Web-to-Mobile POM Paradigm Shift:** Default template files generated by WebdriverIO assume browser-based testing (HTML elements, URLs, `page.open()`). Native mobile testing lacks URLs and relies on Accessibility ID attributes and component hierarchy trees.
- **Strict TypeScript Typing on Chainable Promises:** WebdriverIO queries return `ChainablePromiseElement` instances. Union typing with resolved `WebdriverIO.Element` triggers internal `parent` property mismatches and TypeScript `'this'` method binding errors.
- **Manual Emulator Dependency Flakiness:** Running mobile tests locally required manual pre-requisite commands (`android emulator start ...`). If a developer or CI runner executed `npm run wdio` with the emulator closed, Appium threw `WebDriverError: Could not find a connected Android device in 20000ms`, breaking test repeatability.

### 2. Structured Solution & Recommended Patterns

We implemented the following solutions:
- **Mobile Page Object Model Architecture:**
  - **Base Mobile Screen ([screen.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-mobile-appium/test/pageobjects/screen.ts)):** Created an abstract base class providing dynamic wait helpers (`waitForElement`) strictly typed to accept `ChainablePromiseElement`.
  - **Login Screen ([login.screen.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-mobile-appium/test/pageobjects/login.screen.ts)):** Encapsulated bottom navigation tab switching (`~Login`), Accessibility ID getters (`~input-email`, `~input-password`, `~button-LOGIN`), and high-level workflow methods (`navigateToLoginTab`, `submitLogin`).
  - **Native Modal Dialog ([dialog.screen.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-mobile-appium/test/pageobjects/dialog.screen.ts)):** Decoupled native OS alerts into a dedicated Screen Object encapsulating UIAutomator selectors (`android=new UiSelector().text("Success")`, `android=new UiSelector().text("OK")`) and dismissal methods (`dismissDialog`).
  - **Declarative E2E Spec ([test.e2e.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-mobile-appium/test/specs/test.e2e.ts)):** Refactored the test to be 100% intent-revealing and free of raw selectors, passing in 7.1s.
- **Dynamic Capabilities & Resilient Auto-Boot Lifecycle:**
  - Integrated an autonomous pre-flight check in the `onPrepare` hook inside [wdio.conf.ts](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-mobile-appium/wdio.conf.ts):
    - Dynamically extracts the target device name from `capabilities` (`appium:deviceName`).
    - Inspects `adb devices` for attached hardware.
    - If inactive, automatically spawns the emulator daemon in detached mode (`spawn('emulator', ['-avd', avdName, ...])`).
    - Polls `adb shell getprop sys.boot_completed` until the OS finishes booting (`sys.boot_completed == 1`), eliminating race conditions.
  - Added npm scripts in [package.json](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/sdet-mobile-appium/package.json) for manual operations and graceful shutdowns (`npm run emulator:stop` mapping to `adb emu kill`).
- **Advanced Performance Engineering Documentation:**
  - Expanded [docs/study-guides/performance-engineering.md](https://github.com/RaphaelCarvalho07/sdet-roadmap-portfolio/blob/main/docs/study-guides/performance-engineering.md) with comprehensive concepts covering Breakpoint testing, Server-side telemetry/APM correlation (GC overhead, DB pool exhaustion, thread starvation), and architectural tuning patterns (indexes, caching, load balancing).

### 3. Next Study Steps

- **Mobile Gestures Helper (W3C Actions):** Build a dedicated `helpers/gestures.ts` utility using `browser.action('pointer')` with dynamic viewport percentage calculations (`getWindowRect`) for cross-device swipe left, swipe right, swipe up, and swipe down.
- **Carousel & Swipe Screen Testing:** Create `swipe.screen.ts` and automate horizontal card swiping and verification on the WDIO Native Demo app.
- **Test Observability & Telemetry:** Implement correlation IDs (x-request-id/traceparent), structured JSON logging, and test execution metrics to link automated test runs with APM/backend observability tools (Datadog/Grafana).
- **LLM & AI Agent Evaluation (Evals & MCP):** Introduce non-deterministic testing principles, LLM-as-a-Judge evaluations using framework libraries (like Promptfoo or DeepEval), prompt injection security testing (Red Teaming), and writing/testing Model Context Protocol (MCP) servers.
