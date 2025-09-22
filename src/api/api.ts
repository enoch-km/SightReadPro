import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for API responses
export interface Exercise {
  id: number;
  measures: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  key_signature: string;
  time_signature: string;
  notes: string[];
  rhythm_pattern: string[];
  xp_reward: number;
  created_at: string;
}

export interface DailyExercisesResponse {
  user_id: string;
  date: string;
  exercises: Exercise[];
  total_count: number;
}

export interface UploadResponse {
  message: string;
  filename: string;
  file_type: 'PDF' | 'JPG' | 'JPEG' | 'PNG' | 'MUSICXML' | 'XML';
  exercises: Exercise[] | null;
}

export interface PerformanceResponse {
  message: string;
  user_id: string;
  exercise_id: number;
  score: number;
  xp_earned: number;
  new_total_xp: number;
  new_level: number;
  streak_updated: boolean;
  new_streak: number;
}

export interface UserProgress {
  user_id: string;
  current_xp: number;
  current_level: number;
  current_streak: number;
  last_active_date: string;
  total_exercises_completed: number;
  average_score: number;
}

// API Functions

/**
 * Upload a score file (PDF, JPG, or MusicXML) and get generated exercises
 * @param file - The file to upload
 * @returns Promise<UploadResponse>
 */
export const uploadScore = async (file: any): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'uploaded_file',
    } as any);

    const response: AxiosResponse<UploadResponse> = await apiClient.post(
      '/upload/score',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Upload score error:', error);
    throw new Error(
      error.response?.data?.detail || 
      error.message || 
      'Failed to upload score file'
    );
  }
};

/**
 * Get daily exercises for a specific user
 * @param userId - The user ID
 * @param limit - Number of exercises to return (default: 5)
 * @param difficulty - Filter by difficulty level (optional)
 * @returns Promise<DailyExercisesResponse>
 */
export const getDailyExercises = async (
  userId: string,
  limit: number = 5,
  difficulty?: 'easy' | 'medium' | 'hard'
): Promise<DailyExercisesResponse> => {
  try {
    const params: any = { limit };
    if (difficulty) {
      params.difficulty = difficulty;
    }

    const response: AxiosResponse<DailyExercisesResponse> = await apiClient.get(
      `/exercises/daily/${userId}`,
      { params }
    );

    return response.data;
  } catch (error: any) {
    console.error('Get daily exercises error:', error);
    throw new Error(
      error.response?.data?.detail || 
      error.message || 
      'Failed to fetch daily exercises'
    );
  }
};

/**
 * Submit user performance for an exercise
 * @param userId - The user ID
 * @param exerciseId - The exercise ID
 * @param score - The performance score (0-100)
 * @param additionalData - Additional performance data (optional)
 * @returns Promise<PerformanceResponse>
 */
export const submitPerformance = async (
  userId: string,
  exerciseId: number,
  score: number,
  additionalData?: {
    accuracy?: number;
    rhythm_score?: number;
    tempo_score?: number;
    practice_time_seconds?: number;
    mistakes_count?: number;
    notes_played?: string[];
    performance_data?: any;
  }
): Promise<PerformanceResponse> => {
  try {
    const performanceData = {
      user_id: userId,
      exercise_id: exerciseId,
      score,
      ...additionalData,
    };

    const response: AxiosResponse<PerformanceResponse> = await apiClient.post(
      '/users/submit_performance',
      performanceData
    );

    return response.data;
  } catch (error: any) {
    console.error('Submit performance error:', error);
    throw new Error(
      error.response?.data?.detail || 
      error.message || 
      'Failed to submit performance'
    );
  }
};

/**
 * Get user progress and statistics
 * @param userId - The user ID
 * @returns Promise<UserProgress>
 */
export const getUserProgress = async (userId: string): Promise<UserProgress> => {
  try {
    const response: AxiosResponse<UserProgress> = await apiClient.get(
      `/users/${userId}/progress`
    );

    return response.data;
  } catch (error: any) {
    console.error('Get user progress error:', error);
    throw new Error(
      error.response?.data?.detail || 
      error.message || 
      'Failed to fetch user progress'
    );
  }
};

/**
 * Get user profile information
 * @param userId - The user ID
 * @returns Promise<User>
 */
export const getUserProfile = async (userId: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await apiClient.get(
      `/users/${userId}/profile`
    );

    return response.data;
  } catch (error: any) {
    console.error('Get user profile error:', error);
    throw new Error(
      error.response?.data?.detail || 
      error.message || 
      'Failed to fetch user profile'
    );
  }
};

/**
 * Check if the API is healthy and reachable
 * @returns Promise<boolean>
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Get API information
 * @returns Promise<any>
 */
export const getApiInfo = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/api/info');
    return response.data;
  } catch (error: any) {
    console.error('Get API info error:', error);
    throw new Error(
      error.response?.data?.detail || 
      error.message || 
      'Failed to fetch API information'
    );
  }
};

// Export the API client for custom requests
export { apiClient };

// Export default API functions
export default {
  uploadScore,
  getDailyExercises,
  submitPerformance,
  getUserProgress,
  getUserProfile,
  checkApiHealth,
  getApiInfo,
};
