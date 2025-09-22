import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {Exercise} from '../data/mockExercises';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';

const {width} = Dimensions.get('window');

interface ExerciseViewerProps {
  route: {
    params: {
      exercises: Exercise[];
      exerciseIndex: number;
    };
  };
  navigation: any;
}

const ExerciseViewer: React.FC<ExerciseViewerProps> = ({route, navigation}) => {
  const {exercises, exerciseIndex} = route.params;
  const [currentIndex, setCurrentIndex] = useState(exerciseIndex);
  const [isRecording, setIsRecording] = useState(false);
  const {userProfile, updateUserProfile} = useAuth();

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    navigation.setOptions({
      title: `Exercise ${currentIndex + 1} of ${exercises.length}`,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Feedback', {exercise: currentExercise})}>
          <Icon name="check" size={24} color="#4CAF50" />
        </TouchableOpacity>
      ),
    });
  }, [currentIndex, navigation, exercises.length, currentExercise]);

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all exercises
      Alert.alert(
        'Practice Complete!',
        'Great job! You\'ve completed all exercises for today.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ],
      );
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRecord = () => {
    // TODO: Implement actual audio recording
    setIsRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      Alert.alert(
        'Recording Complete',
        'Your performance has been recorded! Tap the check button to continue.',
      );
    }, 3000);
  };

  const handleComplete = async () => {
    try {
      // Award XP
      const newXP = userProfile!.xp + currentExercise.xpReward;
      const newExercisesCompleted = userProfile!.exercisesCompleted + 1;
      
      // Update streak if this is the first exercise of the day
      let newStreak = userProfile!.streak;
      const today = new Date().toISOString().split('T')[0];
      if (userProfile!.lastPracticeDate !== today) {
        newStreak += 1;
      }
      
      await updateUserProfile({
        xp: newXP,
        streak: newStreak,
        exercisesCompleted: newExercisesCompleted,
        lastPracticeDate: today,
      });
      
      navigation.navigate('Feedback', {exercise: currentExercise});
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  // Create HTML for VexFlow to render the music notation
  const createMusicHTML = (musicXml: string) => {
    // For now, we'll create a simple placeholder
    // TODO: Integrate with VexFlow or OpenSheetMusicDisplay for proper MusicXML rendering
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              background: white;
            }
            .music-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 200px;
              border: 2px dashed #ddd;
              border-radius: 8px;
              margin: 20px 0;
            }
            .placeholder {
              text-align: center;
              color: #666;
            }
            .exercise-info {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .label {
              font-weight: bold;
              color: #333;
            }
            .value {
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="exercise-info">
            <div class="info-row">
              <span class="label">Title:</span>
              <span class="value">${currentExercise.title}</span>
            </div>
            <div class="info-row">
              <span class="label">Key:</span>
              <span class="value">${currentExercise.key}</span>
            </div>
            <div class="info-row">
              <span class="label">Time Signature:</span>
              <span class="value">${currentExercise.timeSignature}</span>
            </div>
            <div class="info-row">
              <span class="label">Measures:</span>
              <span class="value">${currentExercise.measures}</span>
            </div>
          </div>
          
          <div class="music-container">
            <div class="placeholder">
              <h3>🎵 Sheet Music Display</h3>
              <p>This is where the actual music notation would be rendered.</p>
              <p><strong>TODO:</strong> Integrate with VexFlow or OpenSheetMusicDisplay</p>
              <p>MusicXML data available for rendering</p>
            </div>
          </div>
          
          <script>
            // TODO: Add VexFlow rendering logic here
            // This would parse the MusicXML and render it using VexFlow
            console.log('MusicXML data:', \`${musicXml.replace(/`/g, '\\`')}\`);
          </script>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Exercise Header */}
      <View style={styles.header}>
        <Text style={styles.exerciseTitle}>{currentExercise.title}</Text>
        <View style={styles.exerciseMeta}>
          <View style={styles.metaItem}>
            <Icon name="music-note" size={16} color="#666" />
            <Text style={styles.metaText}>
              {currentExercise.timeSignature} • {currentExercise.key}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="layers" size={16} color="#666" />
            <Text style={styles.metaText}>
              {currentExercise.measures} measures
            </Text>
          </View>
        </View>
      </View>

      {/* Sheet Music Display */}
      <View style={styles.musicContainer}>
        <WebView
          source={{html: createMusicHTML(currentExercise.musicXml)}}
          style={styles.webview}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Recording Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={handleRecord}
          disabled={isRecording}>
          <Icon
            name={isRecording ? 'stop' : 'fiber-manual-record'}
            size={24}
            color={isRecording ? 'white' : '#F44336'}
          />
          <Text style={[styles.recordButtonText, isRecording && styles.recordingButtonText]}>
            {isRecording ? 'Recording...' : 'Record Performance'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}>
          <Icon name="chevron-left" size={24} color={currentIndex === 0 ? '#ccc' : '#4CAF50'} />
          <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {exercises.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === exercises.length - 1 && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={currentIndex === exercises.length - 1}>
          <Text style={[styles.navButtonText, currentIndex === exercises.length - 1 && styles.navButtonTextDisabled]}>
            Next
          </Text>
          <Icon name="chevron-right" size={24} color={currentIndex === exercises.length - 1 ? '#ccc' : '#4CAF50'} />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Read through the music notation carefully{'\n'}
          2. Tap "Record Performance" when ready to play{'\n'}
          3. Play the exercise on your instrument{'\n'}
          4. Tap the check button when finished
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  exerciseMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  musicContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webview: {
    height: 300,
    backgroundColor: 'white',
  },
  controlsContainer: {
    padding: 15,
    alignItems: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#F44336',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#F44336',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 10,
  },
  recordingButtonText: {
    color: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginHorizontal: 5,
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  headerButton: {
    padding: 8,
  },
});

export default ExerciseViewer;


