import { Platform } from 'react-native';
import { CONFIG } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkMarketStatus } from './api';

// Storage key for subscription data
const SUBSCRIPTION_STORAGE_KEY = 'subscription_data';

// This is a mock implementation of in-app purchases
// In a real app, you would use libraries like react-native-iap or expo-in-app-purchases

/**
 * Initialize in-app purchases
 * This is a simulated function that would initialize the IAP system
 */
export const initializeIAP = async (): Promise<boolean> => {
  // Simulate initialization delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would initialize the IAP system
  console.log('Initializing IAP system');
  
  // Simulate success
  return true;
};

/**
 * Get subscription status
 * This is a simulated function that would check if user has active subscription
 */
export const getSubscriptionStatus = async (): Promise<{
  isActive: boolean;
  expiryDate?: string;
  productId?: string;
  startDate?: string;
  marketDaysRemaining?: number;
}> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check stored subscription data
  try {
    const subscriptionData = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (subscriptionData) {
      const parsedData = JSON.parse(subscriptionData);
      const isActive = parsedData.isActive;
      const startDate = parsedData.startDate;
      const expiryDate = parsedData.expiryDate;
      const marketDaysRemaining = parsedData.marketDaysRemaining || CONFIG.SUBSCRIPTION.MARKET_DAYS;
      
      if (isActive) {
        return {
          isActive: true,
          expiryDate,
          startDate,
          marketDaysRemaining,
          productId: Platform.OS === 'ios' ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID
        };
      }
    }
  } catch (error) {
    console.error('Error loading subscription data:', error);
  }
  
  // In a real app, this would check with the respective platform's API
  // For demo purposes, return mock data
  const isActive = Math.random() > 0.5;
  
  if (isActive) {
    const today = new Date();
    const startDate = today.toISOString();
    let expiryDate = new Date();
    expiryDate.setDate(today.getDate() + CONFIG.SUBSCRIPTION.DAYS); // Initial calendar days
    
    // Save initial subscription data
    const subscriptionData = {
      isActive: true,
      startDate,
      expiryDate: expiryDate.toISOString(),
      marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS
    };
    await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionData));
    
    return {
      isActive: true,
      expiryDate: expiryDate.toISOString(),
      startDate,
      marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS,
      productId: Platform.OS === 'ios' ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID
    };
  } else {
    return {
      isActive: false
    };
  }
};

/**
 * Purchase premium subscription
 * This is a simulated function that would integrate with App Store or Google Play
 */
export const purchasePremium = async (): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would integrate with in-app purchase APIs
  // For iOS: StoreKit
  // For Android: Google Play Billing
  
  // For demo purposes, simulate a successful purchase
  if (Math.random() > 0.2) { // 80% success rate for demo
    // Calculate initial expiry date
    const today = new Date();
    const startDate = today.toISOString();
    let expiryDate = new Date();
    expiryDate.setDate(today.getDate() + CONFIG.SUBSCRIPTION.DAYS); // Initial calendar days as fallback
    
    // Save subscription data with market days
    const subscriptionData = {
      isActive: true,
      startDate,
      expiryDate: expiryDate.toISOString(),
      marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS
    };
    await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionData));
    
    return {
      success: true,
      transactionId: `transaction_${Date.now()}`
    };
  } else {
    // Simulate a purchase failure
    return {
      success: false,
      error: "Purchase was cancelled or failed"
    };
  }
};

/**
 * Restore previous purchases
 * This is a simulated function that would integrate with App Store or Google Play
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  hasPremium: boolean;
  error?: string;
}> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would call the respective platform's restore purchases API
  // For iOS: SKPaymentQueue.restoreCompletedTransactions()
  // For Android: queryPurchaseHistoryAsync()
  
  // For demo purposes, simulate a successful restore with 50% chance of having premium
  if (Math.random() > 0.2) { // 80% success rate for demo
    const hasPremium = Math.random() > 0.5;
    if (hasPremium) {
      // Calculate initial expiry date
      const today = new Date();
      const startDate = today.toISOString();
      let expiryDate = new Date();
      expiryDate.setDate(today.getDate() + CONFIG.SUBSCRIPTION.DAYS); // Initial calendar days as fallback
      
      // Save subscription data with market days
      const subscriptionData = {
        isActive: true,
        startDate,
        expiryDate: expiryDate.toISOString(),
        marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS
      };
      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionData));
    }
    return {
      success: true,
      hasPremium
    };
  } else {
    // Simulate a restore failure
    return {
      success: false,
      hasPremium: false,
      error: "Failed to restore purchases. Please try again later."
    };
  }
};

/**
 * Get product details
 * This is a simulated function that would fetch product details from App Store or Google Play
 */
export const getProductDetails = async (): Promise<{
  id: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
}> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would fetch product details from the store
  // For demo purposes, return mock data
  return {
    id: Platform.OS === 'ios' ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID,
    title: "Premium Subscription",
    description: "Unlock all premium features and signals for 7 market days",
    price: CONFIG.SUBSCRIPTION.PRICE.toString(),
    localizedPrice: `$${CONFIG.SUBSCRIPTION.PRICE}`
  };
};

/**
 * Check subscription status
 * This is a simulated function that would check if user has active subscription
 */
export const checkSubscriptionStatus = async (): Promise<{
  isActive: boolean;
  expiryDate?: string;
  productId?: string;
  startDate?: string;
  marketDaysRemaining?: number;
}> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check stored subscription data
  try {
    const subscriptionData = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (subscriptionData) {
      const parsedData = JSON.parse(subscriptionData);
      const isActive = parsedData.isActive;
      const startDate = parsedData.startDate;
      const expiryDate = parsedData.expiryDate;
      const marketDaysRemaining = parsedData.marketDaysRemaining || CONFIG.SUBSCRIPTION.MARKET_DAYS;
      
      if (isActive) {
        return {
          isActive: true,
          expiryDate,
          startDate,
          marketDaysRemaining,
          productId: Platform.OS === 'ios' ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID
        };
      }
    }
  } catch (error) {
    console.error('Error loading subscription data:', error);
  }
  
  // In a real app, this would check with the respective platform's API
  // For demo purposes, return mock data
  const isActive = Math.random() > 0.5;
  
  if (isActive) {
    const today = new Date();
    const startDate = today.toISOString();
    let expiryDate = new Date();
    expiryDate.setDate(today.getDate() + CONFIG.SUBSCRIPTION.DAYS); // Initial calendar days as fallback
    
    // Save initial subscription data
    const subscriptionData = {
      isActive: true,
      startDate,
      expiryDate: expiryDate.toISOString(),
      marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS
    };
    await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionData));
    
    return {
      isActive: true,
      expiryDate: expiryDate.toISOString(),
      startDate,
      marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS,
      productId: Platform.OS === 'ios' ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID
    };
  } else {
    return {
      isActive: false
    };
  }
};

/**
 * Update subscription market days based on market status
 * This function should be called periodically to decrement market days only when market is open
 */
export const updateSubscriptionMarketDays = async (): Promise<{
  isActive: boolean;
  marketDaysRemaining: number;
  expiryDate?: string;
}> => {
  try {
    const subscriptionData = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!subscriptionData) {
      return { isActive: false, marketDaysRemaining: 0 };
    }
    
    const parsedData = JSON.parse(subscriptionData);
    if (!parsedData.isActive) {
      return { isActive: false, marketDaysRemaining: 0 };
    }
    
    // Check if market is open
    const { isOpen } = await checkMarketStatus();
    let marketDaysRemaining = parsedData.marketDaysRemaining || CONFIG.SUBSCRIPTION.MARKET_DAYS;
    
    if (isOpen && marketDaysRemaining > 0) {
      // Decrement market days only if market is open
      marketDaysRemaining -= 1;
      console.log(`Market is open, decrementing subscription days. Remaining: ${marketDaysRemaining}`);
      
      // Update stored data
      const updatedData = {
        ...parsedData,
        marketDaysRemaining,
        isActive: marketDaysRemaining > 0
      };
      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updatedData));
      
      return {
        isActive: marketDaysRemaining > 0,
        marketDaysRemaining,
        expiryDate: parsedData.expiryDate
      };
    } else {
      console.log(`Market is closed or subscription expired, not decrementing. Remaining: ${marketDaysRemaining}`);
      return {
        isActive: marketDaysRemaining > 0,
        marketDaysRemaining,
        expiryDate: parsedData.expiryDate
      };
    }
  } catch (error) {
    console.error('Error updating subscription market days:', error);
    return { isActive: false, marketDaysRemaining: 0 };
  }
};