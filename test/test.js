import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 5, // Virtual users
  duration: '10s', // Test duration
};

export default function () {
  let res = http.get('http://localhost:3030/api/v1');
  check(res, {
    'Rate limit triggered': (r) => r.status === 429,
  });
}
