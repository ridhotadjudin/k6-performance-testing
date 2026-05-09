# k6 Performance Testing Suite

![k6](https://img.shields.io/badge/k6-7D64FF?style=for-the-badge&logo=k6&logoColor=white)
![JavaScript](https://img.shields.io/badge/ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

![Performance Tests](https://github.com/ridhotadjudin/k6-performance-testing/actions/workflows/performance-test.yml/badge.svg)

A comprehensive **k6 performance testing** project targeting the [ReqRes](https://reqres.in) public REST API. Includes smoke, load, stress, and spike test scenarios with reusable helpers, configurable thresholds, and CI/CD integration via GitHub Actions.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Test Scenarios](#-test-scenarios)
- [How to Run](#-how-to-run)
- [Performance Thresholds](#-performance-thresholds)
- [Sample Output](#-sample-output)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributing](#-contributing)

---

## 🛠 Tech Stack

| Tool       | Purpose                       |
|------------|-------------------------------|
| **k6**     | Performance / load testing    |
| **ES6+ JS**| Test scripts & helpers       |
| **GitHub Actions** | CI/CD automation      |

---

## ✅ Prerequisites

1. **Install k6** — [Official installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)

   ```bash
   # macOS
   brew install k6

   # Windows (Chocolatey)
   choco install k6

   # Windows (winget)
   winget install k6 --source winget

   # Debian/Ubuntu
   sudo gpg -k
   sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
     --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
     | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update && sudo apt-get install k6
   ```

2. Verify installation:
   ```bash
   k6 version
   ```

---

## 📁 Project Structure

```
k6-performance-testing/
├── .github/
│   └── workflows/
│       └── performance-test.yml   # GitHub Actions CI/CD
├── config/
│   └── environments.js            # Environment configs (staging/prod)
├── lib/
│   ├── helpers.js                 # Shared utilities & assertions
│   └── thresholds.js              # Reusable threshold configs
├── scripts/
│   ├── run-all.sh                 # Run all tests (Linux/macOS)
│   └── run-all.ps1                # Run all tests (Windows)
├── tests/
│   ├── smoke-test.js              # Smoke test — basic sanity
│   ├── load-test.js               # Load test — normal traffic
│   ├── stress-test.js             # Stress test — beyond capacity
│   └── spike-test.js              # Spike test — sudden burst
├── results/                       # Test output (git-ignored)
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Test Scenarios

### 1. Smoke Test (`tests/smoke-test.js`)
**Purpose:** Verify the system works under minimal load.
- **1 VU** for **30 seconds**
- Hits all CRUD endpoints
- Validates status codes and response times

### 2. Load Test (`tests/load-test.js`)
**Purpose:** Assess performance under expected normal traffic.
- Ramp up to **10 VUs** over 30s → sustain for 1m → ramp down over 10s
- Full CRUD coverage: `GET`, `POST`, `PUT`
- Strict thresholds: p(95) < 500ms, error rate < 1%

### 3. Stress Test (`tests/stress-test.js`)
**Purpose:** Find the system's breaking point.
- Ramp to **20 VUs** → sustain → ramp to **50 VUs** → sustain → ramp down
- Relaxed thresholds to observe degradation patterns

### 4. Spike Test (`tests/spike-test.js`)
**Purpose:** Test system behaviour under sudden traffic spikes.
- Quick ramp to **50 VUs**, brief hold, then immediate drop to **5 VUs**
- Recovery period to verify the system stabilises

### API Endpoints Tested

| Method   | Endpoint              | Expected Status |
|----------|-----------------------|-----------------|
| `GET`    | `/api/users?page=2`   | 200             |
| `GET`    | `/api/users/2`        | 200             |
| `POST`   | `/api/users`          | 201             |
| `PUT`    | `/api/users/2`        | 200             |

---

## 🚀 How to Run

### 1. Get your API key (required)

ReqRes now requires an API key. Get your free key at [app.reqres.in/api-keys](https://app.reqres.in/api-keys).

```bash
# Set API key as environment variable
set REQRES_API_KEY=your_api_key_here     # Windows CMD
$env:REQRES_API_KEY="your_api_key_here"  # Windows PowerShell
export REQRES_API_KEY=your_api_key_here  # Linux/macOS
```

### 2. Individual Tests

```bash
# Smoke test
k6 run -e REQRES_API_KEY=$REQRES_API_KEY tests/smoke-test.js

# Load test
k6 run -e REQRES_API_KEY=$REQRES_API_KEY tests/load-test.js

# Stress test
k6 run -e REQRES_API_KEY=$REQRES_API_KEY tests/stress-test.js

# Spike test
k6 run -e REQRES_API_KEY=$REQRES_API_KEY tests/spike-test.js
```

### Using npm scripts

```bash
npm run test:smoke
npm run test:load
npm run test:stress
npm run test:spike
```

### Run All Tests

```bash
# Linux / macOS
chmod +x scripts/run-all.sh
./scripts/run-all.sh

# Windows (PowerShell)
.\scripts\run-all.ps1
```

### Custom Environment

```bash
# Use a different base URL
k6 run -e BASE_URL=https://your-api.example.com tests/load-test.js

# Use a named environment
k6 run -e ENV=staging tests/load-test.js
```

### Export Results

```bash
# JSON summary
k6 run --summary-export=results/load-test.json tests/load-test.js

# JSON streaming output
k6 run --out json=results/load-test-full.json tests/load-test.js
```

---

## 📊 Performance Thresholds

Thresholds are defined in `lib/thresholds.js` and applied per test type:

| Metric              | Smoke       | Load                | Stress              | Spike       |
|---------------------|-------------|---------------------|---------------------|-------------|
| `http_req_duration` p(95) | < 1000ms | < 500ms          | < 1000ms            | < 2000ms    |
| `http_req_duration` p(99) | —        | < 1500ms           | < 2000ms            | —           |
| `http_req_failed`   | < 1%        | < 1%                | < 5%                | < 10%       |
| `http_reqs` rate    | —           | > 10 req/s          | —                   | —           |

If any threshold is violated, k6 exits with a **non-zero exit code**, which fails the CI pipeline.

---

## 💻 Sample Output

```
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: tests/load-test.js
     output: -

  scenarios: (100.00%) 1 scenario, 50 max VUs, 2m10s max duration
           default: Up to 50 looping VUs for 1m40s (gracefulRampDown: 30s)

     ✓ List Users — status is 200
     ✓ List Users — response time < 2000ms
     ✓ Get Single User — status is 200
     ✓ Create User — status is 201
     ✓ Update User — status is 200

     checks.........................: 100.00% ✓ 2940  ✗ 0
     http_req_duration..............: avg=245ms  min=120ms  max=890ms  p(90)=380ms  p(95)=450ms
     http_req_failed................: 0.00%   ✓ 0     ✗ 1470
     http_reqs......................: 1470    14.7/s
     vus............................: 1       min=1   max=50
```

---

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/performance-test.yml`) runs:

1. **Smoke test** on every push to `main` (acts as a gate)
2. **Load test** after smoke passes
3. **Manual dispatch** to run any test type (`smoke`, `load`, `stress`, `spike`, or `all`)

Results are uploaded as artifacts and summarised in the workflow summary.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-scenario`)
3. Add your test in `tests/`
4. Update thresholds in `lib/thresholds.js` if needed
5. Submit a pull request

---

## Author

**Ridho Tadjudin** — QA Engineer

- 🌐 Website: [ridhotadjudin.id](https://ridhotadjudin.id)
- 💻 GitHub: [@ridhotadjudin](https://github.com/ridhotadjudin)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ☕ and <a href="https://www.javascript.com">Javascript</a>
</p>
