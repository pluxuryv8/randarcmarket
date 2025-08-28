# Radar Smoke Test Script (PowerShell)
# Usage: .\smoke-radar.ps1

param(
    [string]$BaseUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Radar Smoke Test..." -ForegroundColor Green

# 1. Get access token
Write-Host "📝 Getting access token..." -ForegroundColor Yellow
$tokenResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/dev-login?user=e2e&tier=pro" -Method Get
$token = $tokenResponse.token

if (-not $token) {
    Write-Host "❌ Failed to get token from dev-login, trying make-token script..." -ForegroundColor Red
    Push-Location scripts
    $token = (npx ts-node make-token.ts | Select-Object -Last 1)
    Pop-Location
}

Write-Host "✅ Token obtained: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green

# 2. Join round and get result
Write-Host "🎯 Joining radar round..." -ForegroundColor Yellow
$joinBody = @{
    itemAddress = "test-item-smoke"
    tier = "pro"
} | ConvertTo-Json

$joinResponse = Invoke-RestMethod -Uri "$BaseUrl/api/radar/join" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -Body $joinBody

Write-Host "Join response: $($joinResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan

# Extract roundId from response
$roundId = $joinResponse.roundId
if (-not $roundId) {
    $roundId = $joinResponse.round.id
}

if (-not $roundId) {
    Write-Host "❌ No roundId in join response" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Round ID: $roundId" -ForegroundColor Green

# Wait and get result
Write-Host "⏳ Waiting for round result..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

$caught = $false
$attempt = 1
$maxAttempts = 5

while ($attempt -le $maxAttempts -and -not $caught) {
    Write-Host "🔄 Attempt $attempt/$maxAttempts..." -ForegroundColor Yellow
    
    $resultResponse = Invoke-RestMethod -Uri "$BaseUrl/api/radar/result/$roundId" -Method Get -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "Result response: $($resultResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    
    $caught = $resultResponse.caught
    
    if ($caught) {
        Write-Host "🎉 Caught on attempt $attempt!" -ForegroundColor Green
        break
    }
    
    if ($attempt -lt $maxAttempts) {
        Write-Host "😔 Not caught, trying again..." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
    }
    
    $attempt++
}

if (-not $caught) {
    Write-Host "❌ Failed to catch after $maxAttempts attempts" -ForegroundColor Red
    exit 1
}

# 3. Create reservation
Write-Host "📋 Creating reservation..." -ForegroundColor Yellow
$reserveBody = @{
    roundId = $roundId
} | ConvertTo-Json

$reserveResponse = Invoke-RestMethod -Uri "$BaseUrl/api/radar/reserve" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "Idempotency-Key" = "smoke-1"
} -Body $reserveBody

Write-Host "Reserve response: $($reserveResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan

$reservationId = $reserveResponse.reservation.id
if (-not $reservationId) {
    Write-Host "❌ No reservation ID in response" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Reservation ID: $reservationId" -ForegroundColor Green

# Test idempotency
Write-Host "🔄 Testing reservation idempotency..." -ForegroundColor Yellow
$reserveResponse2 = Invoke-RestMethod -Uri "$BaseUrl/api/radar/reserve" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "Idempotency-Key" = "smoke-1"
} -Body $reserveBody

$reservationId2 = $reserveResponse2.reservation.id
if ($reservationId -eq $reservationId2) {
    Write-Host "✅ Idempotency works: same reservation ID" -ForegroundColor Green
} else {
    Write-Host "❌ Idempotency failed: different reservation IDs" -ForegroundColor Red
}

# 4. Top up balance
Write-Host "💰 Topping up balance..." -ForegroundColor Yellow
Push-Location scripts
npx ts-node topup.ts
Pop-Location

# 5. Pay with balance
Write-Host "💳 Paying with balance..." -ForegroundColor Yellow
$payBody = @{
    reservationId = $reservationId
    method = "balance"
} | ConvertTo-Json

$payResponse = Invoke-RestMethod -Uri "$BaseUrl/api/radar/pay" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "Idempotency-Key" = "smoke-2"
} -Body $payBody

Write-Host "Pay response: $($payResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan

$orderId = $payResponse.orderId
if (-not $orderId) {
    Write-Host "❌ No order ID in pay response" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Order ID: $orderId" -ForegroundColor Green

# Test payment idempotency
Write-Host "🔄 Testing payment idempotency..." -ForegroundColor Yellow
$payResponse2 = Invoke-RestMethod -Uri "$BaseUrl/api/radar/pay" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "Idempotency-Key" = "smoke-2"
} -Body $payBody

$orderId2 = $payResponse2.orderId
if ($orderId -eq $orderId2) {
    Write-Host "✅ Payment idempotency works: same order ID" -ForegroundColor Green
} else {
    Write-Host "❌ Payment idempotency failed: different order IDs" -ForegroundColor Red
}

# 6. Poll order status
Write-Host "📊 Polling order status..." -ForegroundColor Yellow
$maxPolls = 30
$pollCount = 0
$finalStatus = ""

while ($pollCount -lt $maxPolls) {
    $pollCount++
    
    $orderResponse = Invoke-RestMethod -Uri "$BaseUrl/api/radar/order/$orderId" -Method Get -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    $status = $orderResponse.order.status
    Write-Host "Poll $pollCount : Status = $status" -ForegroundColor Cyan
    
    if ($status -eq "delivered") {
        $finalStatus = "delivered"
        break
    } elseif ($status -eq "onchain_fail") {
        $finalStatus = "onchain_fail"
        break
    } elseif ($status -eq "onchain_ok") {
        Write-Host "✅ Order executed successfully, waiting for delivery..." -ForegroundColor Green
    }
    
    Start-Sleep -Milliseconds 500
}

if (-not $finalStatus) {
    Write-Host "❌ Order did not reach final status after $maxPolls polls" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Order final status: $finalStatus" -ForegroundColor Green

# 7. Check metrics
Write-Host "📈 Checking metrics..." -ForegroundColor Yellow
$metrics = Invoke-RestMethod -Uri "$BaseUrl/metrics" -Method Get

Write-Host "Radar metrics:" -ForegroundColor Cyan
$metrics -split "`n" | Where-Object { $_ -match "(radar_reservations_|radar_orders_|radar_delivery_|radar_execution_duration_ms)" } | ForEach-Object { Write-Host $_ }

# 8. Test rate limiting
Write-Host "🚦 Testing rate limiting..." -ForegroundColor Yellow
$rateLimitHit = $false
for ($i = 1; $i -le 35; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/radar/pay" -Method Post -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
            "Idempotency-Key" = "rate-test-$i"
        } -Body $payBody
    } catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            Write-Host "✅ Rate limit hit at request $i" -ForegroundColor Green
            $rateLimitHit = $true
            break
        }
    }
}

if (-not $rateLimitHit) {
    Write-Host "⚠️ Rate limit not hit after 35 requests" -ForegroundColor Yellow
}

Write-Host "🎉 Smoke test completed successfully!" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Caught on attempt: $attempt" -ForegroundColor White
Write-Host "- Reservation ID: $reservationId" -ForegroundColor White
Write-Host "- Order ID: $orderId" -ForegroundColor White
Write-Host "- Final status: $finalStatus" -ForegroundColor White
Write-Host "- Rate limit hit: $rateLimitHit" -ForegroundColor White
