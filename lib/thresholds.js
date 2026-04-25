/**
 * Reusable threshold configurations for different test types.
 *
 * k6 thresholds define pass/fail criteria for the test run.
 * See: https://grafana.com/docs/k6/latest/using-k6/thresholds/
 */

export const smokeThresholds = {
  http_req_duration: ['p(95)<1000'],   // 95% of requests under 1s
  http_req_failed: ['rate<0.01'],      // less than 1% failures
  http_req_receiving: ['p(95)<200'],   // receiving time under 200ms
};

export const loadThresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1500'],  // 95th < 500ms, 99th < 1.5s
  http_req_failed: ['rate<0.01'],                   // less than 1% failures
  http_reqs: ['rate>10'],                           // at least 10 req/s throughput
};

export const stressThresholds = {
  http_req_duration: ['p(95)<1000', 'p(99)<2000'],  // relaxed for stress
  http_req_failed: ['rate<0.05'],                    // up to 5% failures acceptable
};

export const spikeThresholds = {
  http_req_duration: ['p(95)<2000'],   // generous during spike
  http_req_failed: ['rate<0.10'],      // up to 10% failures during spike
};