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
import {Exercise} from '../data/mockExercises';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FeedbackScreenProps {
  route: {
    params: {
      exercise: Exercise;
    };
  };
  navigation: any;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({route, navigation}) => {
  const {exercise} = route.params;
  const {userProfile} = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate random performance score (placeholder for real AI analysis)
  const performanceScore = Math.floor(Math.random() * 30) + 70; // 70-100%
  const accuracyBonus = Math.floor(performanceScore / 10) * 2; // Bonus XP for accuracy
  const totalXP = exercise.xpReward + accuracyBonus;

  useEffect(() => {
    // Show confetti effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const getPerformanceMessage = (score: number) => {
    if (score >= 95) return 'Perfect! Outstanding performance! 🎉';
    if (score >= 85) return 'Excellent! Great job! 👏';
    if (score >= 75) return 'Good work! Keep practicing! 💪';
    if (score >= 65) return 'Not bad! Room for improvement. 📈';
    return 'Keep practicing! You\'ll get better! 🎯';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const handleContinue = () => {
    navigation.navigate('MainTabs');
  };

  const handlePracticeAgain = () => {
    navigation.goBack();
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercise Complete!</Text>
        <Text style={styles.headerSubtitle}>
          Great job completing "{exercise.title}"
        </Text>
      </View>

      {/* Performance Score */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{performanceScore}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
        </View>
        
        <Text style={[
          styles.performanceMessage,
          {color: getPerformanceColor(performanceScore)}
        ]}>
          {getPerformanceMessage(performanceScore)}
        </Text>
      </View>

      {/* XP Rewards */}
      <View style={styles.rewardsCard}>
        <Text style={styles.cardTitle}>🎉 XP Rewards</Text>
        
        <View style={styles.rewardItem}>
          <View style={styles.rewardInfo}>
            <Icon name="emoji-events" size={24} color="#FFD700" />
            <Text style={styles.rewardText}>Exercise Completion</Text>
          </View>
          <Text style={styles.rewardValue}>+{exercise.xpReward} XP</Text>
        </View>
        
        <View style={styles.rewardItem}>
          <View style={styles.rewardInfo}>
            <Icon name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.rewardText}>Accuracy Bonus</Text>
          </View>
          <Text style={styles.rewardValue}>+{accuracyBonus} XP</Text>
        </View>
        
        <View style={styles.totalReward}>
          <Text style={styles.totalLabel}>Total XP Earned</Text>
          <Text style={styles.totalValue}>+{totalXP} XP</Text>
        </View>
      </View>

      {/* Performance Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.cardTitle}>📊 Performance Breakdown</Text>
        
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Note Accuracy</Text>
          <View style={styles.breakdownBar}>
            <View
              style={[
                styles.breakdownFill,
                {
                  width: `${performanceScore}%`,
                  backgroundColor: getPerformanceColor(performanceScore),
                },
              ]}
            />
          </View>
          <Text style={styles.breakdownValue}>{performanceScore}%</Text>
        </View>
        
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Rhythm</Text>
          <View style={styles.breakdownBar}>
            <View
              style={[
                styles.breakdownFill,
                {
                  width: `${performanceScore - 5}%`,
                  backgroundColor: getPerformanceColor(performanceScore - 5),
                },
              ]}
            />
          </View>
          <Text style={styles.breakdownValue}>{Math.max(0, performanceScore - 5)}%</Text>
        </View>
        
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Tempo</Text>
          <View style={styles.breakdownBar}>
            <View
              style={[
                styles.breakdownFill,
                {
                  width: `${performanceScore + 3}%`,
                  backgroundColor: getPerformanceColor(performanceScore + 3),
                },
              ]}
            />
          </View>
          <Text style={styles.breakdownValue}>{Math.min(100, performanceScore + 3)}%</Text>
        </View>
      </View>

      {/* Tips for Improvement */}
      <View style={styles.tipsCard}>
        <Text style={styles.cardTitle}>💡 Tips for Improvement</Text>
        
        {performanceScore < 90 && (
          <>
            <View style={styles.tipItem}>
              <Icon name="lightbulb" size={20} color="#FFC107" />
              <Text style={styles.tipText}>
                Practice this exercise at a slower tempo to improve accuracy
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="lightbulb" size={20} color="#FFC107" />
              <Text style={styles.tipText}>
                Focus on reading ahead while playing
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="lightbulb" size={20} color="#FFC107" />
              <Text style={styles.tipText}>
                Use a metronome to improve rhythm consistency
              </Text>
            </View>
          </>
        )}
        
        {performanceScore >= 90 && (
          <View style={styles.tipItem}>
            <Icon name="star" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Excellent performance! Try increasing the tempo for a challenge
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.practiceAgainButton}
          onPress={handlePracticeAgain}>
          <Icon name="replay" size={20} color="white" />
          <Text style={styles.practiceAgainButtonText}>Practice Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Icon name="check-circle" size={20} color="white" />
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Update */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>📈 Your Progress</Text>
        <Text style={styles.progressText}>
          You're now at <Text style={styles.progressHighlight}>{userProfile.xp + totalXP} XP</Text>!
        </Text>
        <Text style={styles.progressSubtext}>
          Keep practicing daily to maintain your streak and level up faster!
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
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  performanceMessage: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  rewardsCard: {
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  totalReward: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  breakdownCard: {
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
  breakdownItem: {
    marginBottom: 20,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  breakdownBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  tipsCard: {
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
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    gap: 15,
  },
  practiceAgainButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  practiceAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 30,
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
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressHighlight: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default FeedbackScreen;


