import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PerformanceStats } from '@/types/forex';
import { darkTheme } from '@/constants/colors';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

interface StatisticsCardProps {
  stats: PerformanceStats;
}

export default function StatisticsCard({ stats }: StatisticsCardProps) {
  // Calculate pie chart values
  const total = stats.profitTrades + stats.lossTrades + stats.openTrades;
  const profitAngle = (stats.profitTrades / total) * 360;
  const lossAngle = (stats.lossTrades / total) * 360;
  
  // Create SVG paths for pie chart
  const radius = 60;
  const centerX = 100;
  const centerY = 100;
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  // Create paths for each segment
  const profitPath = createArc(0, profitAngle);
  const lossPath = createArc(profitAngle, profitAngle + lossAngle);
  const openPath = createArc(profitAngle + lossAngle, 360);
  
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Trades</Text>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{stats.totalTrades}</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average Trades/Day</Text>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{stats.averageTradesPerDay}</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average Profit/Day (Pips)</Text>
          <View style={[styles.statValueContainer, styles.profitContainer]}>
            <Text style={[styles.statValue, styles.profitValue]}>+{stats.averageProfitPerDay}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg height="200" width="200" viewBox="0 0 200 200">
          <Path d={profitPath} fill={darkTheme.success} />
          <Path d={lossPath} fill={darkTheme.danger} />
          <Path d={openPath} fill="#666666" />
          <Circle cx={centerX} cy={centerY} r={40} fill={darkTheme.cardBackground} />
          <SvgText
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fill={darkTheme.text}
            fontSize="18"
            fontWeight="bold"
          >
            {stats.accuracy}%
          </SvgText>
          <SvgText
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            fill={darkTheme.secondaryText}
            fontSize="12"
          >
            Accuracy
          </SvgText>
        </Svg>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: darkTheme.success }]} />
            <Text style={styles.legendText}>Profit | {stats.profitTrades}</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: darkTheme.danger }]} />
            <Text style={styles.legendText}>Loss | {stats.lossTrades}</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#666666' }]} />
            <Text style={styles.legendText}>Open | {stats.openTrades}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  statsRow: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: darkTheme.secondaryText,
  },
  statValueContainer: {
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  profitContainer: {
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: "500",
    color: darkTheme.text,
  },
  profitValue: {
    color: darkTheme.success,
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: darkTheme.secondaryText,
  },
});