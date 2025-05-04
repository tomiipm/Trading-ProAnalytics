import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { useForexStore } from '@/store/forex-store';
import { initializeIAP, getSubscriptionStatus } from '@/services/store-purchases';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setPremiumStatus } = useForexStore();
  
  // Load fonts if needed
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });
  
  // Initialize in-app purchases and check subscription status
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize IAP
        await initializeIAP();
        
        // Check subscription status
        const status = await getSubscriptionStatus();
        if (status.isActive && status.expiryDate) {
          setPremiumStatus(true, status.expiryDate, 'subscription');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initializeApp();
  }, []);
  
  // Wait for fonts to load
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#F5F5F5',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#121212',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="signal-details" 
          options={{ 
            title: 'Signal Details',
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="premium" 
          options={{ 
            title: 'Premium Subscription',
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="account" 
          options={{ 
            title: 'Account',
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{ 
            title: 'Notifications',
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="user-manual" 
          options={{ 
            title: 'User Manual',
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="privacy-policy" 
          options={{ 
            title: 'Privacy Policy',
            headerShown: true,
            presentation: 'modal',
          }} 
        />
      </Stack>
    </>
  );
}