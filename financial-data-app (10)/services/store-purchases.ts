import { Platform } from "react-native"
import { CONFIG } from "@/constants/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { checkMarketStatus } from "./api"
import {
  initConnection,
  getSubscriptions,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  type PurchaseError,
  type SubscriptionPurchase,
  type Subscription,
} from "react-native-iap"

// Storage key for subscription data
const SUBSCRIPTION_STORAGE_KEY = "subscription_data"

// Define subscription SKUs
const subscriptionSkus = Platform.select({
  ios: [CONFIG.STORE.IOS_PRODUCT_ID],
  android: [CONFIG.STORE.ANDROID_PRODUCT_ID],
  default: [],
})

// Connection status
let isIAPConnected = false

/**
 * Initialize in-app purchases
 * This connects to the billing service and sets up listeners
 */
export const initializeIAP = async (): Promise<boolean> => {
  try {
    // Connect to the store
    const result = await initConnection()
    console.log("IAP connection result:", result)
    isIAPConnected = true

    // Set up purchase listeners
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log("Purchase updated:", purchase)

      // Important: Acknowledge/finish the transaction
      if (purchase.transactionReceipt) {
        try {
          // Verify the purchase on your server (recommended)
          const isValid = await verifyPurchaseOnServer(purchase)

          if (isValid) {
            // Store the subscription data locally
            await saveSubscriptionData(purchase)

            // Finish the transaction
            await finishTransaction({ purchase, isConsumable: false })
          }
        } catch (error) {
          console.error("Error handling purchase update:", error)
        }
      }
    })

    const purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.error("Purchase error:", error)
    })

    // Store the subscriptions for cleanup
    // @ts-ignore - Adding to global for cleanup in _layout.tsx
    global.purchaseUpdateSubscription = purchaseUpdateSubscription
    // @ts-ignore - Adding to global for cleanup in _layout.tsx
    global.purchaseErrorSubscription = purchaseErrorSubscription

    return true
  } catch (error) {
    console.error("Error initializing IAP:", error)
    isIAPConnected = false
    return false
  }
}

/**
 * Clean up IAP listeners
 * Call this when the app is closing or when IAP is no longer needed
 */
export const cleanupIAP = () => {
  // @ts-ignore - Accessing from global for cleanup
  if (global.purchaseUpdateSubscription) {
    // @ts-ignore - Accessing from global for cleanup
    global.purchaseUpdateSubscription.remove()
    // @ts-ignore - Accessing from global for cleanup
    global.purchaseUpdateSubscription = null
  }

  // @ts-ignore - Accessing from global for cleanup
  if (global.purchaseErrorSubscription) {
    // @ts-ignore - Accessing from global for cleanup
    global.purchaseErrorSubscription.remove()
    // @ts-ignore - Accessing from global for cleanup
    global.purchaseErrorSubscription = null
  }
}

/**
 * Get available subscriptions from the store
 */
export const getAvailableSubscriptions = async (): Promise<Subscription[]> => {
  try {
    if (!isIAPConnected) {
      await initializeIAP()
    }

    const subscriptions = await getSubscriptions({ skus: subscriptionSkus })
    console.log("Available subscriptions:", subscriptions)
    return subscriptions
  } catch (error) {
    console.error("Error getting subscriptions:", error)
    return []
  }
}

/**
 * Purchase a subscription
 */
export const purchasePremium = async (): Promise<{
  success: boolean
  transactionId?: string
  error?: string
}> => {
  try {
    if (!isIAPConnected) {
      await initializeIAP()
    }

    // Get the appropriate SKU for the current platform
    const sku = Platform.OS === "ios" ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID

    // Request the subscription
    await requestSubscription({
      sku,
      // For Android, you can specify if it's a replacement
      // androidOfferToken: 'offer_token_here', // Optional
    })

    // The actual purchase handling is done in the purchaseUpdatedListener
    // We return success here, but the actual success is determined in the listener
    return {
      success: true,
      transactionId: `pending_${Date.now()}`, // This will be updated in the listener
    }
  } catch (error) {
    console.error("Error purchasing subscription:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during purchase",
    }
  }
}

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean
  hasPremium: boolean
  error?: string
}> => {
  try {
    if (!isIAPConnected) {
      await initializeIAP()
    }

    // Get available purchases
    const purchases = await getAvailablePurchases()
    console.log("Available purchases:", purchases)

    if (purchases.length === 0) {
      return { success: true, hasPremium: false }
    }

    // Check if any of the purchases is our premium subscription
    let hasPremium = false

    for (const purchase of purchases) {
      // Check if this purchase is our subscription
      if (subscriptionSkus.includes(purchase.productId) && !purchase.isExpired) {
        // Verify the purchase on your server (recommended)
        const isValid = await verifyPurchaseOnServer(purchase)

        if (isValid) {
          // Store the subscription data locally
          await saveSubscriptionData(purchase)
          hasPremium = true
        }
      }
    }

    return { success: true, hasPremium }
  } catch (error) {
    console.error("Error restoring purchases:", error)
    return {
      success: false,
      hasPremium: false,
      error: error instanceof Error ? error.message : "Unknown error during restore",
    }
  }
}

/**
 * Get subscription status
 */
export const getSubscriptionStatus = async (): Promise<{
  isActive: boolean
  expiryDate?: string
  productId?: string
  startDate?: string
  marketDaysRemaining?: number
}> => {
  try {
    // First check local storage
    const subscriptionData = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY)

    if (subscriptionData) {
      const parsedData = JSON.parse(subscriptionData)

      // If we have local data, verify it's still valid
      if (parsedData.expiryDate && new Date(parsedData.expiryDate) > new Date()) {
        return {
          isActive: true,
          expiryDate: parsedData.expiryDate,
          productId: parsedData.productId,
          startDate: parsedData.startDate,
          marketDaysRemaining: parsedData.marketDaysRemaining || CONFIG.SUBSCRIPTION.MARKET_DAYS,
        }
      }
    }

    // If no valid local data, check with the store
    if (!isIAPConnected) {
      await initializeIAP()
    }

    const purchases = await getAvailablePurchases()

    for (const purchase of purchases) {
      if (subscriptionSkus.includes(purchase.productId) && !purchase.isExpired) {
        // Verify the purchase on your server (recommended)
        const isValid = await verifyPurchaseOnServer(purchase)

        if (isValid) {
          // Store the subscription data locally
          await saveSubscriptionData(purchase)

          // Get the stored data (which now includes market days)
          const updatedData = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
          if (updatedData) {
            const parsedUpdatedData = JSON.parse(updatedData)
            return {
              isActive: true,
              expiryDate: parsedUpdatedData.expiryDate,
              productId: parsedUpdatedData.productId,
              startDate: parsedUpdatedData.startDate,
              marketDaysRemaining: parsedUpdatedData.marketDaysRemaining || CONFIG.SUBSCRIPTION.MARKET_DAYS,
            }
          }
        }
      }
    }

    // No active subscription found
    return { isActive: false }
  } catch (error) {
    console.error("Error getting subscription status:", error)
    return { isActive: false }
  }
}

/**
 * Update subscription market days based on market status
 */
export const updateSubscriptionMarketDays = async (): Promise<{
  isActive: boolean
  marketDaysRemaining: number
  expiryDate?: string
}> => {
  try {
    const subscriptionData = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    if (!subscriptionData) {
      return { isActive: false, marketDaysRemaining: 0 }
    }

    const parsedData = JSON.parse(subscriptionData)
    if (!parsedData.isActive) {
      return { isActive: false, marketDaysRemaining: 0 }
    }

    // Check if market is open
    const { isOpen } = await checkMarketStatus()
    let marketDaysRemaining = parsedData.marketDaysRemaining || CONFIG.SUBSCRIPTION.MARKET_DAYS

    if (isOpen && marketDaysRemaining > 0) {
      // Decrement market days only if market is open
      marketDaysRemaining -= 1
      console.log(`Market is open, decrementing subscription days. Remaining: ${marketDaysRemaining}`)

      // Update stored data
      const updatedData = {
        ...parsedData,
        marketDaysRemaining,
        isActive: marketDaysRemaining > 0,
      }
      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updatedData))

      return {
        isActive: marketDaysRemaining > 0,
        marketDaysRemaining,
        expiryDate: parsedData.expiryDate,
      }
    } else {
      console.log(`Market is closed or subscription expired, not decrementing. Remaining: ${marketDaysRemaining}`)
      return {
        isActive: marketDaysRemaining > 0,
        marketDaysRemaining,
        expiryDate: parsedData.expiryDate,
      }
    }
  } catch (error) {
    console.error("Error updating subscription market days:", error)
    return { isActive: false, marketDaysRemaining: 0 }
  }
}

/**
 * Verify purchase with your server
 * This is a critical security step to prevent fraud
 */
const verifyPurchaseOnServer = async (purchase: SubscriptionPurchase): Promise<boolean> => {
  try {
    // In a real app, you would send the purchase receipt to your server
    // Your server would then verify it with Google Play or Apple App Store

    // For now, we'll simulate a successful verification
    console.log("Verifying purchase on server:", purchase.productId)

    // TODO: Replace with actual server verification
    // const response = await fetch('https://your-backend.com/verify-purchase', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     receipt: purchase.transactionReceipt,
    //     productId: purchase.productId,
    //     platform: Platform.OS
    //   })
    // });
    // const result = await response.json();
    // return result.isValid;

    return true
  } catch (error) {
    console.error("Error verifying purchase:", error)
    return false
  }
}

/**
 * Save subscription data to local storage
 */
const saveSubscriptionData = async (purchase: SubscriptionPurchase): Promise<void> => {
  try {
    // Extract expiry date from the purchase
    // Note: This is simplified - in a real app you'd parse the receipt properly
    const now = new Date()
    const expiryDate = new Date()

    // For demo purposes, we'll set expiry to 7 days from now
    // In a real app, you'd get this from the purchase receipt
    expiryDate.setDate(now.getDate() + CONFIG.SUBSCRIPTION.DAYS)

    const subscriptionData = {
      isActive: true,
      productId: purchase.productId,
      purchaseToken: purchase.purchaseToken,
      transactionId: purchase.transactionId,
      transactionDate: purchase.transactionDate,
      startDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      marketDaysRemaining: CONFIG.SUBSCRIPTION.MARKET_DAYS,
    }

    await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionData))
    console.log("Subscription data saved:", subscriptionData)
  } catch (error) {
    console.error("Error saving subscription data:", error)
  }
}

/**
 * Get product details
 */
export const getProductDetails = async (): Promise<{
  id: string
  title: string
  description: string
  price: string
  localizedPrice: string
}> => {
  try {
    if (!isIAPConnected) {
      await initializeIAP()
    }

    const subscriptions = await getSubscriptions({ skus: subscriptionSkus })

    if (subscriptions.length > 0) {
      const subscription = subscriptions[0]
      return {
        id: subscription.productId,
        title: subscription.title,
        description: subscription.description,
        price: subscription.price,
        localizedPrice: subscription.localizedPrice,
      }
    }

    throw new Error("No subscription products found")
  } catch (error) {
    console.error("Error getting product details:", error)

    // Return fallback data
    return {
      id: Platform.OS === "ios" ? CONFIG.STORE.IOS_PRODUCT_ID : CONFIG.STORE.ANDROID_PRODUCT_ID,
      title: "Premium Subscription",
      description: "Unlock all premium features and signals for 7 market days",
      price: CONFIG.SUBSCRIPTION.PRICE.toString(),
      localizedPrice: `$${CONFIG.SUBSCRIPTION.PRICE}`,
    }
  }
}
