import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { Check, X, Zap, Clock, ShoppingCart, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { darkTheme } from '@/constants/colors';
import { useForexStore } from '@/store/forex-store';
import { CONFIG } from '@/constants/config';
import { purchasePremium, restorePurchases } from '@/services/store-purchases';
import SignalCard from '@/components/SignalCard';

const { width } = Dimensions.get('window');

export default function PremiumScreen() {
  const router = useRouter();
  const { isPremium, setPremiumStatus, premiumExpiryDate, marketDaysRemaining, signals } = useForexStore();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Filter premium signals for display
  const premiumSignals = signals.filter(signal => signal.isPremium).slice(0, 4);
  
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const result = await purchasePremium();
      
      if (result.success) {
        // Purchase successful
        const today = new Date();
        let expiryDate = new Date();
        expiryDate.setDate(today.getDate() + CONFIG.SUBSCRIPTION.DAYS);
        
        setPremiumStatus(true, expiryDate.toISOString(), 'subscription', today.toISOString(), CONFIG.SUBSCRIPTION.MARKET_DAYS);
        
        Alert.alert(
          "Subscription Successful",
          `Thank you for subscribing to Trading ProAnalytics Premium!`,
          [
            {
              text: "OK",
              onPress: () => router.push('/(tabs)')
            }
          ]
        );
      } else {
        // Purchase failed or was canceled
        Alert.alert(
          "Subscription Failed",
          result.error || "There was an error processing your subscription. Please try again later."
        );
      }
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert(
        "Subscription Error",
        "There was an error processing your subscription. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestorePurchase = async () => {
    try {
      setRestoring(true);
      const result = await restorePurchases();
      
      if (result.success) {
        if (result.hasPremium) {
          // Premium subscription found
          const today = new Date();
          let expiryDate = new Date();
          expiryDate.setDate(today.getDate() + CONFIG.SUBSCRIPTION.DAYS);
          
          setPremiumStatus(true, expiryDate.toISOString(), 'subscription', today.toISOString(), CONFIG.SUBSCRIPTION.MARKET_DAYS);
          
          Alert.alert(
            "Purchase Restored",
            "Your premium subscription has been successfully restored!",
            [
              {
                text: "OK",
                onPress: () => router.push('/(tabs)')
              }
            ]
          );
        } else {
          // No premium subscription found
          Alert.alert(
            "No Purchases Found",
            "We couldn't find any active premium subscriptions associated with your account."
          );
        }
      } else {
        // Restore failed
        Alert.alert(
          "Restore Failed",
          result.error || "There was an error restoring your purchases. Please try again later."
        );
      }
    } catch (error) {
      console.error("Restore error:", error);
      Alert.alert(
        "Restore Error",
        "There was an error restoring your purchases. Please try again later."
      );
    } finally {
      setRestoring(false);
    }
  };
  
  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your premium subscription? You will lose access to premium features at the end of your current billing period.',
      [
        {
          text: 'No, Keep Subscription',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            console.log("Cancel subscription confirmed");
            setCancelling(true);
            // Simulate API call to cancel subscription
            setTimeout(() => {
              setCancelling(false);
              // Update the store to reflect cancellation
              // Note: In a real app, the subscription would typically remain active until the end of the billing period
              Alert.alert(
                'Subscription Cancelled',
                'Your subscription has been cancelled. You will have access to premium features until the end of your current billing period.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setPremiumStatus(false);
                      router.push('/(tabs)');
                    }
                  }
                ]
              );
            }, 1000);
          },
        },
      ]
    );
  };
  
  const formatExpiryDate = () => {
    if (!premiumExpiryDate) return '';
    const date = new Date(premiumExpiryDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const PremiumFeature = ({ text }: { text: string }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Check size={width > 400 ? 16 : 14} color={darkTheme.premium} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
  
  if (isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="light" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://placehold.co/80x80?text=TPA+Logo' }}
              style={styles.logoImage}
            />
          </View>
          
          <LinearGradient
            colors={['rgba(255, 193, 7, 0.2)', 'rgba(255, 193, 7, 0.05)']}
            style={styles.premiumActiveCard}
          >
            <View style={styles.premiumActiveIconContainer}>
              <Zap size={width > 400 ? 24 : 20} color={darkTheme.premium} />
            </View>
            <Text style={styles.premiumActiveTitle}>Premium Active</Text>
            <Text style={styles.premiumActiveMessage}>
              You have access to all premium features and signals.
            </Text>
            <View style={styles.expiryContainer}>
              <Clock size={width > 400 ? 16 : 14} color={darkTheme.secondaryText} />
              <Text style={styles.expiryText}>
                {marketDaysRemaining} market days remaining
              </Text>
            </View>
          </LinearGradient>
          
          <Text style={styles.sectionTitle}>Your Premium Benefits</Text>
          
          <View style={styles.benefitsContainer}>
            <PremiumFeature text="Unlimited trading signals" />
            <PremiumFeature text="Advanced technical analysis" />
            <PremiumFeature text="Real-time market alerts" />
            <PremiumFeature text="Performance analytics" />
            <PremiumFeature text="Priority customer support" />
            <PremiumFeature text="Access to 10 premium currency pairs" />
          </View>
          
          <Text style={styles.sectionTitle}>Premium Currency Pairs</Text>
          
          <View style={styles.currencyPairsContainer}>
            <View style={styles.pairRow}>
              <PairBadge pair="XAU/USD" />
              <PairBadge pair="US30" />
              <PairBadge pair="EUR/JPY" />
            </View>
            <View style={styles.pairRow}>
              <PairBadge pair="GBP/JPY" />
              <PairBadge pair="AUD/JPY" />
              <PairBadge pair="NZD/JPY" />
            </View>
            <View style={styles.pairRow}>
              <PairBadge pair="EUR/GBP" />
              <PairBadge pair="GBP/CHF" />
              <PairBadge pair="EUR/CHF" />
            </View>
            <View style={styles.pairRow}>
              <PairBadge pair="USD/SGD" />
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Latest Premium Signals</Text>
          
          {premiumSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} compact />
          ))}
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.viewAllButtonText}>View All Signals</Text>
            <ChevronRight size={width > 400 ? 16 : 14} color={darkTheme.accent} />
          </TouchableOpacity>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelSubscription}
              activeOpacity={0.7}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator size="small" color={darkTheme.danger} />
              ) : (
                <View style={styles.cancelButtonContent}>
                  <X size={width > 400 ? 18 : 16} color={darkTheme.danger} style={styles.cancelButtonIcon} />
                  <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://placehold.co/80x80?text=TPA+Logo' }}
            style={styles.headerImage}
          />
          <Text style={styles.headerTitle}>Trading ProAnalytics Premium</Text>
          <Text style={styles.headerSubtitle}>
            Unlock advanced trading signals and features
          </Text>
        </View>
        
        <View style={styles.planContainer}>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Premium Access</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>{CONFIG.SUBSCRIPTION.PRICE}</Text>
              </View>
              <View style={styles.durationContainer}>
                <Clock size={width > 400 ? 14 : 12} color={darkTheme.secondaryText} />
                <Text style={styles.durationText}>{CONFIG.SUBSCRIPTION.MARKET_DAYS} market days</Text>
              </View>
            </View>
            
            <View style={styles.planFeatures}>
              <PremiumFeature text="Unlimited trading signals" />
              <PremiumFeature text="Advanced technical analysis" />
              <PremiumFeature text="Real-time market alerts" />
              <PremiumFeature text="Performance analytics" />
              <PremiumFeature text="Priority customer support" />
              <PremiumFeature text="Access to 10 premium currency pairs" />
            </View>
            
            <Text style={styles.premiumPairsTitle}>Premium Currency Pairs:</Text>
            <View style={styles.premiumPairsContainer}>
              <View style={styles.premiumPairRow}>
                <PairBadge pair="XAU/USD" small />
                <PairBadge pair="US30" small />
                <PairBadge pair="EUR/JPY" small />
              </View>
              <View style={styles.premiumPairRow}>
                <PairBadge pair="GBP/JPY" small />
                <PairBadge pair="AUD/JPY" small />
                <PairBadge pair="NZD/JPY" small />
              </View>
              <View style={styles.premiumPairRow}>
                <PairBadge pair="EUR/GBP" small />
                <PairBadge pair="GBP/CHF" small />
                <PairBadge pair="EUR/CHF" small />
              </View>
              <View style={styles.premiumPairRow}>
                <PairBadge pair="USD/SGD" small />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <>
                  <ShoppingCart size={width > 400 ? 20 : 18} color="#000" />
                  <Text style={styles.subscribeButtonText}>
                    {Platform.OS === 'ios' ? 'Subscribe via App Store' : Platform.OS === 'android' ? 'Subscribe via Google Play' : 'Subscribe Now'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={handleRestorePurchase}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator color={darkTheme.accent} size="small" />
          ) : (
            <Text style={styles.restoreButtonText}>
              Restore Purchase
            </Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          Payment will be charged to your {Platform.OS === 'ios' ? 'iTunes Account' : 'Google Play Account'} at confirmation of purchase. 
          Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. 
          Your account will be charged for renewal within 24 hours prior to the end of the current period. 
          You can manage and cancel your subscriptions by going to your account settings on the {Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'} after purchase.
          Subscription duration is based on market days, pausing during weekends when the forex market is closed.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const PairBadge = ({ pair, small = false }: { pair: string; small?: boolean }) => (
  <View style={[styles.pairBadge, small && styles.smallPairBadge]}>
    <Text style={[styles.pairBadgeText, small && styles.smallPairBadgeText]}>{pair}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: width > 400 ? 20 : 16,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: width > 400 ? 80 : 70,
    height: width > 400 ? 80 : 70,
    borderRadius: width > 400 ? 20 : 18,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerImage: {
    width: width > 400 ? 80 : 70,
    height: width > 400 ? 80 : 70,
    borderRadius: width > 400 ? 20 : 18,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: width > 400 ? 16 : 14,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    maxWidth: '80%',
  },
  planContainer: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: darkTheme.premium,
    overflow: 'hidden',
  },
  planHeader: {
    padding: width > 400 ? 20 : 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  planTitle: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '700',
    color: darkTheme.text,
    marginRight: 4,
    marginTop: 2,
  },
  price: {
    fontSize: width > 400 ? 36 : 32,
    fontWeight: '700',
    color: darkTheme.text,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  durationText: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
    marginLeft: 6,
  },
  planFeatures: {
    padding: width > 400 ? 20 : 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: width > 400 ? 24 : 22,
    height: width > 400 ? 24 : 22,
    borderRadius: width > 400 ? 12 : 11,
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: width > 400 ? 16 : 14,
    color: darkTheme.text,
  },
  premiumPairsTitle: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 12,
    paddingHorizontal: width > 400 ? 20 : 16,
  },
  premiumPairsContainer: {
    paddingHorizontal: width > 400 ? 20 : 16,
    marginBottom: 20,
  },
  premiumPairRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  pairBadge: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
    minWidth: width > 400 ? 90 : 80,
    alignItems: 'center',
  },
  smallPairBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: width > 400 ? 80 : 70,
  },
  pairBadgeText: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.text,
    fontWeight: '500',
  },
  smallPairBadgeText: {
    fontSize: width > 400 ? 13 : 11,
  },
  subscribeButton: {
    backgroundColor: darkTheme.premium,
    paddingVertical: width > 400 ? 16 : 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 8,
    borderRadius: 12,
  },
  subscribeButtonText: {
    color: '#000',
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  restoreButton: {
    alignSelf: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  restoreButtonText: {
    color: darkTheme.accent,
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '500',
  },
  termsText: {
    fontSize: width > 400 ? 12 : 11,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
    marginTop: 10,
  },
  premiumActiveCard: {
    padding: width > 400 ? 24 : 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  premiumActiveIconContainer: {
    width: width > 400 ? 48 : 40,
    height: width > 400 ? 48 : 40,
    borderRadius: width > 400 ? 24 : 20,
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  premiumActiveTitle: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: '700',
    color: darkTheme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  premiumActiveMessage: {
    fontSize: width > 400 ? 16 : 14,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    marginBottom: 16,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  expiryText: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.text,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 16,
  },
  benefitsContainer: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: width > 400 ? 20 : 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  currencyPairsContainer: {
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 16,
    padding: width > 400 ? 20 : 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  pairRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  viewAllButtonText: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
    color: darkTheme.accent,
    marginRight: 8,
  },
  actionButtonsContainer: {
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: darkTheme.danger,
    borderRadius: 12,
    paddingVertical: width > 400 ? 14 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: width > 400 ? 50 : 44,
  },
  cancelButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonIcon: {
    marginRight: 8,
  },
  cancelButtonText: {
    color: darkTheme.danger,
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
  },
});