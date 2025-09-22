import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const {userProfile, logout} = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ],
    );
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Novice Musician';
    if (level < 10) return 'Amateur Player';
    if (level < 15) return 'Intermediate Musician';
    if (level < 20) return 'Advanced Player';
    if (level < 25) return 'Expert Musician';
    return 'Master Sight Reader';
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (userProfile!.exercisesCompleted >= 10) {
      achievements.push({
        icon: '🎯',
        title: 'First Steps',
        description: 'Complete 10 exercises',
        unlocked: true,
      });
    }
    
    if (userProfile!.streak >= 7) {
      achievements.push({
        icon: '🔥',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        unlocked: true,
      });
    }
    
    if (userProfile!.streak >= 30) {
      achievements.push({
        icon: '⚡',
        title: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        unlocked: true,
      });
    }
    
    if (userProfile!.xp >= 500) {
      achievements.push({
        icon: '🏆',
        title: 'XP Champion',
        description: 'Earn 500 XP',
        unlocked: true,
      });
    }
    
    // Add locked achievements
    if (userProfile!.exercisesCompleted < 50) {
      achievements.push({
        icon: '🎼',
        title: 'Sheet Music Savant',
        description: 'Complete 50 exercises',
        unlocked: false,
      });
    }
    
    if (userProfile!.streak < 100) {
      achievements.push({
        icon: '💎',
        title: 'Century Streak',
        description: 'Maintain a 100-day streak',
        unlocked: false,
      });
    }
    
    return achievements;
  };

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const level = calculateLevel(userProfile.xp);
  const levelTitle = getLevelTitle(level);
  const achievements = getAchievements();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={60} color="#4CAF50" />
        </View>
        <Text style={styles.userName}>
          {userProfile.email.split('@')[0]}
        </Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.exercisesCompleted}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Progress</Text>
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Next Level</Text>
          <Text style={styles.progressValue}>
            {userProfile.xp % 100}/100 XP
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${(userProfile.xp % 100)}%`},
              ]}
            />
          </View>
        </View>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Daily Goal</Text>
          <Text style={styles.progressValue}>
            {userProfile.lastPracticeDate === new Date().toISOString().split('T')[0] ? 'Completed' : 'Missed'}
          </Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.cardTitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementInfo}>
              <Text style={[
                styles.achievementTitle,
                {color: achievement.unlocked ? '#333' : '#ccc'}
              ]}>
                {achievement.title}
              </Text>
              <Text style={[
                styles.achievementDescription,
                {color: achievement.unlocked ? '#666' : '#ccc'}
              ]}>
                {achievement.description}
              </Text>
            </View>
            <Icon
              name={achievement.unlocked ? 'check-circle' : 'lock'}
              size={24}
              color={achievement.unlocked ? '#4CAF50' : '#ccc'}
            />
          </View>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="notifications" size={24} color="#666" />
          <Text style={styles.settingText}>Notifications</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="volume-up" size={24} color="#666" />
          <Text style={styles.settingText}>Sound Settings</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="help" size={24} color="#666" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#F44336" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  progressCard: {
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
  progressItem: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  achievementsCard: {
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
  },
  settingsCard: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 30,
    padding: 15,
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
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 10,
  },
});

export default ProfileScreen;


