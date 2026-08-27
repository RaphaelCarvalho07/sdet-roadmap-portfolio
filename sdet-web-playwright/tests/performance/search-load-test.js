import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * K6 Init Options
 * Defines the load profile stages (Ramp-up, Plateau, Ramp-down)
 * and the SLO Performance Budgets (Thresholds) for Latency and Failures.
 */
export const options = {
  stages: [
    { duration: '10s', target: 20 }, // Ramp-up: 0 to 20 Virtual Users (VUs)
    { duration: '20s', target: 20 }, // Plateau: Hold 20 VUs constant to measure steady-state load
    { duration: '5s', target: 0 },  // Ramp-down: Smooth teardown of virtual users
  ],
  thresholds: {
    // Quality Gate: Error rate must be less than 1%
    http_req_failed: ['rate < 0.01'],
    // Quality Gate: 95% of requests must respond in less than 200ms (p95 SLA)
    http_req_duration: ['p(95) < 200'],
  },
};

/**
 * Default VU Loop Function
 * Each Virtual User runs this function repeatedly in a loop for the duration of the test.
 */
export default function () {
  // Use environment variable API_URL, or fallback to local container address
  const baseUrl = __ENV.API_URL || 'http://localhost:3000';

  const res = http.get(`${baseUrl}/rest/products/search?q=apple`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Verify request success using K6 assertions
  check(res, {
    'search response code is 200': (r) => r.status === 200,
    'search returns results': (r) => r.body.includes('data'),
  });

  // Pacing (Think Time): Pauses each VU for 1 second between loop iterations
  // to simulate realistic user typing and prevent immediate client-side resource exhaustion.
  sleep(1);
}

