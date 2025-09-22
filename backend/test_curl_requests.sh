#!/bin/bash

echo "🎵 SightReadPro API - Test Script"
echo "=================================="
echo ""

# Base URL
BASE_URL="http://localhost:8000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    echo "Endpoint: ${method} ${endpoint}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}${endpoint}")
    elif [ "$method" = "POST" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "${BASE_URL}${endpoint}")
        else
            response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}${endpoint}")
        fi
    fi
    
    # Extract HTTP status and response body
    http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
    response_body=$(echo "$response" | grep -v "HTTP_STATUS:")
    
    if [ "$http_status" -ge 200 ] && [ "$http_status" -lt 300 ]; then
        echo -e "${GREEN}✅ Success (HTTP ${http_status})${NC}"
    else
        echo -e "${RED}❌ Failed (HTTP ${http_status})${NC}"
    fi
    
    echo "Response: $response_body"
    echo "---"
    echo ""
}

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s "${BASE_URL}/health" > /dev/null; then
    echo -e "${GREEN}✅ Server is running${NC}"
    echo ""
else
    echo -e "${RED}❌ Server is not running. Please start the server first:${NC}"
    echo "cd backend && uvicorn main:app --reload"
    echo ""
    exit 1
fi

echo "🚀 Starting API tests..."
echo ""

# Test 1: Root endpoint
test_endpoint "GET" "/" "Root endpoint"

# Test 2: Health check
test_endpoint "GET" "/health" "Health check"

# Test 3: API info
test_endpoint "GET" "/api/info" "API information"

# Test 4: Get all exercises
test_endpoint "GET" "/exercises/" "Get all exercises"

# Test 5: Get exercises by difficulty
test_endpoint "GET" "/exercises/difficulty/easy" "Get easy exercises"

# Test 6: Get random exercises
test_endpoint "GET" "/exercises/random/3" "Get 3 random exercises"

# Test 7: Get exercise stats
test_endpoint "GET" "/exercises/stats/summary" "Get exercise statistics"

# Test 8: Search exercises
test_endpoint "GET" "/exercises/search/C" "Search exercises for 'C'"

# Test 9: Get daily exercises for user
test_endpoint "GET" "/exercises/daily/test_user_123" "Get daily exercises for test user"

# Test 10: Get user profile
test_endpoint "GET" "/users/test_user_123/profile" "Get user profile"

# Test 11: Get user progress
test_endpoint "GET" "/users/test_user_123/progress" "Get user progress"

# Test 12: Get user stats
test_endpoint "GET" "/users/test_user_123/stats" "Get user statistics"

# Test 13: Submit performance
performance_data='{
    "user_id": "test_user_123",
    "exercise_id": 1,
    "score": 85,
    "accuracy": 88.5,
    "rhythm_score": 82.0,
    "tempo_score": 90.0,
    "practice_time_seconds": 180,
    "mistakes_count": 2,
    "notes_played": ["C4", "D4", "E4", "F4"],
    "performance_data": {
        "tempo_variations": [120, 118, 122],
        "dynamics": ["mf", "mp", "f"]
    }
}'
test_endpoint "POST" "/users/submit_performance" "Submit performance data" "$performance_data"

# Test 14: List uploaded files
test_endpoint "GET" "/upload/files" "List uploaded files"

# Test 15: Get specific exercise
test_endpoint "GET" "/exercises/1" "Get exercise by ID"

echo "🎉 All tests completed!"
echo ""
echo "📖 API Documentation: ${BASE_URL}/docs"
echo "🔍 Health Check: ${BASE_URL}/health"
echo "🌐 API Info: ${BASE_URL}/api/info"
echo ""

# Test file upload (optional - requires actual file)
echo -e "${YELLOW}📁 File Upload Test (Optional)${NC}"
echo "To test file upload, you can use:"
echo ""
echo "1. Upload a MusicXML file:"
echo "   curl -X POST -F 'file=@your_file.musicxml' ${BASE_URL}/upload/score"
echo ""
echo "2. Upload a PDF/JPG file:"
echo "   curl -X POST -F 'file=@your_file.pdf' ${BASE_URL}/upload/score"
echo ""
echo "3. Upload a JPG file:"
echo "   curl -X POST -F 'file=@your_file.jpg' ${BASE_URL}/upload/score"
echo ""

echo "✨ Happy testing!"
