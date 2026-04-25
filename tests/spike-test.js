import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL, checkResponse, jsonHeaders, getHeaders, generateUser } from '../lib/helpers.js';
import { spikeThresholds } from '../lib/thresholds.js';

export const options = {
  stages: [
    { duration: '10s', target: 10 },    // warm-up
    { duration: '10s', target: 200 },    // spike to 200 VUs
    { duration: '30s', target: 200 },    // hold spike briefly
    { duration: '10s', target: 10 },     // drop back
    { duration: '30s', target: 10 },     // recovery period
    { duration: '10s', target: 0 },      // ramp down
  ],
  thresholds: spikeThresholds,
  tags: { testType: 'spike' },
};

export default function () {
  // GET — List users
  let res = http.get(`${BASE_URL}/api/users?page=2`, getHeaders);
  checkResponse(res, 200, 'List Users');
  sleep(0.3);

  // GET — Single user
  res = http.get(`${BASE_URL}/api/users/2`, getHeaders);
  checkResponse(res, 200, 'Get Single User');
  sleep(0.3);

  // POST — Create user
  const newUser = generateUser();
  res = http.post(`${BASE_URL}/api/users`, JSON.stringify(newUser), jsonHeaders);
  checkResponse(res, 201, 'Create User');
  sleep(0.3);

  // PUT — Update user
  const updatedUser = generateUser();
  res = http.put(`${BASE_URL}/api/users/2`, JSON.stringify(updatedUser), jsonHeaders);
  checkResponse(res, 200, 'Update User');
  sleep(0.3);

  // DELETE — Delete user
  res = http.del(`${BASE_URL}/api/users/2`, getHeaders);
  checkResponse(res, [200, 204], 'Delete User');
  sleep(0.3);
}