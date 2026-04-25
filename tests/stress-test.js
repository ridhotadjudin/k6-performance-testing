import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL, checkResponse, jsonHeaders, getHeaders, generateUser } from '../lib/helpers.js';
import { stressThresholds } from '../lib/thresholds.js';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // ramp to 100 VUs
    { duration: '1m', target: 100 },     // sustain at 100
    { duration: '30s', target: 200 },    // ramp to 200 VUs
    { duration: '1m', target: 200 },     // sustain at 200
    { duration: '30s', target: 0 },      // ramp down
  ],
  thresholds: stressThresholds,
  tags: { testType: 'stress' },
};

export default function () {
  // GET — List users
  let res = http.get(`${BASE_URL}/api/users?page=2`, getHeaders);
  checkResponse(res, 200, 'List Users');
  sleep(0.5);

  // GET — Single user
  res = http.get(`${BASE_URL}/api/users/2`, getHeaders);
  checkResponse(res, 200, 'Get Single User');
  sleep(0.5);

  // POST — Create user
  const newUser = generateUser();
  res = http.post(`${BASE_URL}/api/users`, JSON.stringify(newUser), jsonHeaders);
  checkResponse(res, 201, 'Create User');
  sleep(0.5);

  // PUT — Update user
  const updatedUser = generateUser();
  res = http.put(`${BASE_URL}/api/users/2`, JSON.stringify(updatedUser), jsonHeaders);
  checkResponse(res, 200, 'Update User');
  sleep(0.5);
}