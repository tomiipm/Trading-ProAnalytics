import React from 'react';
import { View, StyleSheet } from 'react-native';
import { darkTheme } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ProbabilityBarProps {
  probability: number;
}

export default function ProbabilityBar({ probability }: ProbabilityBarProps) {
  // Determine color based on probability
  const getColors = (): [string, string] => {
    if (probability >= 75) {
      return [darkTheme.success, darkTheme.accent];
    } else if (probability >= 50) {
      return [darkTheme.accent, darkTheme.secondary];
    } else {
      return [darkTheme.danger, darkTheme.accent];
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${probability}%` }]}>
          <LinearGradient
            colors={getColors()}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
  },
});