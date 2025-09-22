import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider, useAuth} from './contexts/AuthContext';

// Screens
import WelcomeScreenWeb from './screens/WelcomeScreenWeb';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import UploadScreen from './screens/UploadScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {user} = useAuth();
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [practiceResults, setPracticeResults] = useState(null);

  const handleStartApp = () => {
    if (user) {
      setCurrentScreen('Dashboard');
    } else {
      setCurrentScreen('Login');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('Dashboard');
  };

  const handleUploadScore = () => {
    setCurrentScreen('Upload');
  };

  const handleExerciseSelect = (exercise: any) => {
    setCurrentExercise(exercise);
    setCurrentScreen('Exercise');
  };

  const handleExerciseComplete = (results: any) => {
    setPracticeResults(results);
    setCurrentScreen('Results');
  };

  const handleBackToHome = () => {
    setCurrentScreen('Dashboard');
    setCurrentExercise(null);
    setPracticeResults(null);
  };

  const handleTryAgain = () => {
    setCurrentScreen('Exercise');
  };

  const handleBackToUpload = () => {
    setCurrentScreen('Upload');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('Dashboard');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Welcome':
        return <WelcomeScreenWeb onStart={handleStartApp} />;
      case 'Login':
        return <LoginScreen />;
      case 'Dashboard':
        return (
          <DashboardScreen
            navigation={{navigate: () => {}}}
            onUploadScore={handleUploadScore}
          />
        );
      case 'Upload':
        return (
          <UploadScreen
            onBack={handleBackToDashboard}
            onExerciseSelect={handleExerciseSelect}
          />
        );
      case 'Exercise':
        return (
          <ExerciseScreen
            exercise={currentExercise}
            onComplete={handleExerciseComplete}
            onBack={handleBackToUpload}
          />
        );
      case 'Results':
        return (
          <ResultsScreen
            results={practiceResults}
            onBackToHome={handleBackToHome}
            onTryAgain={handleTryAgain}
          />
        );
      default:
        return <WelcomeScreenWeb onStart={handleStartApp} />;
    }
  };

  return (
    <NavigationContainer>
      {renderCurrentScreen()}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

