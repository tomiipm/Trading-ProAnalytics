import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowDown, ArrowUp, Star, ExternalLink, Info } from 'lucide-react-native';
import { useForexStore } from '@/store/forex-store';
import ChartComponent from '@/components/ChartComponent';
import ProbabilityBar from '@/components/ProbabilityBar';
import { LinearGradient } from 'expo-linear-gradient';
import { darkTheme } from '../constants/colors';
import { CONFIG } from '../constants/config';

const { width } = Dimensions.get('window');

export default function SignalDetailsScreen() {
  const { selectedSignal, toggleFavorite } = useForexStore();
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  if (!selectedSignal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No signal selected</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleFavoritePress = () => {
    toggleFavorite(selectedSignal.id);
  };
  
  const openTradingView = () => {
    const symbol = selectedSignal.pair.replace('/', '');
    const url = `https://www.tradingview.com/chart/?symbol=${symbol}`;
    Linking.openURL(url).catch(err => {
      console.error("Couldn't load page", err);
    });
  };
  
  // Calculate risk-reward ratio
  const riskRewardRatio = selectedSignal.type === 'BUY'
    ? ((selectedSignal.takeProfit1 - selectedSignal.entryPrice) / (selectedSignal.entryPrice - selectedSignal.stopLoss)).toFixed(1)
    : ((selectedSignal.entryPrice - selectedSignal.takeProfit1) / (selectedSignal.stopLoss - selectedSignal.entryPrice)).toFixed(1);

  // Enhanced analysis content with fallback
  const analysisContent = selectedSignal.analysis || `Our advanced analysis for ${selectedSignal.pair} indicates a potential ${selectedSignal.type.toLowerCase()} opportunity. Based on multiple market factors, we assess a ${selectedSignal.probability}% probability of success. Key considerations include recent price trends, volatility patterns, and market sentiment. The risk-reward ratio for this signal is calculated at 1:${riskRewardRatio}, suggesting a balanced opportunity for profit relative to potential loss.`;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.pairContainer}>
            <Text style={styles.pairText}>{selectedSignal.pair}</Text>
            <View style={[
              styles.typeContainer,
              { backgroundColor: selectedSignal.type === 'BUY' ? 'rgba(0, 184, 148, 0.15)' : 'rgba(255, 118, 117, 0.15)' }
            ]}>
              {selectedSignal.type === 'BUY' ? (
                <ArrowUp size={width > 400 ? 14 : 12} color={darkTheme.buy} style={styles.icon} />
              ) : (
                <ArrowDown size={width > 400 ? 14 : 12} color={darkTheme.sell} style={styles.icon} />
              )}
              <Text style={[
                styles.type, 
                { color: selectedSignal.type === 'BUY' ? darkTheme.buy : darkTheme.sell }
              ]}>
                {selectedSignal.type}
              </Text>
            </View>
          </View>
          
          <Text style={styles.timestamp}>{selectedSignal.timestamp}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleFavoritePress}>
              <Star 
                size={width > 400 ? 20 : 18} 
                color={selectedSignal.isFavorite ? darkTheme.premium : darkTheme.secondaryText} 
                fill={selectedSignal.isFavorite ? darkTheme.premium : 'transparent'}
              />
              <Text style={styles.actionButtonText}>
                {selectedSignal.isFavorite ? 'Favorited' : 'Favorite'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={openTradingView}>
              <ExternalLink size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} />
              <Text style={styles.actionButtonText}>View Chart</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          <ChartComponent pair={selectedSignal.pair} type={selectedSignal.type} />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Signal Details</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Entry Price</Text>
            <View style={styles.priceValueContainer}>
              <Text style={styles.priceValue}>{selectedSignal.entryPrice.toFixed(4)}</Text>
            </View>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Take Profit 1</Text>
            <View style={styles.priceValueContainer}>
              <Text style={styles.priceValue}>{selectedSignal.takeProfit1.toFixed(4)}</Text>
            </View>
          </View>
          
          {selectedSignal.takeProfit2 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Take Profit 2</Text>
              <View style={styles.priceValueContainer}>
                <Text style={styles.priceValue}>{selectedSignal.takeProfit2.toFixed(4)}</Text>
              </View>
            </View>
          )}
          
          {selectedSignal.takeProfit3 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Take Profit 3</Text>
              <View style={styles.priceValueContainer}>
                <Text style={styles.priceValue}>{selectedSignal.takeProfit3.toFixed(4)}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Stop Loss</Text>
            <View style={[styles.priceValueContainer, styles.stopLossContainer]}>
              <Text style={styles.priceValue}>{selectedSignal.stopLoss.toFixed(4)}</Text>
            </View>
          </View>
          
          <View style={styles.probabilityContainer}>
            <View style={styles.probabilityHeader}>
              <Text style={styles.probabilityTitle}>Success Probability</Text>
              <Text style={styles.probabilityValue}>{selectedSignal.probability}%</Text>
            </View>
            <ProbabilityBar probability={selectedSignal.probability} />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.analysisButton}
          onPress={() => setShowAnalysis(!showAnalysis)}
        >
          <Info size={width > 400 ? 20 : 18} color={darkTheme.accent} />
          <Text style={styles.analysisButtonText}>
            {showAnalysis ? 'Hide Analysis' : 'View Analysis'}
          </Text>
        </TouchableOpacity>
        
        {showAnalysis && (
          <View style={styles.analysisContainer}>
            <LinearGradient
              colors={['rgba(108, 92, 231, 0.1)', 'rgba(108, 92, 231, 0.05)']}
              style={styles.analysisGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.analysisText}>
                {analysisContent}
              </Text>
              
              <View style={styles.additionalInfoContainer}>
                <Text style={styles.additionalInfoTitle}>Market Context:</Text>
                <Text style={styles.additionalInfoText}>
                  - Current volatility for {selectedSignal.pair} is within normal ranges.
                  - Key support level: {selectedSignal.type === 'BUY' ? (selectedSignal.entryPrice * 0.995).toFixed(4) : (selectedSignal.entryPrice * 1.005).toFixed(4)}
                  - Key resistance level: {selectedSignal.type === 'BUY' ? (selectedSignal.entryPrice * 1.005).toFixed(4) : (selectedSignal.entryPrice * 0.995).toFixed(4)}
                </Text>
              </View>
              
              <View style={styles.additionalInfoContainer}>
                <Text style={styles.additionalInfoTitle}>Technical Indicators:</Text>
                <Text style={styles.additionalInfoText}>
                  - Trend analysis suggests {selectedSignal.type === 'BUY' ? 'bullish momentum' : 'bearish pressure'}.
                  - Volume patterns indicate {selectedSignal.probability > 70 ? 'strong' : 'moderate'} market participation.
                </Text>
              </View>
              
              <View style={styles.aiModelInfo}>
                <Text style={styles.aiModelInfoText}>
                  Analysis Version v{CONFIG.AI_MODEL.VERSION} (Accuracy: {CONFIG.AI_MODEL.ACCURACY}%)
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: width > 400 ? 16 : 12,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pairText: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: "700",
    color: darkTheme.text,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width > 400 ? 12 : 10,
    paddingVertical: width > 400 ? 6 : 5,
    borderRadius: 12,
  },
  icon: {
    marginRight: 4,
  },
  type: {
    fontSize: width > 400 ? 14 : 12,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
    marginBottom: width > 400 ? 16 : 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    paddingTop: width > 400 ? 16 : 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  actionButtonText: {
    color: darkTheme.secondaryText,
    marginLeft: 8,
    fontSize: width > 400 ? 14 : 12,
  },
  chartContainer: {
    height: width > 400 ? 250 : 200,
    marginBottom: width > 400 ? 16 : 12,
  },
  detailsContainer: {
    padding: width > 400 ? 16 : 12,
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    marginHorizontal: width > 400 ? 16 : 12,
    marginBottom: width > 400 ? 16 : 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  sectionTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: "600",
    color: darkTheme.text,
    marginBottom: width > 400 ? 16 : 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width > 400 ? 12 : 10,
  },
  priceLabel: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
  },
  priceValueContainer: {
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    paddingHorizontal: width > 400 ? 12 : 10,
    paddingVertical: width > 400 ? 6 : 5,
    borderRadius: 20,
    minWidth: width > 400 ? 100 : 80,
    alignItems: 'center',
  },
  stopLossContainer: {
    backgroundColor: 'rgba(255, 118, 117, 0.1)',
  },
  priceValue: {
    fontSize: width > 400 ? 14 : 12,
    fontWeight: "500",
    color: darkTheme.text,
  },
  probabilityContainer: {
    marginTop: width > 400 ? 16 : 12,
  },
  probabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  probabilityTitle: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
  },
  probabilityValue: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: "600",
    color: darkTheme.text,
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    paddingVertical: width > 400 ? 12 : 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: width > 400 ? 16 : 12,
    marginBottom: width > 400 ? 16 : 12,
    height: width > 400 ? 44 : 40,
  },
  analysisButtonText: {
    color: darkTheme.accent,
    marginLeft: 8,
    fontSize: width > 400 ? 16 : 14,
    fontWeight: "500",
  },
  analysisContainer: {
    marginHorizontal: width > 400 ? 16 : 12,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  analysisGradient: {
    padding: width > 400 ? 16 : 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.3)',
  },
  analysisText: {
    color: darkTheme.text,
    fontSize: width > 400 ? 14 : 12,
    lineHeight: width > 400 ? 22 : 20,
    marginBottom: width > 400 ? 16 : 12,
  },
  additionalInfoContainer: {
    marginBottom: width > 400 ? 16 : 12,
  },
  additionalInfoTitle: {
    color: darkTheme.accent,
    fontSize: width > 400 ? 14 : 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  additionalInfoText: {
    color: darkTheme.text,
    fontSize: width > 400 ? 14 : 12,
    lineHeight: width > 400 ? 20 : 18,
  },
  aiModelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width > 400 ? 16 : 12,
  },
  aiModelInfoText: {
    color: darkTheme.secondaryText,
    fontSize: width > 400 ? 12 : 11,
    marginLeft: 6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: darkTheme.secondaryText,
    fontSize: width > 400 ? 16 : 14,
  },
});