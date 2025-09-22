import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useAuth} from '../contexts/AuthContext';
import {getDailyExercises as getMockDailyExercises} from '../data/mockExercises';
import {getDailyExercises, checkApiHealth, getUserProgress} from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

interface DashboardScreenProps {
  navigation: any;
  onUploadScore: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({navigation, onUploadScore}) => {
  const {userProfile, logout} = useAuth();
  const [dailyExercises, setDailyExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardScale = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    loadDailyExercises();
    
    // Animate cards
    cardScale.value = withSpring(1, {damping: 8, stiffness: 100});
    buttonScale.value = withDelay(300, withSpring(1));
  }, []);

  const loadDailyExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if API is online
      const apiHealthy = await checkApiHealth();
      setIsApiOnline(apiHealthy);

      if (apiHealthy && userProfile?.uid) {
        // Try to fetch from API
        try {
          const response = await getDailyExercises(userProfile.uid, 5);
          setDailyExercises(response.exercises);
          console.log('✅ Fetched daily exercises from API:', response);
        } catch (apiError) {
          console.warn('⚠️ API failed, falling back to mock data:', apiError);
          // Fallback to mock data
          setDailyExercises(getMockDailyExercises());
        }
      } else {
        // Use mock data when API is offline or no user
        console.log('📱 Using mock data (API offline or no user)');
        setDailyExercises(getMockDailyExercises());
      }
    } catch (error) {
      console.error('❌ Error loading daily exercises:', error);
      setError('Failed to load exercises');
      // Fallback to mock data
      setDailyExercises(getMockDailyExercises());
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPractice = () => {
    if (dailyExercises.length === 0) {
      Alert.alert('No Exercises', 'No exercises available for today.');
      return;
    }
    // Navigate to first exercise
    const firstExercise = dailyExercises[0];
    navigation.navigate('Exercise', {
      exercise: {
        id: firstExercise.id,
        measures: '1-4',
        difficulty: firstExercise.difficulty,
        title: firstExercise.title,
        xpReward: firstExercise.xpReward,
      },
    });
  };

  const handleUploadScore = () => {
    onUploadScore();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const calculateProgress = (xp: number) => {
    const level = calculateLevel(xp);
    const levelStartXP = (level - 1) * 100;
    const levelEndXP = level * 100;
    const currentLevelXP = xp - levelStartXP;
    const levelTotalXP = levelEndXP - levelStartXP;
    return (currentLevelXP / levelTotalXP) * 100;
  };

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const level = calculateLevel(userProfile.xp);
  const progress = calculateProgress(userProfile.xp);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: cardScale.value}],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back, {userProfile.email.split('@')[0]}!
            </Text>
            <Text style={styles.subtitle}>Ready to practice?</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* XP and Level Section */}
          <Animated.View style={[styles.xpCard, cardAnimatedStyle]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.xpGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <View style={styles.xpContent}>
                <View style={styles.xpInfo}>
                  <Text style={styles.levelText}>Level {level}</Text>
                  <Text style={styles.xpText}>{userProfile.xp} XP</Text>
                </View>
                <View style={styles.streakInfo}>
                  <Icon name="local-fire-department" size={24} color="#FFD700" />
                  <Text style={styles.streakText}>{userProfile.streak} day streak</Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, {width: `${progress}%`}]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(progress)}% to next level
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Daily Exercises */}
          <Animated.View style={[styles.exercisesCard, cardAnimatedStyle]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Today's Exercises</Text>
              <View style={styles.apiStatusContainer}>
                <View style={[styles.apiStatusDot, {backgroundColor: isApiOnline ? '#4CAF50' : '#FF9800'}]} />
                <Text style={styles.apiStatusText}>
                  {isApiOnline ? 'API Online' : 'Offline Mode'}
                </Text>
              </View>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Loading exercises...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Icon name="error" size={24} color="#F44336" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadDailyExercises} style={styles.retryButton}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.cardSubtitle}>
                  {dailyExercises.length} exercises ready for practice
                </Text>
                
                {dailyExercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseItem}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                      <Text style={styles.exerciseDifficulty}>
                        {exercise.difficulty?.toUpperCase() || 'EASY'} • {exercise.xp_reward || exercise.xpReward || 10} XP
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#9E9E9E" />
                  </View>
                ))}
              </>
            )}
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <TouchableOpacity
              style={styles.practiceButton}
              onPress={handleStartPractice}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.buttonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Icon name="play-arrow" size={24} color="#fff" />
                <Text style={styles.buttonText}>Start Practicing</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadScore}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Icon name="cloud-upload" size={24} color="#fff" />
                <Text style={styles.buttonText}>Upload Score</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View style={[styles.statsCard, cardAnimatedStyle]}>
            <Text style={styles.cardTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="music-note" size={32} color="#4CAF50" />
                <Text style={styles.statNumber}>{userProfile.exercisesCompleted}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="calendar-today" size={32} color="#2196F3" />
                <Text style={styles.statNumber}>
                  {userProfile.lastPracticeDate === new Date().toISOString().split('T')[0] ? 'Today' : 'Missed'}
                </Text>
                <Text style={styles.statLabel}>Last Practice</Text>
              </View>
            </View>
          </Animated.View>

          {/* TODO Section */}
          <View style={styles.todoSection}>
            <Text style={styles.todoTitle}>🔧 Backend Integration TODO</Text>
            <Text style={styles.todoText}>
              • Connect to /get_daily_exercises/{userProfile.uid} endpoint{'\n'}
              • Update user progress and streaks{'\n'}
              • Real-time exercise generation{'\n'}
              • Personalized recommendations
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  xpCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  xpGradient: {
    padding: 24,
  },
  xpContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  xpInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  exercisesCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  apiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  apiStatusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDifficulty: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  practiceButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  todoSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  todoText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default DashboardScreen;


