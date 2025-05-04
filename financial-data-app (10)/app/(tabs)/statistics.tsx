import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useForexStore } from '@/store/forex-store';
import { darkTheme } from '@/constants/colors';
import { ArrowUpRight, ArrowDownRight, TrendingUp, RefreshCw, Percent, DollarSign, Globe } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import { useForexData } from '@/hooks/useForexData';
import { CONFIG } from '@/constants/config';

const { width } = Dimensions.get('window');

const TABS = ['Overview', 'Profit'];

export default function StatisticsScreen() {
  const { performanceStats, weeklyPerformance, isMarketOpen, currentSession } = useForexStore();
  const { isLoading, error, refreshData, isApiAvailable } = useForexData();
  const [activeTab, setActiveTab] = useState('Overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Animation values
  const refreshRotation = useSharedValue(0);
  
  const handleRefresh = () => {
    refreshData();
    refreshRotation.value = withSpring(refreshRotation.value + 360);
  };
  
  const refreshAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${refreshRotation.value}deg` }]
    };
  });
  
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.overviewCard}
      >
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewCardGradient}
        >
          <View style={styles.overviewCardContent}>
            <View style={styles.overviewCardHeader}>
              <Text style={styles.overviewCardTitle}>Performance Summary</Text>
              <View style={styles.overviewCardBadge}>
                <Text style={styles.overviewCardBadgeText}>LIVE</Text>
              </View>
            </View>
            
            <View style={styles.overviewCardStats}>
              <View style={styles.overviewCardStat}>
                <Text style={styles.overviewCardStatValue}>{performanceStats.accuracy}%</Text>
                <Text style={styles.overviewCardStatLabel}>Win Rate</Text>
              </View>
              
              <View style={styles.overviewCardDivider} />
              
              <View style={styles.overviewCardStat}>
                <Text style={styles.overviewCardStatValue}>{performanceStats.totalTrades}</Text>
                <Text style={styles.overviewCardStatLabel}>Total Trades</Text>
              </View>
              
              <View style={styles.overviewCardDivider} />
              
              <View style={styles.overviewCardStat}>
                <Text style={styles.overviewCardStatValue}>{performanceStats.totalPips}</Text>
                <Text style={styles.overviewCardStatLabel}>Total Pips</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <View style={styles.statsGrid}>
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.statCard}
        >
          <View style={styles.statCardHeader}>
            <ArrowUpRight size={20} color={darkTheme.success} />
          </View>
          <Text style={styles.statCardValue}>{performanceStats.profitTrades}</Text>
          <Text style={styles.statCardLabel}>Winning Trades</Text>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.statCard}
        >
          <View style={styles.statCardHeader}>
            <ArrowDownRight size={20} color={darkTheme.danger} />
          </View>
          <Text style={styles.statCardValue}>{performanceStats.lossTrades}</Text>
          <Text style={styles.statCardLabel}>Losing Trades</Text>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.statCard}
        >
          <View style={styles.statCardHeader}>
            <Percent size={20} color="#64B5F6" />
          </View>
          <Text style={styles.statCardValue}>{performanceStats.riskRewardRatio.toFixed(1)}</Text>
          <Text style={styles.statCardLabel}>Risk/Reward</Text>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.statCard}
        >
          <View style={styles.statCardHeader}>
            <TrendingUp size={20} color="#FFB74D" />
          </View>
          <Text style={styles.statCardValue}>{performanceStats.averageTradesPerDay}</Text>
          <Text style={styles.statCardLabel}>Trades/Day</Text>
        </Animated.View>
      </View>
      
      <Animated.View 
        entering={FadeInDown.delay(500).springify()}
        style={styles.weeklyPerformanceCard}
      >
        <View style={styles.weeklyPerformanceHeader}>
          <Text style={styles.weeklyPerformanceTitle}>Weekly Performance</Text>
        </View>
        
        <View style={styles.weeklyPerformanceChart}>
          {weeklyPerformance.map((item, index) => {
            const barHeight = Math.min(Math.abs(item.pips) * 2, 100);
            const isPositive = item.pips >= 0;
            
            return (
              <View key={item.day} style={styles.weeklyPerformanceBar}>
                <Text style={[
                  styles.weeklyPerformanceValue,
                  isPositive ? styles.positiveText : styles.negativeText
                ]}>
                  {isPositive ? '+' : ''}{item.pips}
                </Text>
                
                <View style={styles.weeklyPerformanceBarContainer}>
                  <LinearGradient
                    colors={isPositive ? 
                      ['#4CAF50', '#81C784'] : 
                      ['#F44336', '#E57373']}
                    style={[
                      styles.weeklyPerformanceBarFill,
                      { 
                        height: barHeight,
                        backgroundColor: isPositive ? darkTheme.success : darkTheme.danger
                      }
                    ]}
                  />
                </View>
                
                <Text style={styles.weeklyPerformanceDay}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
  
  const renderProfitTab = () => (
    <View style={styles.tabContent}>
      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.profitCard}
      >
        <LinearGradient
          colors={['#1E88E5', '#42A5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profitCardGradient}
        >
          <View style={styles.profitCardContent}>
            <View style={styles.profitCardHeader}>
              <DollarSign size={24} color="#FFFFFF" />
              <Text style={styles.profitCardTitle}>Profit Analysis</Text>
            </View>
            
            <Text style={styles.profitCardValue}>
              {performanceStats.totalPips >= 0 ? '+' : ''}{performanceStats.totalPips} pips
            </Text>
            
            <View style={styles.profitCardStats}>
              <View style={styles.profitCardStat}>
                <Text style={styles.profitCardStatLabel}>Avg Profit/Trade</Text>
                <Text style={styles.profitCardStatValue}>+{performanceStats.averageProfitPerTrade} pips</Text>
              </View>
              
              <View style={styles.profitCardStat}>
                <Text style={styles.profitCardStatLabel}>Avg Loss/Trade</Text>
                <Text style={styles.profitCardStatValue}>-{performanceStats.averageLossPerTrade} pips</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.profitBreakdownCard}
      >
        <Text style={styles.profitBreakdownTitle}>Profit Breakdown</Text>
        
        <View style={styles.profitBreakdownItem}>
          <View style={styles.profitBreakdownItemHeader}>
            <Text style={styles.profitBreakdownItemTitle}>EUR/USD</Text>
            <Text style={[styles.profitBreakdownItemValue, styles.positiveText]}>+42 pips</Text>
          </View>
          <View style={styles.profitBreakdownItemBar}>
            <View style={[styles.profitBreakdownItemBarFill, { width: '70%', backgroundColor: darkTheme.success }]} />
          </View>
        </View>
        
        <View style={styles.profitBreakdownItem}>
          <View style={styles.profitBreakdownItemHeader}>
            <Text style={styles.profitBreakdownItemTitle}>GBP/USD</Text>
            <Text style={[styles.profitBreakdownItemValue, styles.positiveText]}>+28 pips</Text>
          </View>
          <View style={styles.profitBreakdownItemBar}>
            <View style={[styles.profitBreakdownItemBarFill, { width: '50%', backgroundColor: darkTheme.success }]} />
          </View>
        </View>
        
        <View style={styles.profitBreakdownItem}>
          <View style={styles.profitBreakdownItemHeader}>
            <Text style={styles.profitBreakdownItemTitle}>USD/JPY</Text>
            <Text style={[styles.profitBreakdownItemValue, styles.negativeText]}>-15 pips</Text>
          </View>
          <View style={styles.profitBreakdownItemBar}>
            <View style={[styles.profitBreakdownItemBarFill, { width: '30%', backgroundColor: darkTheme.danger }]} />
          </View>
        </View>
        
        <View style={styles.profitBreakdownItem}>
          <View style={styles.profitBreakdownItemHeader}>
            <Text style={styles.profitBreakdownItemTitle}>AUD/USD</Text>
            <Text style={[styles.profitBreakdownItemValue, styles.positiveText]}>+18 pips</Text>
          </View>
          <View style={styles.profitBreakdownItemBar}>
            <View style={[styles.profitBreakdownItemBarFill, { width: '40%', backgroundColor: darkTheme.success }]} />
          </View>
        </View>
      </Animated.View>
      
      <Animated.View 
        entering={FadeInDown.delay(400).springify()}
        style={styles.profitTimeCard}
      >
        <Text style={styles.profitTimeTitle}>Best Trading Times</Text>
        
        <View style={styles.profitTimeItem}>
          <View style={styles.profitTimeItemDot} />
          <Text style={styles.profitTimeItemText}>London Session (8:00 - 16:00 GMT)</Text>
          <Text style={[styles.profitTimeItemValue, styles.positiveText]}>+45 pips</Text>
        </View>
        
        <View style={styles.profitTimeItem}>
          <View style={styles.profitTimeItemDot} />
          <Text style={styles.profitTimeItemText}>New York Session (13:00 - 21:00 GMT)</Text>
          <Text style={[styles.profitTimeItemValue, styles.positiveText]}>+32 pips</Text>
        </View>
        
        <View style={styles.profitTimeItem}>
          <View style={styles.profitTimeItemDot} />
          <Text style={styles.profitTimeItemText}>Asian Session (00:00 - 8:00 GMT)</Text>
          <Text style={[styles.profitTimeItemValue, styles.negativeText]}>-8 pips</Text>
        </View>
      </Animated.View>
    </View>
  );
  
  const renderStatusBar = () => {
    if (isApiAvailable === null) return null;
    
    return (
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBar,
          isApiAvailable ? styles.statusBarOnline : styles.statusBarOffline
        ]}>
          <Text style={styles.statusBarText}>
            {isApiAvailable ? 'Real-Time Data: Online' : 'Real-Time Data: Offline (Using Mock Data)'}
          </Text>
        </View>
        <View style={[
          styles.statusBar,
          isMarketOpen ? styles.marketOpen : styles.marketClosed
        ]}>
          <Globe size={14} color={isMarketOpen ? darkTheme.success : darkTheme.danger} style={styles.marketIcon} />
          <Text style={styles.statusBarText}>
            {isMarketOpen ? `Market: Open (${currentSession} Session)` : 'Market: Closed'}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.header}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Performance</Text>
          <Text style={styles.subtitle}>Real-time trading analytics</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={handleRefresh} style={styles.refreshButton}>
            <Animated.View style={refreshAnimatedStyle}>
              <RefreshCw size={20} color={darkTheme.accent} />
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>
      
      {renderStatusBar()}
      
      <Animated.View 
        entering={FadeInRight.delay(200).springify()}
        style={styles.tabsContainer}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </Pressable>
        ))}
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {activeTab === 'Overview' && renderOverviewTab()}
        {activeTab === 'Profit' && renderProfitTab()}
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Past performance is not indicative of future results. Trading involves risk.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: darkTheme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: darkTheme.secondaryText,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statusBar: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 6,
    borderRadius: 8,
  },
  statusBarOnline: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)', // Green for online
  },
  statusBarOffline: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)', // Red for offline
  },
  marketOpen: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)', // Green for open
  },
  marketClosed: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)', // Red for closed
  },
  marketIcon: {
    marginRight: 6,
  },
  statusBarText: {
    color: darkTheme.text,
    fontSize: 12,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tabButton: {
    marginRight: 24,
    paddingVertical: 8,
    position: 'relative',
  },
  activeTabButton: {
    // Active state is handled by the indicator
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: darkTheme.secondaryText,
  },
  activeTabButtonText: {
    color: darkTheme.accent,
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: darkTheme.accent,
    borderRadius: 1.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  
  // Overview Tab Styles
  overviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  overviewCardGradient: {
    borderRadius: 16,
  },
  overviewCardContent: {
    padding: 20,
  },
  overviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  overviewCardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overviewCardBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  overviewCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewCardStat: {
    alignItems: 'center',
    flex: 1,
  },
  overviewCardStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  overviewCardStatLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  overviewCardDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statCardHeader: {
    marginBottom: 12,
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: darkTheme.text,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 14,
    color: darkTheme.secondaryText,
  },
  
  weeklyPerformanceCard: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  weeklyPerformanceHeader: {
    marginBottom: 20,
  },
  weeklyPerformanceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: darkTheme.text,
  },
  weeklyPerformanceChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 160,
  },
  weeklyPerformanceBar: {
    alignItems: 'center',
    width: '13%',
  },
  weeklyPerformanceValue: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  weeklyPerformanceBarContainer: {
    height: 100,
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  weeklyPerformanceBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  weeklyPerformanceDay: {
    marginTop: 8,
    fontSize: 12,
    color: darkTheme.secondaryText,
  },
  
  // Profit Tab Styles
  profitCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profitCardGradient: {
    borderRadius: 16,
  },
  profitCardContent: {
    padding: 20,
  },
  profitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profitCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  profitCardValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  profitCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profitCardStat: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    width: '48%',
  },
  profitCardStatLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 6,
  },
  profitCardStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  
  profitBreakdownCard: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profitBreakdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: darkTheme.text,
    marginBottom: 20,
  },
  profitBreakdownItem: {
    marginBottom: 16,
  },
  profitBreakdownItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profitBreakdownItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: darkTheme.text,
  },
  profitBreakdownItemValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  profitBreakdownItemBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  profitBreakdownItemBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  profitTimeCard: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profitTimeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: darkTheme.text,
    marginBottom: 20,
  },
  profitTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profitTimeItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkTheme.accent,
    marginRight: 12,
  },
  profitTimeItemText: {
    flex: 1,
    fontSize: 14,
    color: darkTheme.text,
  },
  profitTimeItemValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  
  // Shared Styles
  positiveText: {
    color: darkTheme.success,
  },
  negativeText: {
    color: darkTheme.danger,
  },
  disclaimer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});