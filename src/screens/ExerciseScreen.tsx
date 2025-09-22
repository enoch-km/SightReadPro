import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import {submitPerformance, checkApiHealth} from '../api/api';
import {useAuth} from '../contexts/AuthContext';

const {width} = Dimensions.get('window');

interface ExerciseScreenProps {
  exercise: {
    id: number;
    measures: string;
    difficulty: string;
    title: string;
    xpReward: number;
  };
  onComplete: (results: any) => void;
  onBack: () => void;
}

const ExerciseScreen: React.FC<ExerciseScreenProps> = ({
  exercise,
  onComplete,
  onBack,
}) => {
  const {userProfile} = useAuth();
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds practice
  const [currentNote, setCurrentNote] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApiOnline, setIsApiOnline] = useState(false);

  const progressScale = useSharedValue(0);
  const noteScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const apiHealthy = await checkApiHealth();
      setIsApiOnline(apiHealthy);
    } catch (error) {
      console.warn('API health check failed:', error);
      setIsApiOnline(false);
    }
  };

  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isStarted && timeRemaining === 0) {
      // Exercise completed - submit to API
      handleExerciseComplete();
    }
  }, [isStarted, timeRemaining, mistakes, exercise.xpReward]);

  const handleExerciseComplete = async () => {
    try {
      setIsSubmitting(true);
      
      const score = Math.max(0, 100 - mistakes * 10);
      const accuracy = Math.max(0, 100 - mistakes * 15);
      const rhythmScore = Math.max(0, 100 - mistakes * 5);
      const tempoScore = 85;
      
      let results = {
        score,
        accuracy,
        rhythmScore,
        tempoScore,
        practiceTime: 30,
        mistakes,
        xpEarned: exercise.xpReward || exercise.xp_reward || 10,
        newTotalXp: 0,
        newLevel: 1,
        newStreak: 0,
        streakUpdated: false,
      };

      // Try to submit to API if online and user is logged in
      if (isApiOnline && userProfile?.uid) {
        try {
          console.log('🚀 Submitting performance to API...');
          const response = await submitPerformance(
            userProfile.uid,
            exercise.id,
            score,
            {
              accuracy,
              rhythm_score: rhythmScore,
              tempo_score: tempoScore,
              practice_time_seconds: 30,
              mistakes_count: mistakes,
              notes_played: notes.slice(0, currentNote + 1),
              performance_data: {
                exercise_title: exercise.title,
                measures: exercise.measures,
                difficulty: exercise.difficulty,
              },
            }
          );

          console.log('✅ Performance submitted successfully:', response);
          
          // Update results with API response
          results = {
            ...results,
            xpEarned: response.xp_earned,
            newTotalXp: response.new_total_xp,
            newLevel: response.new_level,
            newStreak: response.new_streak,
            streakUpdated: response.streak_updated,
          };
        } catch (apiError) {
          console.warn('⚠️ API submission failed, using local results:', apiError);
          // Continue with local results
        }
      } else {
        console.log('📱 Using local results (API offline or no user)');
        // Use local results
      }

      onComplete(results);
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
      // Still complete with local results
      const results = {
        score: Math.max(0, 100 - mistakes * 10),
        accuracy: Math.max(0, 100 - mistakes * 15),
        rhythmScore: Math.max(0, 100 - mistakes * 5),
        tempoScore: 85,
        practiceTime: 30,
        mistakes,
        xpEarned: exercise.xpReward || exercise.xp_reward || 10,
        newTotalXp: 0,
        newLevel: 1,
        newStreak: 0,
        streakUpdated: false,
      };
      onComplete(results);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isStarted) {
      progressScale.value = withSpring(1);
      
      // Simulate note progression
      const noteInterval = setInterval(() => {
        setCurrentNote(prev => (prev + 1) % notes.length);
        noteScale.value = withSequence(
          withTiming(1.2, {duration: 100}),
          withTiming(1, {duration: 100})
        );
      }, 2000);

      return () => clearInterval(noteInterval);
    }
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    setIsPlaying(true);
  };

  const handleNotePress = (note: string) => {
    const expectedNote = notes[currentNote];
    if (note === expectedNote) {
      // Correct note
      noteScale.value = withSequence(
        withTiming(1.2, {duration: 100}),
        withTiming(1, {duration: 100})
      );
    } else {
      // Wrong note
      setMistakes(prev => prev + 1);
      noteScale.value = withSequence(
        withTiming(0.8, {duration: 100}),
        withTiming(1, {duration: 100})
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: progressScale.value}],
  }));

  const noteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: noteScale.value}],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }));

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  if (!isStarted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#f8f9fa', '#e9ecef']}
          style={styles.gradient}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exercise</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Exercise Info */}
          <View style={styles.exerciseInfo}>
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseMeasures}>
                Measures: {exercise.measures}
              </Text>
              
              <View style={styles.exerciseMeta}>
                <View
                  style={[
                    styles.difficultyBadge,
                    {backgroundColor: getDifficultyColor(exercise.difficulty)},
                  ]}>
                  <Text style={styles.difficultyText}>
                    {exercise.difficulty.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.xpBadge}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.xpText}>{exercise.xpReward} XP</Text>
                </View>
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>How to Practice</Text>
              <Text style={styles.instructionsText}>
                • Tap the notes as they appear{'\n'}
                • Follow the rhythm and tempo{'\n'}
                • Try to minimize mistakes{'\n'}
                • Practice for 30 seconds
              </Text>
            </View>

            {/* Start Button */}
            <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
                onPressIn={onPressIn}
                onPressOut={onPressOut}>
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.startButtonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Icon name="play-arrow" size={32} color="#fff" />
                  <Text style={styles.startButtonText}>Start Practice</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Practice Session</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <Animated.View style={[styles.progressContainer, progressAnimatedStyle]}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${((30 - timeRemaining) / 30) * 100}%`},
              ]}
            />
          </View>
          <Text style={styles.timeText}>{timeRemaining}s remaining</Text>
        </Animated.View>

        {/* Current Note Display */}
        <View style={styles.noteContainer}>
          <Animated.View style={[styles.noteDisplay, noteAnimatedStyle]}>
            <Text style={styles.noteText}>{notes[currentNote]}</Text>
            <Text style={styles.noteSubtext}>Current Note</Text>
          </Animated.View>
        </View>

        {/* Piano Keys */}
        <View style={styles.pianoContainer}>
          <Text style={styles.pianoTitle}>Tap the correct note:</Text>
          <View style={styles.pianoKeys}>
            {notes.map((note, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pianoKey,
                  index === currentNote && styles.activeKey,
                ]}
                onPress={() => handleNotePress(note)}>
                <Text
                  style={[
                    styles.pianoKeyText,
                    index === currentNote && styles.activeKeyText,
                  ]}>
                  {note}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mistakes}</Text>
            <Text style={styles.statLabel}>Mistakes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.max(0, 100 - mistakes * 10)}
            </Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercise.xpReward || exercise.xp_reward || 10}</Text>
            <Text style={styles.statLabel}>XP Reward</Text>
          </View>
        </View>

        {/* API Status and Loading */}
        <View style={styles.apiStatusContainer}>
          <View style={styles.apiStatusRow}>
            <View style={[styles.apiStatusDot, {backgroundColor: isApiOnline ? '#4CAF50' : '#FF9800'}]} />
            <Text style={styles.apiStatusText}>
              {isApiOnline ? 'API Online' : 'Offline Mode'}
            </Text>
          </View>
          {isSubmitting && (
            <View style={styles.submittingContainer}>
              <ActivityIndicator size="small" color="#667eea" />
              <Text style={styles.submittingText}>Submitting results...</Text>
            </View>
          )}
        </View>

        {/* TODO Section */}
        <View style={styles.todoSection}>
          <Text style={styles.todoTitle}>🔧 Backend Integration TODO</Text>
          <Text style={styles.todoText}>
            • Connect to /submit_performance endpoint{'\n'}
            • Implement real audio recording{'\n'}
            • Add MusicXML rendering{'\n'}
            • Real-time performance analysis
          </Text>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  exerciseInfo: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  exerciseMeasures: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  noteContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  noteDisplay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noteText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  noteSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  pianoContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  pianoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  pianoKeys: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  pianoKey: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeKey: {
    backgroundColor: '#4CAF50',
  },
  pianoKeyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeKeyText: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  apiStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  apiStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  apiStatusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submittingText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 8,
    fontWeight: '500',
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

export default ExerciseScreen;
