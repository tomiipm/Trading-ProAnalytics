import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowDown, ArrowUp, Star, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForexStore } from '@/store/forex-store';
import { Signal } from '@/types/forex';
import { darkTheme } from '@/constants/colors';
import ProbabilityBar from './ProbabilityBar';

const { width } = Dimensions.get('window');

interface SignalCardProps {
  signal: Signal;
  onPress?: () => void;
  compact?: boolean;
}

export default function SignalCard({ signal, onPress, compact = false }: SignalCardProps) {
  const { toggleFavorite, isPremium } = useForexStore();
  
  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(signal.id);
  };
  
  const handleCardPress = () => {
    if (signal.isPremium && !isPremium) {
      // If premium signal and user is not premium, don't allow access
      return;
    }
    
    if (onPress) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      {signal.isPremium && !isPremium && (
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.5)']}
          style={styles.premiumOverlay}
        >
          <Lock size={width > 400 ? 24 : 20} color="#FFF" />
          <Text style={styles.premiumOverlayText}>Premium Signal</Text>
        </LinearGradient>
      )}
      
      <View style={styles.header}>
        <View style={styles.pairContainer}>
          <Text style={styles.pair}>{signal.pair}</Text>
          {signal.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Star 
            size={width > 400 ? 20 : 18} 
            color={signal.isFavorite ? darkTheme.premium : darkTheme.secondaryText} 
            fill={signal.isFavorite ? darkTheme.premium : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={[
            styles.typeContainer,
            { backgroundColor: signal.type === 'BUY' ? 'rgba(0, 184, 148, 0.15)' : 'rgba(255, 118, 117, 0.15)' }
          ]}>
            {signal.type === 'BUY' ? (
              <ArrowUp size={width > 400 ? 14 : 12} color={darkTheme.buy} style={styles.icon} />
            ) : (
              <ArrowDown size={width > 400 ? 14 : 12} color={darkTheme.sell} style={styles.icon} />
            )}
            <Text style={[
              styles.type, 
              { color: signal.type === 'BUY' ? darkTheme.buy : darkTheme.sell }
            ]}>
              {signal.type}
            </Text>
          </View>
          
          <Text style={styles.timestamp}>{signal.timestamp}</Text>
        </View>
        
        {!compact && (
          <View style={styles.rightContent}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Entry</Text>
              <Text style={styles.priceValue}>{signal.entryPrice.toFixed(4)}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>TP</Text>
              <Text style={styles.priceValue}>{signal.takeProfit1.toFixed(4)}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>SL</Text>
              <Text style={styles.priceValue}>{signal.stopLoss.toFixed(4)}</Text>
            </View>
          </View>
        )}
      </View>
      
      {!compact && (
        <View style={styles.footer}>
          <Text style={styles.probabilityLabel}>Probability</Text>
          <View style={styles.probabilityContainer}>
            <ProbabilityBar probability={signal.probability} />
            <Text style={styles.probabilityValue}>{signal.probability}%</Text>
          </View>
        </View>
      )}
      
      {compact && (
        <View style={styles.compactFooter}>
          <View style={styles.compactPriceRow}>
            <Text style={styles.compactPriceLabel}>Entry: </Text>
            <Text style={styles.compactPriceValue}>{signal.entryPrice.toFixed(4)}</Text>
            <Text style={styles.compactPriceLabel}> | TP: </Text>
            <Text style={styles.compactPriceValue}>{signal.takeProfit1.toFixed(4)}</Text>
            <Text style={styles.compactPriceLabel}> | SL: </Text>
            <Text style={styles.compactPriceValue}>{signal.stopLoss.toFixed(4)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: width > 400 ? 16 : 12,
    marginBottom: width > 400 ? 16 : 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    position: 'relative',
    overflow: 'hidden',
    width: width > 400 ? 'auto' : '100%',
  },
  compactContainer: {
    padding: width > 400 ? 12 : 10,
    marginBottom: width > 400 ? 12 : 10,
  },
  premiumOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 16,
  },
  premiumOverlayText: {
    color: '#FFF',
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width > 400 ? 12 : 10,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pair: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    color: darkTheme.text,
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: darkTheme.premium,
    fontSize: width > 400 ? 10 : 9,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: width > 400 ? 4 : 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width > 400 ? 12 : 10,
  },
  leftContent: {
    flexDirection: 'column',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width > 400 ? 8 : 6,
    paddingVertical: width > 400 ? 4 : 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: width > 400 ? 8 : 6,
  },
  icon: {
    marginRight: 4,
  },
  type: {
    fontSize: width > 400 ? 12 : 11,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: width > 400 ? 12 : 11,
    color: darkTheme.secondaryText,
  },
  rightContent: {
    flexDirection: 'row',
    gap: width > 400 ? 12 : 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: width > 400 ? 12 : 11,
    color: darkTheme.secondaryText,
    marginBottom: width > 400 ? 4 : 2,
  },
  priceValue: {
    fontSize: width > 400 ? 14 : 12,
    fontWeight: '500',
    color: darkTheme.text,
  },
  footer: {
    marginTop: width > 400 ? 4 : 2,
  },
  probabilityLabel: {
    fontSize: width > 400 ? 12 : 11,
    color: darkTheme.secondaryText,
    marginBottom: width > 400 ? 4 : 2,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  probabilityValue: {
    fontSize: width > 400 ? 14 : 12,
    fontWeight: '500',
    color: darkTheme.text,
    marginLeft: width > 400 ? 8 : 6,
  },
  compactFooter: {
    marginTop: width > 400 ? 4 : 2,
  },
  compactPriceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  compactPriceLabel: {
    fontSize: width > 400 ? 12 : 11,
    color: darkTheme.secondaryText,
  },
  compactPriceValue: {
    fontSize: width > 400 ? 12 : 11,
    fontWeight: '500',
    color: darkTheme.text,
  },
});