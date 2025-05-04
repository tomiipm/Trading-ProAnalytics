import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { darkTheme } from '@/constants/colors';
import { CONFIG } from '@/constants/config';

export default function UserManualScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      {/* We're removing the Stack.Screen options here since they're now defined in _layout.tsx */}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://placehold.co/80x80?text=TPA+Logo' }}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>{CONFIG.APP.NAME}</Text>
        </View>
        
        <Text style={styles.title}>User Manual</Text>
        <Text style={styles.subtitle}>Learn how to use Trading ProAnalytics</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Getting Started</Text>
          <Text style={styles.paragraph}>
            Welcome to Trading ProAnalytics! This app provides you with professional-grade forex trading signals and analytics to help improve your trading decisions.
          </Text>
          <Text style={styles.paragraph}>
            After installing the app, you'll see the main dashboard with trading signals. You can browse through active signals, view historical data, and check performance statistics.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Trading Signals</Text>
          <Text style={styles.paragraph}>
            The Signals tab shows you all available trading opportunities:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Active Signals:</Text> Currently open trading opportunities</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Last 7 Days:</Text> Recent signals from the past week</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Favorites:</Text> Signals you've marked as favorites</Text>
          </View>
          <Text style={styles.paragraph}>
            Tap on any signal to view detailed information including entry price, stop loss, take profit levels, and technical analysis.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Statistics</Text>
          <Text style={styles.paragraph}>
            The Statistics tab provides performance metrics:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Win rate and accuracy percentages</Text>
            <Text style={styles.bulletItem}>• Total pips gained/lost</Text>
            <Text style={styles.bulletItem}>• Performance charts showing daily and weekly results</Text>
            <Text style={styles.bulletItem}>• Risk/reward ratio and other trading metrics</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Premium Features</Text>
          <Text style={styles.paragraph}>
            Upgrade to Premium ($6.99 for 7 days) to unlock:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Unlimited trading signals</Text>
            <Text style={styles.bulletItem}>• Advanced technical analysis</Text>
            <Text style={styles.bulletItem}>• Real-time market alerts</Text>
            <Text style={styles.bulletItem}>• Performance analytics</Text>
            <Text style={styles.bulletItem}>• Priority customer support</Text>
            <Text style={styles.bulletItem}>• Historical data access</Text>
          </View>
          <Text style={styles.paragraph}>
            To subscribe, go to the Settings tab and tap "Upgrade to Premium" or visit the Premium page directly.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Notifications</Text>
          <Text style={styles.paragraph}>
            Stay updated with real-time notifications:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• New trading signal alerts</Text>
            <Text style={styles.bulletItem}>• Market updates and news</Text>
            <Text style={styles.bulletItem}>• Account notifications</Text>
            <Text style={styles.bulletItem}>• Premium feature announcements</Text>
          </View>
          <Text style={styles.paragraph}>
            You can customize notification settings in the Account section.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Account Management</Text>
          <Text style={styles.paragraph}>
            In the Account section, you can:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Update your profile information</Text>
            <Text style={styles.bulletItem}>• Manage notification preferences</Text>
            <Text style={styles.bulletItem}>• View and manage your subscription</Text>
            <Text style={styles.bulletItem}>• Access privacy settings</Text>
            <Text style={styles.bulletItem}>• Contact support</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Best Practices</Text>
          <Text style={styles.paragraph}>
            For the best trading results:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Always use proper risk management</Text>
            <Text style={styles.bulletItem}>• Follow the recommended stop loss and take profit levels</Text>
            <Text style={styles.bulletItem}>• Consider the probability rating for each signal</Text>
            <Text style={styles.bulletItem}>• Review the performance statistics regularly</Text>
            <Text style={styles.bulletItem}>• Use signals as part of your overall trading strategy</Text>
          </View>
        </View>
        
        <Text style={styles.supportText}>
          Need more help? Contact our support team at {CONFIG.APP.CONTACT_EMAIL}
        </Text>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: darkTheme.secondaryText,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: darkTheme.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 16,
    color: darkTheme.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
  supportText: {
    fontSize: 16,
    color: darkTheme.accent,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});