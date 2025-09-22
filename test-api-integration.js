/**
 * Test script to verify API integration
 * Run this with: node test-api-integration.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000';

async function testApiIntegration() {
  console.log('🧪 Testing SightReadPro API Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing API Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    console.log('   Database:', healthResponse.data.database);
    console.log('   Version:', healthResponse.data.version);
    console.log('');

    // Test 2: API Info
    console.log('2️⃣ Testing API Info...');
    const infoResponse = await axios.get(`${API_BASE_URL}/api/info`);
    console.log('✅ API Info:', infoResponse.data.name);
    console.log('   Version:', infoResponse.data.version);
    console.log('   Features:', Object.keys(infoResponse.data.features).join(', '));
    console.log('');

    // Test 3: Get Daily Exercises
    console.log('3️⃣ Testing Get Daily Exercises...');
    const exercisesResponse = await axios.get(`${API_BASE_URL}/exercises/daily/user123?limit=3`);
    console.log('✅ Daily Exercises:', exercisesResponse.data.total_count, 'exercises');
    console.log('   User ID:', exercisesResponse.data.user_id);
    console.log('   Date:', exercisesResponse.data.date);
    exercisesResponse.data.exercises.forEach((ex, index) => {
      console.log(`   Exercise ${index + 1}: ${ex.title} (${ex.difficulty}) - ${ex.xp_reward} XP`);
    });
    console.log('');

    // Test 4: Submit Performance
    console.log('4️⃣ Testing Submit Performance...');
    const performanceData = {
      user_id: 'user123',
      exercise_id: 1,
      score: 85,
      accuracy: 90,
      rhythm_score: 80,
      tempo_score: 85,
      practice_time_seconds: 30,
      mistakes_count: 2,
      notes_played: ['C4', 'D4', 'E4', 'F4'],
      performance_data: {
        exercise_title: 'Test Exercise',
        measures: '1-4',
        difficulty: 'easy'
      }
    };

    const performanceResponse = await axios.post(`${API_BASE_URL}/users/submit_performance`, performanceData);
    console.log('✅ Performance Submitted:', performanceResponse.data.message);
    console.log('   XP Earned:', performanceResponse.data.xp_earned);
    console.log('   New Total XP:', performanceResponse.data.new_total_xp);
    console.log('   New Level:', performanceResponse.data.new_level);
    console.log('   New Streak:', performanceResponse.data.new_streak);
    console.log('   Streak Updated:', performanceResponse.data.streak_updated);
    console.log('');

    // Test 5: Get User Progress
    console.log('5️⃣ Testing Get User Progress...');
    const progressResponse = await axios.get(`${API_BASE_URL}/users/user123/progress`);
    console.log('✅ User Progress:');
    console.log('   Current XP:', progressResponse.data.current_xp);
    console.log('   Current Level:', progressResponse.data.current_level);
    console.log('   Current Streak:', progressResponse.data.current_streak);
    console.log('   Total Exercises:', progressResponse.data.total_exercises_completed);
    console.log('   Average Score:', progressResponse.data.average_score);
    console.log('');

    console.log('🎉 All API tests passed! The backend is ready for integration.');
    console.log('\n📱 Next steps:');
    console.log('   1. Start the React Native app: npm run android or npm run ios');
    console.log('   2. The app will automatically connect to the API');
    console.log('   3. Check the console logs for API status indicators');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Make sure the FastAPI backend is running:');
      console.log('      cd backend && python main.py');
      console.log('   2. Check that the backend is running on http://localhost:8000');
      console.log('   3. Verify the database is initialized');
    } else if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Response:', error.response.data);
    }
  }
}

// Run the test
testApiIntegration();
