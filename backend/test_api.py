#!/usr/bin/env python3
"""
Test script for SightReadPro FastAPI backend
Run this to test the API endpoints without authentication
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server")
        print("   Make sure the server is running on http://localhost:8000")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n🏠 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Root endpoint passed")
            data = response.json()
            print(f"   Message: {data.get('message')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Endpoints: {data.get('endpoints')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_docs_endpoint():
    """Test the API documentation endpoint"""
    print("\n📚 Testing docs endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ Docs endpoint passed")
            print("   Swagger UI is accessible")
        else:
            print(f"❌ Docs endpoint failed: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Docs endpoint error: {e}")
        return False

def test_upload_score_without_auth():
    """Test upload_score endpoint without authentication (should fail)"""
    print("\n📊 Testing upload_score without authentication...")
    
    score_data = {
        "exercise_id": "test_exercise_123",
        "user_id": "test_user_456",
        "accuracy_score": 85.5,
        "rhythm_score": 78.0,
        "tempo_score": 92.0,
        "overall_score": 85.2,
        "practice_time_seconds": 180,
        "mistakes_count": 3,
        "notes_played": ["C4", "D4", "E4", "F4"],
        "performance_data": {
            "tempo_variations": [120, 118, 122],
            "dynamics": ["mf", "mp", "f"]
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/upload_score",
            json=score_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 401:
            print("✅ Upload score correctly rejected without authentication")
            print("   This is expected behavior")
            return True
        else:
            print(f"❌ Upload score should have failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Upload score test error: {e}")
        return False

def test_get_daily_exercises_without_auth():
    """Test get_daily_exercises endpoint without authentication (should fail)"""
    print("\n🎵 Testing get_daily_exercises without authentication...")
    
    try:
        response = requests.get(f"{BASE_URL}/get_daily_exercises")
        
        if response.status_code == 401:
            print("✅ Get daily exercises correctly rejected without authentication")
            print("   This is expected behavior")
            return True
        else:
            print(f"❌ Get daily exercises should have failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Get daily exercises test error: {e}")
        return False

def test_api_structure():
    """Test the overall API structure and response formats"""
    print("\n🏗️  Testing API structure...")
    
    try:
        # Test root endpoint structure
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            required_fields = ['message', 'version', 'endpoints']
            
            for field in required_fields:
                if field not in data:
                    print(f"❌ Missing required field: {field}")
                    return False
            
            print("✅ API structure is correct")
            print(f"   Required fields: {required_fields}")
            return True
        else:
            print(f"❌ Could not verify API structure: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API structure test error: {e}")
        return False

def run_all_tests():
    """Run all tests and provide summary"""
    print("🎵 SightReadPro API Test Suite")
    print("=" * 40)
    print(f"Testing API at: {BASE_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    
    tests = [
        ("Health Check", test_health_check),
        ("Root Endpoint", test_root_endpoint),
        ("Documentation", test_docs_endpoint),
        ("Upload Score (No Auth)", test_upload_score_without_auth),
        ("Get Daily Exercises (No Auth)", test_get_daily_exercises_without_auth),
        ("API Structure", test_api_structure)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 40)
    print("📊 TEST SUMMARY")
    print("=" * 40)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
        print("\nNext steps:")
        print("1. Set up Firebase authentication")
        print("2. Test authenticated endpoints")
        print("3. Integrate with your React Native app")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        print("\nCommon issues:")
        print("1. API server not running")
        print("2. Wrong port number")
        print("3. Network connectivity issues")
    
    return passed == total

if __name__ == "__main__":
    run_all_tests()


