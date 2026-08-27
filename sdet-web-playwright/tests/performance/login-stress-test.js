import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * K6 Stress Testing Options
 * Ramps up aggressively to simulate peak load and find the system saturation limits.
 */
export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp-up 1: 0 to 50 users
    { duration: '10s', target: 50 },  // Plateau 1: Hold 50 users constant
    { duration: '10s', target: 100 }, // Ramp-up 2: Push system limits to 100 users (Stress)
    { duration: '15s', target: 100 }, // Plateau 2: Hold 100 users to analyze saturation
    { duration: '5s', target: 0 },   // Ramp-down: Teardown users
  ],
  thresholds: {
    // Under stress, we tolerate up to 5% failures before failing the test run
    http_req_failed: ['rate < 0.05'],
    // 95% of login requests must respond in less than 1.5 seconds under high stress
    http_req_duration: ['p(95) < 1500'],
  },
};

/**
 * Setup Hook (Runs ONCE before the load test starts)
 * Registers a dedicated performance test user in the database so that
 * VUs can log in with valid credentials.
 */
export function setup() {
  const baseUrl = __ENV.API_URL || 'http://localhost:3000';

  const payload = JSON.stringify({
    email: 'sdet_perf_tester@example.com',
    password: 'Password123!',
    passwordRepeat: 'Password123!',
    securityQuestion: {
      id: 1,
      question: "Your eldest siblings middle name?",
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z"
    },
    securityAnswer: 'testAnswer'
  });

  // Call the registration API
  http.post(`${baseUrl}/api/Users/`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Return the credentials to be accessed by VUs in the default function loop
  return { email: 'sdet_perf_tester@example.com', password: 'Password123!' };
}

/**
 * Default VU Loop Function
 * Receives the credentials returned from the setup() hook.
 */
export default function (data) {
  const baseUrl = __ENV.API_URL || 'http://localhost:3000';

  const payload = JSON.stringify({
    email: data.email,
    password: data.password,
  });

  const res = http.post(`${baseUrl}/rest/user/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Verify successful authentication
  check(res, {
    'login status is 200': (r) => r.status === 200,
    'login returns access token': (r) => r.body.includes('authentication'),
  });

  // Pacing: Wait 1 second between login requests to avoid instant socket starvation
  sleep(1);
}
