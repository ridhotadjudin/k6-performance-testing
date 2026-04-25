import { check } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'https://reqres.in';
const API_KEY = __ENV.REQRES_API_KEY || '';

/**
 * Build common headers with API key authentication.
 * reqres.in requires x-api-key header for all requests.
 * Get your free key at: https://app.reqres.in/api-keys
 */
function buildHeaders(extra) {
  const h = { 'Content-Type': 'application/json' };
  if (API_KEY) h['x-api-key'] = API_KEY;
  return Object.assign(h, extra);
}

/**
 * Generate random user data for POST/PUT requests.
 */
export function generateUser() {
  const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Olivia', 'Daniel', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const jobs = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Developer', 'Architect', 'Consultant', 'Director'];
  
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const job = jobs[Math.floor(Math.random() * jobs.length)];
  
  return {
    name: `${first} ${last}`,
    job: job,
  };
}

/**
 * Common response assertion helper.
 * @param {object} res - k6 HTTP response object
 * @param {number} expectedStatus - expected HTTP status code
 * @param {string} [label] - optional label for the check
 * @returns {boolean} true if all checks passed
 */
export function checkResponse(res, expectedStatus, label) {
  const tag = label || `${res.request.method} ${res.request.url}`;
  return check(res, {
    [`${tag} — status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${tag} — response time < 2000ms`]: (r) => r.timings.duration < 2000,
  });
}

/**
 * Standard request params with JSON headers and API key.
 */
export const jsonHeaders = {
  headers: buildHeaders(),
};

/**
 * GET request params (no Content-Type needed, but includes API key).
 */
export const getHeaders = {
  headers: buildHeaders(),
};