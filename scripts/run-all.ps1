# ─────────────────────────────────────────────
# Run all k6 performance test suites sequentially
# ─────────────────────────────────────────────

$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $PSScriptRoot
if (-not $ScriptDir) { $ScriptDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path) }
$ResultsDir = Join-Path $ScriptDir "results"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (-not (Test-Path $ResultsDir)) {
    New-Item -ItemType Directory -Path $ResultsDir -Force | Out-Null
}

Write-Host "============================================"
Write-Host "  k6 Performance Test Suite"
Write-Host "  $(Get-Date)"
Write-Host "============================================"
Write-Host ""

function Run-K6Test {
    param(
        [string]$TestName,
        [string]$TestFile
    )

    Write-Host "────────────────────────────────────────────"
    Write-Host "  Running: $TestName"
    Write-Host "────────────────────────────────────────────"

    $testPath = Join-Path $ScriptDir $TestFile
    $resultPath = Join-Path $ResultsDir "${TestName}_${Timestamp}.json"

    & k6 run --summary-export="$resultPath" "$testPath"

    Write-Host ""
}

# 1. Smoke test — quick sanity check
Run-K6Test -TestName "smoke" -TestFile "tests\smoke-test.js"

# 2. Load test — standard load
Run-K6Test -TestName "load" -TestFile "tests\load-test.js"

# 3. Stress test — push the limits
Run-K6Test -TestName "stress" -TestFile "tests\stress-test.js"

# 4. Spike test — sudden traffic burst
Run-K6Test -TestName "spike" -TestFile "tests\spike-test.js"

Write-Host "============================================"
Write-Host "  All tests complete!"
Write-Host "  Results saved to: $ResultsDir"
Write-Host "============================================"