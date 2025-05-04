import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { Star, Zap, ShoppingCart } from 'lucide-react-native';
import { darkTheme } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { CONFIG } from '@/constants/config';

const { width } = Dimensions.get('window');

interface PremiumFeatureCardProps {
  title: string;
  onPress: () => void;
  description?: string;
  isLoading?: boolean;
}

export default function PremiumFeatureCard({ 
  title, 
  onPress, 
  description = "Unlock premium signals with higher accuracy and more detailed analysis",
  isLoading = false
}: PremiumFeatureCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.9}
      disabled={isLoading}
    >
      <LinearGradient
        colors={['rgba(253, 203, 110, 0.2)', 'rgba(253, 203, 110, 0.05)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Zap size={width > 400 ? 20 : 18} color={darkTheme.premium} fill={darkTheme.premium} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.priceText}>
              ${CONFIG.SUBSCRIPTION.PRICE} for {CONFIG.SUBSCRIPTION.DAYS} days
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <ShoppingCart size={width > 400 ? 14 : 12} color="#000" />
                <Text style={styles.buttonText}>
                  {Platform.OS === 'ios' ? 'App Store' : Platform.OS === 'android' ? 'Google Play' : 'Subscribe'}
                </Text>
              </>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: width > 400 ? 16 : 12,
    borderRadius: 16,
    overflow: 'hidden',
    width: width > 400 ? 'auto' : '100%',
  },
  gradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(253, 203, 110, 0.3)',
  },
  content: {
    padding: width > 400 ? 16 : 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: width > 400 ? 40 : 36,
    height: width > 400 ? 40 : 36,
    borderRadius: width > 400 ? 20 : 18,
    backgroundColor: 'rgba(253, 203, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width > 400 ? 12 : 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: "600",
    color: darkTheme.premium,
    marginBottom: width > 400 ? 4 : 3,
  },
  description: {
    fontSize: width > 400 ? 12 : 11,
    color: darkTheme.secondaryText,
    marginBottom: width > 400 ? 6 : 4,
  },
  priceText: {
    fontSize: width > 400 ? 12 : 11,
    fontWeight: '600',
    color: darkTheme.premium,
  },
  buttonContainer: {
    backgroundColor: darkTheme.premium,
    paddingVertical: width > 400 ? 8 : 6,
    paddingHorizontal: width > 400 ? 12 : 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: width > 400 ? 100 : 90,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: width > 400 ? 12 : 11,
    fontWeight: "600",
    marginLeft: width > 400 ? 4 : 3,
  },
});