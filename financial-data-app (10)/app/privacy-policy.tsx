import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { darkTheme } from '@/constants/colors';
import { CONFIG } from '@/constants/config';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      {/* We're removing the Stack.Screen options here since they're now defined in _layout.tsx */}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last Updated: October 15, 2023</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Trading ProAnalytics ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you use our application and tell you about your privacy rights.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Data We Collect</Text>
          <Text style={styles.paragraph}>
            We collect and process the following types of personal data:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Account Information: Email address, name, and profile information.</Text>
            <Text style={styles.bulletItem}>• Usage Data: Information about how you use our application, including trading preferences and signal interactions.</Text>
            <Text style={styles.bulletItem}>• Device Information: Information about your mobile device, including device type, operating system, and unique device identifiers.</Text>
            <Text style={styles.bulletItem}>• Subscription Information: Details about your premium subscription, including purchase history and payment information.</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
          <Text style={styles.paragraph}>
            We use your personal data for the following purposes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• To provide and maintain our service, including processing your subscription payments.</Text>
            <Text style={styles.bulletItem}>• To notify you about changes to our service and important trading signals.</Text>
            <Text style={styles.bulletItem}>• To provide customer support and respond to your inquiries.</Text>
            <Text style={styles.bulletItem}>• To improve our application and develop new features.</Text>
            <Text style={styles.bulletItem}>• To monitor the usage of our application for technical and security purposes.</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. In-App Purchases and Subscriptions</Text>
          <Text style={styles.paragraph}>
            Our app offers premium features through in-app purchases and subscriptions processed by Apple App Store and Google Play Store. When you make a purchase:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Payment information is processed by Apple or Google, not by us directly.</Text>
            <Text style={styles.bulletItem}>• We receive confirmation of your subscription status but do not have access to your payment details.</Text>
            <Text style={styles.bulletItem}>• Subscription management, including cancellation, is handled through your App Store or Google Play account settings.</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Sharing and Disclosure</Text>
          <Text style={styles.paragraph}>
            We may share your personal data with:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Service Providers: Third-party companies who provide services to us, such as hosting, analytics, and customer support.</Text>
            <Text style={styles.bulletItem}>• Payment Processors: Apple App Store and Google Play Store for processing subscription payments.</Text>
            <Text style={styles.bulletItem}>• Legal Requirements: When required by law or to protect our rights and safety.</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. 
            However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have the following rights regarding your personal data:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access: The right to request copies of your personal data.</Text>
            <Text style={styles.bulletItem}>• Rectification: The right to request correction of inaccurate data.</Text>
            <Text style={styles.bulletItem}>• Erasure: The right to request deletion of your personal data.</Text>
            <Text style={styles.bulletItem}>• Restriction: The right to request restriction of processing your data.</Text>
            <Text style={styles.bulletItem}>• Data Portability: The right to request transfer of your data to another organization.</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our application is not intended for children under 18 years of age. We do not knowingly collect personal data from children under 18. 
            If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page 
            and updating the "Last Updated" date at the top of this policy.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this privacy policy or our data practices, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>{CONFIG.APP.CONTACT_EMAIL}</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: darkTheme.secondaryText,
    marginBottom: 24,
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
  },
  bulletItem: {
    fontSize: 16,
    color: darkTheme.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: darkTheme.accent,
    marginTop: 8,
  },
});