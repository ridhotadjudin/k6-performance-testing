/**
 * Environment configuration.
 *
 * Usage:
 *   k6 run -e ENV=staging tests/load-test.js
 *
 * Falls back to 'production' if ENV is not set.
 */

const environments = {
  local: {
    baseUrl: 'http://localhost:3000',
    thinkTime: 0.5,   // seconds between requests
  },
  staging: {
    baseUrl: 'https://reqres.in',
    thinkTime: 1,
  },
  production: {
    baseUrl: 'https://reqres.in',
    thinkTime: 1,
  },
};

const currentEnv = __ENV.ENV || 'production';

export const config = environments[currentEnv] || environments.production;

export default config;