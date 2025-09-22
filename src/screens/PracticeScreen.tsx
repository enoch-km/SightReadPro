import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {getDailyExercises, Exercise} from '../data/mockExercises';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PracticeScreen = ({navigation}: any) => {
  const {userProfile} = useAuth();
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setDailyExercises(getDailyExercises());
  }, []);

  const handleStartExercise = (exercise: Exercise, index: number) => {
    navigation.navigate('ExerciseViewer', {
      exercises: dailyExercises,
      exerciseIndex: index,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'star';
      case 'intermediate':
        return 'star-half';
      case 'advanced':
        return 'stars';
      default:
        return 'star-border';
    }
  };

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Practice</Text>
        <Text style={styles.headerSubtitle}>
          {dailyExercises.length} exercises available today
        </Text>
      </View>

      {dailyExercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="music-off" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No exercises available</Text>
          <Text style={styles.emptyStateSubtext}>
            Check back tomorrow for new exercises!
          </Text>
        </View>
      ) : (
        dailyExercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="music-note" size={16} color="#666" />
                    <Text style={styles.metaText}>
                      {exercise.timeSignature} • {exercise.key}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="layers" size={16} color="#666" />
                    <Text style={styles.metaText}>
                      {exercise.measures} measures
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.difficultyContainer}>
                <Icon
                  name={getDifficultyIcon(exercise.difficulty)}
                  size={20}
                  color={getDifficultyColor(exercise.difficulty)}
                />
                <Text
                  style={[
                    styles.difficultyText,
                    {color: getDifficultyColor(exercise.difficulty)},
                  ]}>
                  {exercise.difficulty.charAt(0).toUpperCase() +
                    exercise.difficulty.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.exerciseFooter}>
              <View style={styles.xpReward}>
                <Icon name="emoji-events" size={20} color="#FFD700" />
                <Text style={styles.xpText}>+{exercise.xpReward} XP</Text>
              </View>
              
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => handleStartExercise(exercise, index)}>
                <Icon name="play-arrow" size={20} color="white" />
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Practice Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Practice Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Take your time to read the notes before playing
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Focus on rhythm and timing
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Practice slowly at first, then increase tempo
          </Text>
        </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 15,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exerciseMeta: {
    gap: 5,
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
  difficultyContainer: {
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  xpReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tipsCard: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default PracticeScreen;


