#!/bin/bash

# Radar Smoke Test Script
# Usage: ./smoke-radar.sh

set -e

BASE_URL="http://localhost:8080"
TOKEN=""
ROUND_ID=""
RESERVATION_ID=""
ORDER_ID=""

echo "🚀 Starting Radar Smoke Test..."

# 1. Get access token
echo "📝 Getting access token..."
cd scripts
TOKEN=$(npx ts-node make-token.ts | tail -n 1)
cd ..

echo "✅ Token obtained: ${TOKEN:0:20}..."

# 2. Join round and get result
echo "🎯 Joining radar round..."
JOIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/radar/join" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"itemAddress":"test-item-smoke","tier":"pro"}')

echo "Join response: $JOIN_RESPONSE"

# Extract roundId from response
ROUND_ID=$(echo "$JOIN_RESPONSE" | jq -r '.roundId // .round.id // empty')
if [ -z "$ROUND_ID" ] || [ "$ROUND_ID" = "null" ]; then
    echo "❌ No roundId in join response"
    exit 1
fi

echo "✅ Round ID: $ROUND_ID"

# Wait and get result
echo "⏳ Waiting for round result..."
sleep 1

CAUGHT=false
ATTEMPT=1
MAX_ATTEMPTS=5

while [ $ATTEMPT -le $MAX_ATTEMPTS ] && [ "$CAUGHT" = "false" ]; do
    echo "🔄 Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    RESULT_RESPONSE=$(curl -s "$BASE_URL/api/radar/result/$ROUND_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Result response: $RESULT_RESPONSE"
    
    CAUGHT=$(echo "$RESULT_RESPONSE" | jq -r '.caught // false')
    
    if [ "$CAUGHT" = "true" ]; then
        echo "🎉 Caught on attempt $ATTEMPT!"
        break
    fi
    
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        echo "😔 Not caught, trying again..."
        sleep 1
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$CAUGHT" != "true" ]; then
    echo "❌ Failed to catch after $MAX_ATTEMPTS attempts"
    exit 1
fi

# 3. Create reservation
echo "📋 Creating reservation..."
RESERVE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/radar/reserve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: smoke-1" \
  -d "{\"roundId\":\"$ROUND_ID\"}")

echo "Reserve response: $RESERVE_RESPONSE"

RESERVATION_ID=$(echo "$RESERVE_RESPONSE" | jq -r '.reservation.id')
if [ -z "$RESERVATION_ID" ] || [ "$RESERVATION_ID" = "null" ]; then
    echo "❌ No reservation ID in response"
    exit 1
fi

echo "✅ Reservation ID: $RESERVATION_ID"

# Test idempotency
echo "🔄 Testing reservation idempotency..."
RESERVE_RESPONSE_2=$(curl -s -X POST "$BASE_URL/api/radar/reserve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: smoke-1" \
  -d "{\"roundId\":\"$ROUND_ID\"}")

RESERVATION_ID_2=$(echo "$RESERVE_RESPONSE_2" | jq -r '.reservation.id')
if [ "$RESERVATION_ID" = "$RESERVATION_ID_2" ]; then
    echo "✅ Idempotency works: same reservation ID"
else
    echo "❌ Idempotency failed: different reservation IDs"
fi

# 4. Top up balance
echo "💰 Topping up balance..."
cd scripts
npx ts-node topup.ts
cd ..

# 5. Pay with balance
echo "💳 Paying with balance..."
PAY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/radar/pay" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: smoke-2" \
  -d "{\"reservationId\":\"$RESERVATION_ID\",\"method\":\"balance\"}")

echo "Pay response: $PAY_RESPONSE"

ORDER_ID=$(echo "$PAY_RESPONSE" | jq -r '.orderId')
if [ -z "$ORDER_ID" ] || [ "$ORDER_ID" = "null" ]; then
    echo "❌ No order ID in pay response"
    exit 1
fi

echo "✅ Order ID: $ORDER_ID"

# Test payment idempotency
echo "🔄 Testing payment idempotency..."
PAY_RESPONSE_2=$(curl -s -X POST "$BASE_URL/api/radar/pay" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: smoke-2" \
  -d "{\"reservationId\":\"$RESERVATION_ID\",\"method\":\"balance\"}")

ORDER_ID_2=$(echo "$PAY_RESPONSE_2" | jq -r '.orderId')
if [ "$ORDER_ID" = "$ORDER_ID_2" ]; then
    echo "✅ Payment idempotency works: same order ID"
else
    echo "❌ Payment idempotency failed: different order IDs"
fi

# 6. Poll order status
echo "📊 Polling order status..."
MAX_POLLS=30
POLL_COUNT=0
FINAL_STATUS=""

while [ $POLL_COUNT -lt $MAX_POLLS ]; do
    POLL_COUNT=$((POLL_COUNT + 1))
    
    ORDER_RESPONSE=$(curl -s "$BASE_URL/api/radar/order/$ORDER_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$ORDER_RESPONSE" | jq -r '.order.status')
    echo "Poll $POLL_COUNT: Status = $STATUS"
    
    if [ "$STATUS" = "delivered" ]; then
        FINAL_STATUS="delivered"
        break
    elif [ "$STATUS" = "onchain_fail" ]; then
        FINAL_STATUS="onchain_fail"
        break
    elif [ "$STATUS" = "onchain_ok" ]; then
        echo "✅ Order executed successfully, waiting for delivery..."
    fi
    
    sleep 0.5
done

if [ -z "$FINAL_STATUS" ]; then
    echo "❌ Order did not reach final status after $MAX_POLLS polls"
    exit 1
fi

echo "✅ Order final status: $FINAL_STATUS"

# 7. Check metrics
echo "📈 Checking metrics..."
METRICS=$(curl -s "$BASE_URL/metrics")

echo "Radar metrics:"
echo "$METRICS" | grep -E "(radar_reservations_|radar_orders_|radar_delivery_|radar_execution_duration_ms)" || echo "No radar metrics found"

# 8. Test rate limiting (only in production mode)
if [ "$NODE_ENV" != "test" ]; then
    echo "🚦 Testing rate limiting..."
    RATE_LIMIT_HIT=false
    for i in {1..35}; do
        RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/radar/pay" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -H "Idempotency-Key: rate-test-$i" \
          -d "{\"reservationId\":\"$RESERVATION_ID\",\"method\":\"balance\"}" \
          -o /dev/null)
        
        if [ "$RESPONSE" = "429" ]; then
            echo "✅ Rate limit hit at request $i"
            RATE_LIMIT_HIT=true
            break
        fi
    done

    if [ "$RATE_LIMIT_HIT" = "false" ]; then
        echo "⚠️ Rate limit not hit after 35 requests"
    fi
else
    echo "🚦 Skipping rate limit test in test environment"
    RATE_LIMIT_HIT="skipped"
fi

echo "🎉 Smoke test completed successfully!"
echo "Summary:"
echo "- Caught on attempt: $ATTEMPT"
echo "- Reservation ID: $RESERVATION_ID"
echo "- Order ID: $ORDER_ID"
echo "- Final status: $FINAL_STATUS"
echo "- Rate limit hit: $RATE_LIMIT_HIT"
