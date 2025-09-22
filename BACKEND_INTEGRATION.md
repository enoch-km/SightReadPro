# Backend Integration Guide 🔗

This guide explains how to integrate your SightReadPro React Native app with the FastAPI backend.

## Overview 📋

The FastAPI backend provides two main endpoints that your React Native app can use:
- `POST /upload_score` - Submit exercise performance scores
- `GET /get_daily_exercises` - Retrieve daily exercises

## Backend Setup 🚀

### 1. Start the Backend Server

```bash
cd backend
./start.sh
```

Or using Docker:
```bash
cd backend
docker-compose up --build
```

The server will run on `http://localhost:8000`

### 2. Verify Backend is Running

Visit `http://localhost:8000/docs` to see the interactive API documentation.

## React Native Integration 🔧

### 1. Create API Service

Create a new file `src/services/api.ts`:

```typescript
import {auth} from '../config/firebase';

const API_BASE_URL = 'http://localhost:8000'; // Change for production

class ApiService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadScore(scoreData: {
    exercise_id: string;
    user_id: string;
    accuracy_score: number;
    rhythm_score: number;
    tempo_score: number;
    overall_score: number;
    practice_time_seconds: number;
    mistakes_count: number;
    notes_played: string[];
    performance_data: Record<string, any>;
  }) {
    return this.makeRequest('/upload_score', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  async getDailyExercises(params?: {
    difficulty?: string;
    category?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/get_daily_exercises${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }
}

export const apiService = new ApiService();
```

### 2. Update ExerciseViewer Component

Modify `src/components/ExerciseViewer.tsx` to use the backend:

```typescript
// Add import
import {apiService} from '../services/api';

// Update the handleComplete function
const handleComplete = async () => {
  try {
    // Generate performance scores (replace with real analysis)
    const accuracyScore = Math.random() * 30 + 70; // 70-100%
    const rhythmScore = accuracyScore + (Math.random() * 10 - 5); // ±5 from accuracy
    const tempoScore = accuracyScore + (Math.random() * 10 - 5); // ±5 from accuracy
    const overallScore = (accuracyScore + rhythmScore + tempoScore) / 3;

    const scoreData = {
      exercise_id: currentExercise.id,
      user_id: userProfile!.uid,
      accuracy_score: accuracyScore,
      rhythm_score: rhythmScore,
      tempo_score: tempoScore,
      overall_score: overallScore,
      practice_time_seconds: 180, // Replace with actual practice time
      mistakes_count: Math.floor(Math.random() * 5), // Replace with actual count
      notes_played: ['C4', 'D4', 'E4', 'F4'], // Replace with actual notes
      performance_data: {
        tempo_variations: [120, 118, 122],
        dynamics: ['mf', 'mp', 'f']
      }
    };

    // Submit score to backend
    const result = await apiService.uploadScore(scoreData);
    
    // Update local user profile
    await updateUserProfile({
      xp: result.total_xp,
      exercisesCompleted: userProfile!.exercisesCompleted + 1,
      lastPracticeDate: new Date().toISOString().split('T')[0],
    });

    // Navigate to feedback screen
    navigation.navigate('Feedback', {
      exercise: currentExercise,
      scoreResult: result
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    Alert.alert('Error', 'Failed to submit score. Please try again.');
  }
};
```

### 3. Update Dashboard Screen

Modify `src/screens/DashboardScreen.tsx` to fetch exercises from backend:

```typescript
// Add import
import {apiService} from '../services/api';

// Update useEffect
useEffect(() => {
  const loadDailyExercises = async () => {
    try {
      const result = await apiService.getDailyExercises({limit: 5});
      setDailyExercises(result.exercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
      // Fallback to mock data
      setDailyExercises(getDailyExercises());
    }
  };

  loadDailyExercises();
}, []);
```

### 4. Update Practice Screen

Similarly, update `src/screens/PracticeScreen.tsx`:

```typescript
// Add import
import {apiService} from '../services/api';

// Update useEffect
useEffect(() => {
  const loadDailyExercises = async () => {
    try {
      const result = await apiService.getDailyExercises({limit: 10});
      setDailyExercises(result.exercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
      // Fallback to mock data
      setDailyExercises(getDailyExercises());
    }
  };

  loadDailyExercises();
}, []);
```

## Testing the Integration 🧪

### 1. Test Backend Endpoints

Run the test script:
```bash
cd backend
python3 test_api.py
```

### 2. Test with React Native App

1. Start the backend server
2. Start your React Native app
3. Complete an exercise
4. Check the backend logs for the score submission
5. Verify the user profile is updated in Firebase

### 3. Monitor API Calls

Check the backend console for incoming requests and any errors.

## Production Configuration 🌐

### 1. Update API Base URL

Change the `API_BASE_URL` in your API service to your production backend URL:

```typescript
const API_BASE_URL = 'https://your-backend-domain.com';
```

### 2. Environment Variables

Create environment-specific configurations:

```typescript
// src/config/environment.ts
export const environment = {
  development: {
    apiUrl: 'http://localhost:8000',
  },
  production: {
    apiUrl: 'https://your-backend-domain.com',
  },
};

export const getApiUrl = () => {
  if (__DEV__) {
    return environment.development.apiUrl;
  }
  return environment.production.apiUrl;
};
```

### 3. Error Handling

Implement proper error handling for network issues:

```typescript
private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  try {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
}
```

## Troubleshooting 🔧

### Common Issues

**1. CORS Errors**
- Ensure backend CORS is configured for your app's origin
- Check `ALLOWED_ORIGINS` in backend environment

**2. Authentication Errors**
- Verify Firebase token is being sent correctly
- Check backend Firebase Admin SDK configuration

**3. Network Errors**
- Ensure backend server is running
- Check API base URL in React Native app
- Verify network permissions in app

**4. Data Format Issues**
- Ensure request/response data matches Pydantic models
- Check data types (numbers vs strings)

### Debug Steps

1. **Check Backend Logs**
   ```bash
   # Look for incoming requests and errors
   cd backend
   python3 main.py
   ```

2. **Test API Manually**
   ```bash
   # Test endpoints with curl
   curl http://localhost:8000/health
   ```

3. **Verify Firebase Connection**
   - Check Firebase service account key
   - Verify Firestore permissions

4. **Check React Native Network**
   - Use React Native Debugger
   - Check network tab for failed requests

## Next Steps 🚀

After successful integration:

1. **Add Real Performance Analysis**
   - Implement audio recording
   - Add note detection algorithms
   - Calculate real accuracy scores

2. **Enhance Exercise Management**
   - Add exercise categories
   - Implement difficulty progression
   - Add user-specific exercise recommendations

3. **Add Analytics**
   - Track practice patterns
   - Generate progress reports
   - Identify improvement areas

4. **Performance Optimization**
   - Implement caching
   - Add request batching
   - Optimize database queries

---

**Need help?** Check the troubleshooting section or create an issue in the repository.


