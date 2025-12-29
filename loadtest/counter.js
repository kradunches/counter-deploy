import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost";

export const options = {
    scenarios: {
        steady: {
            executor: "constant-vus",
            vus: 50,
            duration: "30s",
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.01"],      // <1% ошибок
        http_req_duration: ["p(95)<200"],    // p95 < 200ms
    },
};

export default function () {
    // Тестируем POST increment (запись в Redis)
    const res = http.post(`${BASE_URL}/api/counter/increment`, null, {
        headers: { "Content-Type": "application/json" },
        timeout: "5s",
    });

    check(res, {
        "status is 200": (r) => r.status === 200,
    });

    sleep(0.01);
}


export function handleSummary(data) {
    return {
        'results/4replica.html': htmlReport(data),
    };
}