import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:4001/inventory/sku-1');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'quantity is a number': (r) => typeof r.json('quantity') === 'number',
  });

  sleep(1);
}
