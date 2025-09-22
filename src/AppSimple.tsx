import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AppSimple = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 SightReadPro 🎵</Text>
      <Text style={styles.subtitle}>Welcome to your music practice app!</Text>
      <Text style={styles.text}>This is a simple test to see if the app loads.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default AppSimple;



