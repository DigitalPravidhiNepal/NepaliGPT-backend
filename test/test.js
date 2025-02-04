import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5, // Number of virtual users
  duration: '30s', // Test duration
};

export default function () {
  const res = http.get('http://localhost:3030/api/v1/subscriptions'); // Replace with your API endpoint

  // Check if the response status is 200
  check(res, { 'status was 200': (r) => r.status === 200 });

  sleep(1); // Pause for 1 second between requests
}
