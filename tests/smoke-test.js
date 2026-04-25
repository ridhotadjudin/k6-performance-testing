import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL, checkResponse, jsonHeaders, getHeaders, generateUser } from '../lib/helpers.js';
import { smokeThresholds } from '../lib/thresholds.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: smokeThresholds,
  tags: { testType: 'smoke' },
};

export default function () {
  // GET — List users
  let res = http.get(`${BASE_URL}/api/users?page=2`, getHeaders);
  checkResponse(res, 200, 'List Users');
  sleep(1);

  // GET — Single user
  res = http.get(`${BASE_URL}/api/users/2`, getHeaders);
  checkResponse(res, 200, 'Get Single User');
  sleep(1);

  // POST — Create user
  const user = generateUser();
  res = http.post(`${BASE_URL}/api/users`, JSON.stringify(user), jsonHeaders);
  checkResponse(res, 201, 'Create User');
  sleep(1);

  // PUT — Update user
  const updatedUser = generateUser();
  res = http.put(`${BASE_URL}/api/users/2`, JSON.stringify(updatedUser), jsonHeaders);
  checkResponse(res, 200, 'Update User');
  sleep(1);

  // DELETE — Delete user
  res = http.del(`${BASE_URL}/api/users/2`, getHeaders);
  checkResponse(res, 204, 'Delete User');
  sleep(1);
}