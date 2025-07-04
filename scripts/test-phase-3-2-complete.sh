#!/bin/bash

echo "🧪 PHASE 3.2 COMPLETE TESTING SUITE"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -n "🔍 Testing: $test_name... "
    
    result=$(eval "$test_command" 2>&1)
    
    if echo "$result" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
        if [[ "$4" == "verbose" ]]; then
            echo "   Response: $(echo "$result" | jq -r '.success // .error // "No JSON"' 2>/dev/null || echo "$result" | head -1)"
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "   Expected: $expected_pattern"
        echo "   Got: $(echo "$result" | head -1)"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Function to test API endpoint
test_api() {
    local endpoint="$1"
    local data="$2"
    local expected="$3"
    local description="$4"
    
    run_test "$description" \
        "curl -s -X POST http://localhost:3001/api/$endpoint -H 'Content-Type: application/json' -d '$data'" \
        "$expected" \
        "verbose"
}

echo -e "${BLUE}📡 TESTING FIXED API ENDPOINTS${NC}"
echo "=============================="

# Test 1: Health Check
run_test "Health endpoint" \
    "curl -s http://localhost:3001/api/health" \
    '"status".*"ok"'

# Test 2: Fixed Creator Lookup (Direct MCP)
test_api "lookup-creator" \
    '{"platform": "x", "handle": "elonmusk", "niche": "crypto"}' \
    '"success":true' \
    "Fixed Creator lookup with direct MCP integration"

# Test 3: Fixed Gemini Proxy (2.0 Flash Lite)
test_api "gemini-proxy" \
    '{"prompt": "What makes content viral? Answer in 20 words."}' \
    '"success":true' \
    "Fixed Google Gemini 2.0 Flash Lite proxy"

# Test 4: Complete AI Prediction Pipeline
echo -e "${BLUE}🤖 Testing Complete AI Prediction Pipeline...${NC}"
echo "1. Getting creator data..."
CREATOR_DATA=$(curl -s -X POST http://localhost:3001/api/lookup-creator \
    -H "Content-Type: application/json" \
    -d '{"platform": "x", "handle": "elonmusk", "niche": "crypto"}')

if echo "$CREATOR_DATA" | grep -q '"success":true'; then
    echo -e "   ${GREEN}✅ Creator lookup successful${NC}"
    
    echo "2. Testing fixed AI prediction..."
    test_api "predict-viral-ai" \
        '{"postData": {"text": "Breaking: Bitcoin just hit a new all-time high! 🚀 The future is here #Bitcoin #Crypto #ToTheMoon", "platform": "x", "niche": "crypto", "contentType": "text"}, "creatorData": {"handle": "elonmusk", "followers": 220000000, "engagementRate": 0.5, "verified": true}, "trendingTopics": [{"name": "Bitcoin", "change": 5.2}]}' \
        'viralProbability' \
        "Fixed AI prediction with Gemini 2.0 Flash Lite"
else
    echo -e "   ${RED}❌ Creator lookup failed, skipping AI prediction test${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}🔍 TESTING DATA QUALITY${NC}"
echo "======================"

# Test 5: Verify No Mock Data References
MOCK_COUNT=$(grep -r "mock\|simulate\|fake" pages/api/*.js | grep -v "comment\|#" | wc -l)
if [ "$MOCK_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No mock data references found${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Found $MOCK_COUNT mock data references${NC}"
    ((TESTS_FAILED++))
fi

# Test 6: Verify Gemini Model Name
GEMINI_MODEL=$(grep -r "gemini-2.0-flash-lite" pages/api/*.js | wc -l)
if [ "$GEMINI_MODEL" -gt 0 ]; then
    echo -e "${GREEN}✅ Using correct Gemini 2.0 Flash Lite model${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Not using Gemini 2.0 Flash Lite model${NC}"
    ((TESTS_FAILED++))
fi

# Test 7: Frontend Integration Test
echo ""
echo -e "${BLUE}🌐 TESTING FRONTEND INTEGRATION${NC}"
echo "==============================="

# Check if development server is running
DEV_SERVER=$(curl -s http://localhost:3001 | grep -o "Next.js" | wc -l)
if [ "$DEV_SERVER" -gt 0 ]; then
    echo -e "${GREEN}✅ Development server running${NC}"
    ((TESTS_PASSED++))
    
    # Test main page loads
    MAIN_PAGE=$(curl -s http://localhost:3001 | grep -o "AI Viral Prediction" | wc -l)
    if [ "$MAIN_PAGE" -gt 0 ]; then
        echo -e "${GREEN}✅ Main page loads correctly${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ Main page not loading correctly${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}❌ Development server not running${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}📊 TEST RESULTS SUMMARY${NC}"
echo "======================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Phase 3.2 is complete.${NC}"
    echo -e "${GREEN}✅ Ready for Phase 3.3 deployment testing${NC}"
else
    echo -e "${RED}⚠️  Some tests failed. Please review and fix issues.${NC}"
    echo -e "${YELLOW}📝 Check the output above for specific failures${NC}"
fi

echo ""
echo -e "${BLUE}🚀 NEXT STEPS:${NC}"
echo "1. Ensure all tests pass"
echo "2. Set up real API keys in .env"
echo "3. Test with actual Gemini and LunarCrush APIs"
echo "4. Deploy to production environment"
