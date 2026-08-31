# 📘 Study Guide: Non-Functional Performance Testing & Engineering

Welcome to the Performance Engineering module! This guide establishes the theoretical pillars and paradigms of non-functional performance testing. Understanding these concepts will allow you to design, execute, and analyze performance tests using any modern tool (K6, JMeter, Gatling, Locust, etc.).

---

## 1. The Core Performance Metrics

In performance engineering, we measure how a system behaves under load using two distinct but deeply interrelated metrics:

### A. Latency (Response Time)

- **Definition:** The time it takes for a single request to travel from the client, get processed by the server, and return back to the client.
- **Measurement:** Usually measured in milliseconds (ms) or seconds (s).
- **Key Concept:** Latency is _relative to a single transaction_.

### B. Throughput (RPS / TPM)

- **Definition:** The volume of transactions or requests that the system successfully processes within a unit of time.
- **Measurement:** Measured in **RPS** (Requests Per Second) or **TPM** (Transactions Per Minute).
- **Key Concept:** Throughput is a measure of _concurrency and capacity_.

> [!IMPORTANT]
> **The Relationship (Little's Law):**
> As concurrent users increase, throughput increases linearly _until_ the system hits a resource bottleneck. Once a bottleneck is hit (CPU reaches 100%, database connection pool is full, etc.), throughput flattens out, and latency (response times) begins to degrade exponentially because requests are stuck waiting in a queue.

---

## 2. The Percentile Trap (The Flaw of Averages)

When reporting test results, many QA engineers make the mistake of using the **Average (Mean)** response time as their primary metric. **This is a dangerous anti-pattern.**

### Why averages are misleading:

Imagine a test run with 10 requests:

- 9 requests take **100ms**
- 1 request takes **10,000ms** (10 seconds)
- **Average:** `(9 * 100 + 10,000) / 10 = 1,090ms` (1.09 seconds)

The average of 1.09 seconds tells a false story:

- It hides the fact that 90% of your users had a lightning-fast experience (100ms).
- It downplays the fact that 10% of your users experienced an unacceptable 10-second crash/hang.

### The Solution: Percentiles

Percentiles represent the threshold under which a specific percentage of requests fall.

- **p50 (Median):** 50% of the users experienced response times below this value.
- **p95:** 95% of the users experienced response times below this value. (Standard for high-quality user experience).
- **p99:** 99% of the users experienced response times below this value. (Standard for critical financial/telecom transactions).

In our example:

- **p50:** 100ms (Excellent median experience)
- **p90:** 100ms
- **p95:** 10,000ms (Alert! Tail latency is degraded!)

---

## 3. Types of Performance Tests

We categorize performance tests based on the volume, shape, and duration of the load injected:

```
  Load (VUs)
   ▲
   │        ┌──────────────┐         [Load Test]
   │       ╱                ╲
   │      ╱                  ╲
   └─────┴────────────────────┴────────────────► Time

   ▲          ┌──┐                   [Spike Test]
   │         ╱    ╲
   │   ┌────┘      └────┐
   └───┴────────────────┴────────────────► Time

   ▲             ╱╲                  [Stress Test]
   │            ╱  ╲
   │     ┌─────┘    └─────┐
   └─────┴────────────────┴────────────────► Time
```

1.  **Load Test (Teste de Carga):**
    - _Purpose:_ Validate that the system meets its SLAs (Service Level Agreements) under expected normal and peak production load.
    - _Approach:_ Ramp up to expected peak load, hold it for a moderate duration, and verify response times (percentiles) and error rates.
2.  **Stress Test (Teste de Estresse):**
    - _Purpose:_ Find the **breaking point** of the system.
    - _Approach:_ Push the load continuously higher until the system saturates, fails, or crashes, observing how the system fails (does it recover gracefully, or does it require a manual database restart?).
3.  **Spike Test (Teste de Pico):**
    - _Purpose:_ Test how the system reacts to sudden, massive bursts of traffic (e.g., ticket launches, Black Friday deals).
    - _Approach:_ Inject load instantly (zero ramp-up time), hold briefly, and drop it.
4.  **Soak/Endurance Test (Teste de Resistência):**
    - _Purpose:_ Uncover memory leaks, database connection pool exhaustion, file descriptor leaks, or disk space accumulation.
    - _Approach:_ Run a moderate, sustainable load for an extended period (typically 12 to 24 hours).

---

## 4. Saturation and Bottlenecks

A system slows down because one or more resources reach 100% capacity (**Saturation**). The primary bottlenecks in web application architectures are:

- **CPU Saturation:** The application server (Node.js, Java, .NET) is doing heavy computation (e.g., signing JWT tokens, parsing JSON, encrypting passwords) and cannot process requests faster.
- **Memory Saturation (RAM):** The server runs out of RAM, leading to garbage collection pauses or the OS killing the process (Out Of Memory - OOM).
- **Database Connection Pool Exhaustion:** The web server has a limited number of connections to the database (e.g., max 10 connections). If 100 requests arrive, 90 requests will queue up waiting for a connection to release, degrading latency.
- **Network I/O:** The network card or bandwidth limit is saturated by downloading large images/assets.

---

## 5. Grafana K6: Paradigms & Architecture

K6 is a modern, developer-centric open-source load testing tool written in **Go** with a **JavaScript** runtime engine.

### Why K6 is an SDET favorite:

- **No GUI:** Unlike JMeter (which is Java-heavy and GUI-centric), K6 scripts are pure code (written in JS/TS).
- **Extremely Resource Efficient:** Written in Go, a single K6 instance can simulate thousands of concurrent users (VUs) utilizing minimal CPU and RAM compared to JMeter.
- **Performance Budgets (Thresholds):** K6 allows defining thresholds directly inside the code, acting as automated assertions that fail the test run (perfect for CI/CD pipelines).

### K6 Concepts:

- **Virtual Users (VUs):** Isolated execution loops simulating a real user.
- **Init Context:** Runs once to load files and configure options (runs outside the VUs execution).
- **Default Function:** The main loop that every active Virtual User (VU) executes repeatedly for the duration of the test.
- **Sleep (Pacing):** Adding pauses between actions. Without `sleep()`, a single VU will hammer the server as fast as possible, which does not simulate real human interaction.

---

## 6. Advanced K6 Concepts

### A. SharedArray (Memory-Efficient Feeder)

When running tests with high concurrency, loading large JSON files or arrays inside the VU context replicates the data across all active JavaScript runtimes, rapidly exhausting system memory.
The `SharedArray` constructor loads the data source once into the global memory and shares it as a read-only array across all VUs:

```javascript
import { SharedArray } from "k6/data";

const searchTerms = new SharedArray("product queries", function () {
  return ["apple", "banana", "orange", "juice", "sauce"];
});
```

### B. Custom Metrics (Trend & Rate)

K6 allows defining custom metrics to capture specific business transactions or error rates that default HTTP metrics group together:

- **Trend:** Accumulates values (like custom transaction durations) and calculates percentiles, minimum, maximum, and average.
- **Counter:** Tracks cumulative counts of events.
- **Rate:** Tracks the percentage of successful events.

```javascript
import { Trend } from "k6/metrics";
const addCartDuration = new Trend("add_to_cart_duration");

// In the default function:
addCartDuration.add(res.timings.duration);
```

### C. Data Correlation

Data correlation is the practice of extracting dynamic values returned by one HTTP response and passing them as parameters to subsequent requests, forming realistic user journeys. For example, parsing a search API response to target a product ID dynamically:

```javascript
const response = http.get("http://localhost:3000/rest/products/search?q=apple");
const body = response.json();
const productId = body.data[0].id; // Dynamic extraction

// Pass the extracted ID to the next request:
http.post(
  "http://localhost:3000/api/BasketItems/",
  JSON.stringify({ ProductId: productId }),
);
```


---

## 7. Advanced Performance Engineering Concepts

When moving beyond basic load testing into advanced performance engineering, SDETs must understand the following concepts:

### A. Advanced Load Modeling
In production-grade testing, we model load profiles to target specific infrastructure conditions:
- **Breakpoint Testing:** Dynamically increases the load continuously until the system fails. Unlike stress tests (which verify behavior at a high load), breakpoint testing identifies the *absolute maximum capacity* of the current architecture.
- **Resilience & Recovery Testing:** Analyzes how the system recovers *after* a catastrophic failure (e.g., does it auto-recover and return to normal latency once load drops, or does it trigger cascading failures, memory exhaustion, or database connection pool locks that require manual intervention?).

### B. Server-Side Telemetry & APM Correlation
Client-side metrics (latency, error rate, RPS) only show *that* a system is slow. Server-side telemetry shows *why*:
- **Database Connection Pool Exhaustion:** Databases limit the number of simultaneous active connections. If the pool is saturated, application threads queue up, turning small database delays into massive client-side latency spikes.
- **Garbage Collection (GC) Overhead:** In managed runtimes (Java Virtual Machine, V8/Node.js, .NET CLR), the runtime periodically pauses execution to reclaim memory. Frequent or long GC pauses (stop-the-world events) degrade latency and cause CPU spikes.
- **Thread Starvation & Event Loop Lag:** In single-threaded event loops (Node.js) or multi-threaded platforms, blocking operations (like heavy CPU cryptography or sync file I/O) block execution, preventing the runtime from handling incoming network events.

### C. Performance Tuning & Optimization Patterns
Once bottlenecks are isolated, performance engineers apply standard architectural fixes:
- **Index Optimization:** Ensuring database queries hit indexes rather than performing full table scans.
- **Caching Layer (Redis/Memcached):** Offloading read-heavy queries by caching static or semi-static data in-memory.
- **Load Balancing Algorithms:** Distributing traffic using Round Robin, Least Connections, or IP Hashing to ensure no single server node is saturated while others remain idle.
