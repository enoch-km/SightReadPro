#!/bin/bash

echo "🎵 SightReadPro API - Endpoint Testing"
echo "======================================"
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
echo "🔍 Checking if SightReadPro API server is running..."
if curl -s "${BASE_URL}/health" > /dev/null; then
    echo -e "${GREEN}✅ Server is running${NC}"
    echo ""
else
    echo -e "${RED}❌ Server is not running. Please start the server first:${NC}"
    echo "cd backend && uvicorn main:app --reload"
    echo ""
    exit 1
fi

echo "🚀 Starting SightReadPro API endpoint tests..."
echo ""

# Test 1: Root endpoint
test_endpoint "GET" "/" "Root endpoint - Welcome to SightReadPro API"

# Test 2: Health check
test_endpoint "GET" "/health" "Health check endpoint"

# Test 3: API info
test_endpoint "GET" "/api/info" "API information and features"

echo "🎯 Testing Core SightReadPro Endpoints:"
echo ""

# Test 4: Upload score (MusicXML file)
echo -e "${YELLOW}📁 Testing File Upload Endpoint${NC}"
echo "Note: This requires an actual file to upload"
echo "To test with a real MusicXML file, use:"
echo "curl -X POST -F 'file=@your_file.musicxml' ${BASE_URL}/upload/score"
echo ""

# Test 5: Get daily exercises for user
test_endpoint "GET" "/exercises/daily/test_user_123" "Get daily exercises for user (GET /get_daily_exercises/{user_id})"

# Test 6: Submit performance
performance_data='{
    "user_id": "test_user_123",
    "exercise_id": 1,
    "score": 85
}'
test_endpoint "POST" "/users/submit_performance" "Submit performance (POST /submit_performance)" "$performance_data"

# Test 7: Get user progress after performance submission
test_endpoint "GET" "/users/test_user_123/progress" "Get user progress after performance submission"

# Test 8: Get all exercises
test_endpoint "GET" "/exercises/" "Get all available exercises"

# Test 9: Get exercises by difficulty
test_endpoint "GET" "/exercises/difficulty/easy" "Get easy difficulty exercises"

# Test 10: Search exercises
test_endpoint "GET" "/exercises/search/C" "Search exercises for 'C' (key signature)"

echo "🎉 SightReadPro API endpoint tests completed!"
echo ""
echo "📖 API Documentation: ${BASE_URL}/docs"
echo "🔍 Health Check: ${BASE_URL}/health"
echo "🌐 API Info: ${BASE_URL}/api/info"
echo ""

echo -e "${YELLOW}📁 File Upload Testing Instructions${NC}"
echo ""
echo "1. Upload a MusicXML file:"
echo "   curl -X POST -F 'file=@your_file.musicxml' ${BASE_URL}/upload/score"
echo ""
echo "2. Upload a PDF file:"
echo "   curl -X POST -F 'file=@your_file.pdf' ${BASE_URL}/upload/score"
echo ""
echo "3. Upload a JPG file:"
echo "   curl -X POST -F 'file=@your_file.jpg' ${BASE_URL}/upload/score"
echo ""

echo "🎵 Expected MusicXML Response Format:"
echo "When you upload a MusicXML file, you should get:"
echo '{
  "exercises": [
    {"id": 1, "measures": "1-4", "difficulty": "easy"},
    {"id": 2, "measures": "5-8", "difficulty": "medium"}
  ]
}'
echo ""

echo "✨ Happy testing with SightReadPro!"


