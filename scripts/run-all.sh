#!/usr/bin/env bash
# ─────────────────────────────────────────────
# Run all k6 performance test suites sequentially
# ─────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RESULTS_DIR="${SCRIPT_DIR}/results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$RESULTS_DIR"
echo "============================================"
echo "  k6 Performance Test Suite"
echo "  $(date)"
echo "============================================"
echo ""

run_test() {
  local test_name="$1"
  local test_file="$2"

  echo "────────────────────────────────────────────"
  echo "  Running: ${test_name}"
  echo "────────────────────────────────────────────"

  k6 run \
    --summary-export="${RESULTS_DIR}/${test_name}_${TIMESTAMP}.json" \
    "${SCRIPT_DIR}/${test_file}" \
    || true

  echo ""
}

# 1. Smoke test — quick sanity check
run_test "smoke" "tests/smoke-test.js"

# 2. Load test — standard load
run_test "load" "tests/load-test.js"

# 3. Stress test — push the limits
run_test "stress" "tests/stress-test.js"

# 4. Spike test — sudden traffic burst
run_test "spike" "tests/spike-test.js"

echo "============================================"
echo "  All tests complete!"
echo "  Results saved to: ${RESULTS_DIR}"
echo "============================================"