import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WeeklyPerformanceData } from '@/types/forex';
import { darkTheme } from '../constants/colors';

interface PerformanceChartProps {
  data: WeeklyPerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  // Find the max absolute value for scaling
  const maxValue = Math.max(
    ...data.map(item => Math.abs(item.pips)),
    30 // Minimum scale to avoid tiny bars
  );
  
  // Calculate the height of each bar
  const calculateBarHeight = (value: number) => {
    const maxBarHeight = 150; // Maximum bar height in pixels
    return Math.abs(value) / maxValue * maxBarHeight;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Zero line */}
        <View style={styles.zeroLine} />
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barLabelContainer}>
                <Text style={[
                  styles.barValue,
                  item.pips >= 0 ? styles.positiveValue : styles.negativeValue
                ]}>
                  {item.pips > 0 ? '+' : ''}{item.pips}
                </Text>
              </View>
              
              <View style={styles.barColumn}>
                <View 
                  style={[
                    styles.bar,
                    item.pips >= 0 ? styles.positiveBar : styles.negativeBar,
                    {
                      height: calculateBarHeight(item.pips),
                      // Position the bar above or below the zero line
                      marginTop: item.pips >= 0 ? 0 : 'auto',
                    }
                  ]}
                />
              </View>
              
              <Text style={styles.dayLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  chartContainer: {
    height: 200,
    position: 'relative',
  },
  zeroLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: darkTheme.chartGrid,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barLabelContainer: {
    height: 20,
    justifyContent: 'center',
    marginBottom: 5,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  positiveValue: {
    color: darkTheme.success,
  },
  negativeValue: {
    color: darkTheme.danger,
  },
  barColumn: {
    height: 150,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  positiveBar: {
    backgroundColor: darkTheme.success,
    alignSelf: 'center',
  },
  negativeBar: {
    backgroundColor: darkTheme.danger,
    alignSelf: 'center',
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
    color: darkTheme.secondaryText,
  },
});

export default PerformanceChart;