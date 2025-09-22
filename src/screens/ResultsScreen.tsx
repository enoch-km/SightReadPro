import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

interface ResultsScreenProps {
  results: {
    score: number;
    accuracy: number;
    rhythmScore: number;
    tempoScore: number;
    practiceTime: number;
    mistakes: number;
    xpEarned: number;
    newTotalXp?: number;
    newLevel?: number;
    newStreak?: number;
    streakUpdated?: boolean;
  };
  onBackToHome: () => void;
  onTryAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  onBackToHome,
  onTryAgain,
}) => {
  const scoreScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);
  const xpScale = useSharedValue(0);

  useEffect(() => {
    // Animate score first
    scoreScale.value = withSpring(1, {damping: 8, stiffness: 100});
    
    // Animate stats
    statsOpacity.value = withDelay(300, withSpring(1));
    
    // Animate XP
    xpScale.value = withDelay(600, withSequence(
      withTiming(1.2, {duration: 200}),
      withTiming(1, {duration: 200})
    ));
    
    // Animate buttons
    buttonScale.value = withDelay(900, withSpring(1));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! 🎉';
    if (score >= 70) return 'Good job! 👍';
    if (score >= 50) return 'Keep practicing! 💪';
    return 'Don\'t give up! 🌟';
  };

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scoreScale.value}],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const xpAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: xpScale.value}],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Practice Complete!</Text>
        </View>

        {/* Score Display */}
        <Animated.View style={[styles.scoreContainer, scoreAnimatedStyle]}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreText, {color: getScoreColor(results.score)}]}>
              {results.score}
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
          <Text style={styles.scoreMessage}>
            {getScoreMessage(results.score)}
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Performance Breakdown</Text>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Icon name="target" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{results.accuracy}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="music-note" size={24} color="#FF9800" />
                <Text style={styles.statValue}>{results.rhythmScore}%</Text>
                <Text style={styles.statLabel}>Rhythm</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Icon name="speed" size={24} color="#2196F3" />
                <Text style={styles.statValue}>{results.tempoScore}%</Text>
                <Text style={styles.statLabel}>Tempo</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="error" size={24} color="#F44336" />
                <Text style={styles.statValue}>{results.mistakes}</Text>
                <Text style={styles.statLabel}>Mistakes</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Icon name="timer" size={24} color="#9C27B0" />
                <Text style={styles.statValue}>{results.practiceTime}s</Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="star" size={24} color="#FFD700" />
                <Text style={styles.statValue}>+{results.xpEarned}</Text>
                <Text style={styles.statLabel}>XP Earned</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* XP Celebration */}
        <Animated.View style={[styles.xpContainer, xpAnimatedStyle]}>
          <View style={styles.xpCard}>
            <Icon name="star" size={32} color="#FFD700" />
            <Text style={styles.xpText}>+{results.xpEarned} XP</Text>
            <Text style={styles.xpSubtext}>Great practice session!</Text>
            
            {/* Show updated stats if available from API */}
            {(results.newTotalXp !== undefined || results.newLevel !== undefined || results.newStreak !== undefined) && (
              <View style={styles.updatedStatsContainer}>
                {results.newTotalXp !== undefined && (
                  <Text style={styles.updatedStatsText}>
                    Total XP: {results.newTotalXp}
                  </Text>
                )}
                {results.newLevel !== undefined && (
                  <Text style={styles.updatedStatsText}>
                    Level: {results.newLevel}
                  </Text>
                )}
                {results.newStreak !== undefined && (
                  <Text style={styles.updatedStatsText}>
                    Streak: {results.newStreak} days
                    {results.streakUpdated && ' 🔥'}
                  </Text>
                )}
              </View>
            )}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={onTryAgain}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.buttonGradient}>
              <Icon name="refresh" size={24} color="#fff" />
              <Text style={styles.buttonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={onBackToHome}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.buttonGradient}>
              <Icon name="home" size={24} color="#fff" />
              <Text style={styles.buttonText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* TODO Section */}
        <Animated.View style={[styles.todoSection, statsAnimatedStyle]}>
          <Text style={styles.todoTitle}>🔧 Backend Integration TODO</Text>
          <Text style={styles.todoText}>
            • Connect to /submit_performance endpoint{'\n'}
            • Update user XP and streak{'\n'}
            • Save performance data{'\n'}
            • Generate personalized feedback
          </Text>
        </Animated.View>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
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
  xpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  xpCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  xpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
  },
  xpSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  updatedStatsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  updatedStatsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tryAgainButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  homeButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 25,
    overflow: 'hidden',
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
  todoSection: {
    backgroundColor: 'rgba(255, 243, 205, 0.9)',
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

export default ResultsScreen;
