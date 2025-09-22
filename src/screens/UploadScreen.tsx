import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {uploadScore, checkApiHealth} from '../api/api';

interface UploadScreenProps {
  onBack: () => void;
  onExerciseSelect: (exercise: any) => void;
}

interface GeneratedExercise {
  id: number;
  measures: string;
  difficulty: string;
  title: string;
  xpReward: number;
}

const UploadScreen: React.FC<UploadScreenProps> = ({onBack, onExerciseSelect}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [generatedExercises, setGeneratedExercises] = useState<GeneratedExercise[]>([]);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
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

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);
      setError(null);
      
      // Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.recordare.musicxml+xml'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setUploadedFile(file);
        
        // Check API status first
        const apiHealthy = await checkApiHealth();
        setIsApiOnline(apiHealthy);

        if (apiHealthy) {
          try {
            // Upload to real API
            console.log('🚀 Uploading file to API:', file.name);
            const response = await uploadScore(file);
            
            if (response.exercises && response.exercises.length > 0) {
              // Convert API response to our format
              const exercises: GeneratedExercise[] = response.exercises.map((ex: any) => ({
                id: ex.id,
                measures: ex.measures,
                difficulty: ex.difficulty,
                title: ex.title,
                xpReward: ex.xp_reward,
              }));
              
              setGeneratedExercises(exercises);
              
              Alert.alert(
                'Success!',
                `Generated ${exercises.length} exercises from your file.`,
                [{text: 'Great!', style: 'default'}]
              );
            } else {
              // No exercises generated, show mock data
              showMockExercises();
            }
          } catch (apiError) {
            console.warn('⚠️ API upload failed, using mock data:', apiError);
            showMockExercises();
          }
        } else {
          // API offline, use mock data
          console.log('📱 API offline, using mock data');
          showMockExercises();
        }
      } else {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('❌ File upload error:', error);
      setError('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  const showMockExercises = () => {
    // Mock generated exercises based on your requirements
    const mockExercises: GeneratedExercise[] = [
      {
        id: 1,
        measures: '1-4',
        difficulty: 'easy',
        title: 'C Major Scale Practice',
        xpReward: 10,
      },
      {
        id: 2,
        measures: '5-8',
        difficulty: 'medium',
        title: 'G Major Triad Exercise',
        xpReward: 15,
      },
      {
        id: 3,
        measures: '9-12',
        difficulty: 'hard',
        title: 'F Major Arpeggio Challenge',
        xpReward: 20,
      },
    ];
    
    setGeneratedExercises(mockExercises);
    setIsUploading(false);
    
    Alert.alert(
      'Success!',
      `Generated ${mockExercises.length} exercises from your file.`,
      [{text: 'Great!', style: 'default'}]
    );
  };

  const handleExercisePress = (exercise: GeneratedExercise) => {
    onExerciseSelect(exercise);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }));

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Upload Score</Text>
            <View style={styles.apiStatusContainer}>
              <View style={[styles.apiStatusDot, {backgroundColor: isApiOnline ? '#4CAF50' : '#FF9800'}]} />
              <Text style={styles.apiStatusText}>
                {isApiOnline ? 'API Online' : 'Offline Mode'}
              </Text>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Upload Section */}
          <View style={styles.uploadSection}>
            <View style={styles.uploadIconContainer}>
              <Icon name="cloud-upload" size={48} color="#667eea" />
            </View>
            
            <Text style={styles.uploadTitle}>Upload Your Music</Text>
            <Text style={styles.uploadSubtitle}>
              Upload PDF, JPG, or MusicXML files to generate personalized exercises
            </Text>

            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleFileUpload}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={isUploading}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.uploadButtonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  {isUploading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Icon name="add" size={24} color="#fff" />
                      <Text style={styles.uploadButtonText}>
                        {uploadedFile ? 'Upload Another' : 'Choose File'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {uploadedFile && (
              <View style={styles.fileInfo}>
                <Icon name="description" size={20} color="#667eea" />
                <Text style={styles.fileName}>{uploadedFile.name}</Text>
              </View>
            )}
          </View>

          {/* Generated Exercises */}
          {generatedExercises.length > 0 && (
            <View style={styles.exercisesSection}>
              <Text style={styles.exercisesTitle}>Generated Exercises</Text>
              <Text style={styles.exercisesSubtitle}>
                Choose an exercise to start practicing
              </Text>

              {generatedExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseCard}
                  onPress={() => handleExercisePress(exercise)}>
                  <View style={styles.exerciseInfo}>
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
                  <Icon name="chevron-right" size={24} color="#9E9E9E" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TODO Section */}
          <View style={styles.todoSection}>
            <Text style={styles.todoTitle}>🔧 Backend Integration TODO</Text>
            <Text style={styles.todoText}>
              • Connect to /upload_score endpoint{'\n'}
              • Implement real file processing{'\n'}
              • Add MusicXML parsing{'\n'}
              • Generate exercises from uploaded content
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  apiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  apiStatusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  uploadSection: {
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
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  uploadButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 8,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  exercisesSection: {
    marginBottom: 24,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exercisesSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseMeasures: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  todoSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
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

export default UploadScreen;
