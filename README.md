# 🚀 SDET Multi-Platform Automation Portfolio (Web, Mobile, API & Performance)

[![Playwright](https://img.shields.io/badge/Playwright-v1.45+-2e8b57?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Appium](https://img.shields.io/badge/Appium-v2.x-purple?style=for-the-badge&logo=appium&logoColor=white)](https://appium.io/)
[![WebdriverIO](https://img.shields.io/badge/WebdriverIO-v9.x-ea5906?style=for-the-badge&logo=webdriverio&logoColor=white)](https://webdriver.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![K6](https://img.shields.io/badge/Grafana_K6-Performance-7d4cdb?style=for-the-badge&logo=k6&logoColor=white)](https://k6.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized_Env-0db7ed?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-grade, monorepo test automation engineering portfolio demonstrating production-level testing architecture across **Web**, **Mobile Native (Android)**, **REST APIs**, and **Performance/Load Engineering**. Built strictly with **TypeScript**, following modern software engineering principles, decoupled layers, and CI/CD quality gates.

---

## 🏛️ Monorepo Architecture Overview

The repository is divided into isolated subprojects sharing common engineering standards:

```text
.
├── sdet-web-playwright/         # Web E2E, REST API Contracts & Performance Subproject
│   ├── src/
│   │   ├── api/                 # Decoupled REST API Clients (Axios/Playwright request)
│   │   ├── factories/           # Dynamic Test Data Generation (Faker / Object Mother)
│   │   ├── fixtures/            # Custom Playwright Fixtures with Session Injections
│   │   ├── pages/               # Page Object Model (POM) & Component Objects
│   │   ├── schemas/             # Zod Runtime Schema Validation & Contract Enforcement
│   │   └── types/               # Inferred TypeScript Types
│   ├── tests/
│   │   ├── api/                 # Isolated API Functional & Contract Specs
│   │   ├── performance/         # Grafana K6 Stress, Load & Transaction Flows
│   │   ├── snapshots/           # Centralized Visual Regression Baseline Images
│   │   └── ui/                  # Web UI, Hybrid & Visual E2E Specs
│   ├── Dockerfile               # Containerized Environment Definition
│   └── playwright.config.ts     # Parallel, Multi-Browser Matrix Runner
│
├── sdet-mobile-appium/          # Native Mobile Automation Subproject (Android)
│   ├── apps/                    # Target Native Application APKs
│   ├── test/
│   │   ├── helpers/             # W3C Pointer Gestures Utility (Gestures.ts)
│   │   ├── pageobjects/         # Mobile Screen Objects Model (Screen.ts Base Class)
│   │   └── specs/               # Native E2E Specs (Login, Dialogs, Horizontal Carousels)
│   └── wdio.conf.ts             # Appium 2.x Runner with Autonomous Emulator Auto-Boot
│
├── docs/                        # Engineering Knowledge Base & Study Guides
│   └── study-guides/            # Architecture blueprints, W3C Gestures, K6 & CI/CD guides
└── sdet_journey.md              # Living Engineering Logbook & Roadmap Milestones
```

---

## 🎯 Key Architectural Pillars

### 1. Web Hybrid Automation & Session State Injection (`sdet-web-playwright`)
To eliminate slow and flaky UI login/setup routines, the framework leverages a **hybrid automation pattern**:
- **Arrange:** Background API calls seed dynamic users, JWT tokens, carts, and addresses.
- **Inject:** Playwright's `addInitScript` injects auth tokens and session cookies directly into browser storage (`localStorage` & `sessionStorage`).
- **Act & Assert:** Browser navigates directly to target screens (e.g., checkout) with zero redundant UI interactions.
- **Contract Integrity:** Runtime schema validation using **Zod** (`.extend()` patterns) guarantees backend API integrity before UI assertions run.

### 2. Native Mobile Engineering & W3C Pointer Actions (`sdet-mobile-appium`)
- **Appium 2.x & UiAutomator2:** Native Android automation targeting high-performance accessibility IDs (`~selector`) and native `UiSelector` fallbacks.
- **W3C Actions API (Hardware Fidelity):** Replaced legacy, deprecated `touchAction` with the standard W3C Pointer Actions API (`pointerType: 'touch'`). Simulates capacitive touchscreen physics: `move` ➔ `down` ➔ `pause(100)` ➔ `move` ➔ `up` ➔ `perform()`.
- **Device-Agnostic Percentage Math:** All gesture coordinates in `Gestures.ts` are calculated dynamically via viewport bounds (`driver.getWindowRect()`), eliminating hardcoded pixel flakiness across phones, foldables, and tablets.
- **Self-Healing Emulator Lifecycle (`onPrepare`):** The WDIO runner autonomously inspects connected hardware via `adb devices`. If inactive, it spawns the target AVD in detached background mode and continuously polls `sys.boot_completed == 1` before launching workers.
- **Zero Flakiness / No Sleeps:** Eliminated `driver.pause()` anti-patterns in favor of explicit dynamic element polling (`waitForDisplayed()`), ensuring specs execute in under 6 seconds.

### 3. Performance Engineering Gates (`K6`)
- Automated multi-stage stress and spike testing pipelines evaluating system saturation limits.
- Enforces strict SLA thresholds (`p(95) < 1500ms`, error rates `< 5%`) running as quality gates inside CI/CD.

---

## 🛠️ Quickstart & Execution

### 1. Web Automation (`sdet-web-playwright`)
```bash
cd sdet-web-playwright

# Install dependencies
npm install

# Start local test target via Docker
npm run docker:start

# Run complete Web suite (UI, API & Hybrid)
npm test

# Run isolated API contract validation
npm run test:api

# Run K6 performance stress test
npm run test:perf
```

### 2. Mobile Automation (`sdet-mobile-appium`)
```bash
cd sdet-mobile-appium

# Install dependencies
npm install

# Run native E2E test suite (Auto-boots emulator if stopped)
npm test

# Run specific W3C gesture swipe spec
npm run test:swipe
```

---

## 📊 CI/CD Automation & Live Dashboards

All test suites run autonomously inside GitHub Actions with dependency caching, test parallelization, and consolidated artifact reporting deployed to GitHub Pages:

* 🎭 **Playwright Web E2E Report:** [Live Web Dashboard](https://raphaelcarvalho07.github.io/sdet-roadmap-portfolio/)
* ⚡ **Grafana K6 Performance Report:** [Live K6 Metrics](https://raphaelcarvalho07.github.io/sdet-roadmap-portfolio/k6-report.html)

---

## 📚 Technical Documentation & Knowledge Base

Deep-dive architecture study guides are maintained in `/docs/study-guides`:
- [Mobile Automation & W3C Pointer Actions](docs/study-guides/mobile-automation.md)
- [Performance Engineering & K6 Integration](docs/study-guides/performance-engineering.md)
- [CI/CD Pipelines & Merge Reports](docs/study-guides/ci-cd-pipelines.md)
- [API Contract Validation with Zod](docs/study-guides/api-contract-validation.md)
- [Page Object Model & Resilient Locators](docs/study-guides/pom-and-locators.md)
