import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';

// It will create a table named “custom_add_to_cart_duration” in the K6 console
const addCartDuration = new Trend('custom_add_to_cart_duration');

export const options = {
  stages: [
    { duration: '5s', target: 10 },  // Ramp-up: 0 to 10 VUs
    { duration: '15s', target: 10 }, // Plateau: Mantains 10 VUs
    { duration: '5s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_failed: ['rate < 0.10'], // Maximum 10% of general errors
    custom_add_to_cart_duration: ['p(95) < 500'], // Our SLO for the cart!
  },
};

const searchQueries = new SharedArray('random search terms', function () {
  return ['apple', 'banana', 'orange', 'juice', 'box', 'facemask'];
});

export default function () {
  const baseUrl = __ENV.API_URL || 'http://localhost:3000';

  // --- STEP 1: Dynamic User Registration ---
  // We generate unique data using the VU ID, iteration number, and a randomizer
  const uniqueId = `${__VU}_${__ITER}_${Math.floor(Math.random() * 1000000)}`;
  const email = `perf_user_${uniqueId}@example.com`;
  const password = 'Password123!';
  const registerRes = http.post(`${baseUrl}/api/Users/`, JSON.stringify({
    email: email,
    password: password,
    passwordRepeat: password,
    securityQuestion: {
      id: 1,
      question: "Your eldest siblings middle name?",
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z"
    },
    securityAnswer: 'testAnswer'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  const registerOk = check(registerRes, { 'registration status is 201': (r) => r.status === 201 });
  if (!registerOk) return;


  // --- STEP 2: Authentication (Login) ---
  const loginRes = http.post(`${baseUrl}/rest/user/login`, JSON.stringify({
    email: email,
    password: password,
  }), { headers: { 'Content-Type': 'application/json' } });

  const loginOk = check(loginRes, { 'login status is 200': (r) => r.status === 200 });
  if (!loginOk) return;

  const token = loginRes.json().authentication.token;
  const basketId = loginRes.json().authentication.bid;



  // --- STEP 3: Parametrized Search ---
  // Select a random term from our SharedArray
  const randomTerm = searchQueries[Math.floor(Math.random() * searchQueries.length)];
  const searchRes = http.get(`${baseUrl}/rest/products/search?q=${randomTerm}`);

  const searchOk = check(searchRes, { 'search status is 200': (r) => r.status === 200 });
  if (!searchOk) return;

  const products = searchRes.json().data;
  if (!products || products.length === 0) return;

  const targetProductId = products[0].id;

  // --- STEP 4: Adding to Cart with Correlation and Custom Metric ---
  const startTime = Date.now();
  const cartRes = http.post(`${baseUrl}/api/BasketItems/`, JSON.stringify({
    ProductId: targetProductId,
    BasketId: basketId,
    quantity: 1
  }), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  addCartDuration.add(Date.now() - startTime);
  check(cartRes, {
    // Accepts 200/201 (success) or 400 if it's specifically out of stock
    'add to cart is successful or out of stock': (r) => 
      r.status === 200 || 
      r.status === 201 || 
      (r.status === 400 && r.body.includes('out of stock')),
  });
  sleep(1); // Pacing
}


