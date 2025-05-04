import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert, Linking, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Bell, HelpCircle, Shield, ExternalLink, ChevronRight } from 'lucide-react-native';
import { darkTheme } from '@/constants/colors';
import { CONFIG } from '@/constants/config';
import SettingsItem from '@/components/SettingsItem';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleOpenUserManual = () => {
    router.push('/user-manual');
  };
  
  const handleOpenPrivacyPolicy = () => {
    router.push('/privacy-policy');
  };
  
  const handleContactSupport = () => {
    const email = CONFIG.APP.CONTACT_EMAIL;
    const subject = 'Support Request - Trading ProAnalytics';
    const body = 'Hello, I need assistance with...';
    
    let url = '';
    if (Platform.OS === 'ios') {
      url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'Email Not Available',
            `Please contact us at ${email}`,
            [{ text: 'OK' }]
          );
        }
      })
      .catch(error => {
        console.error('Error opening email:', error);
        Alert.alert(
          'Error',
          `Please contact us at ${email}`,
          [{ text: 'OK' }]
        );
      });
  };
  
  const handleOpenWebsite = () => {
    Linking.openURL(CONFIG.APP.WEBSITE)
      .catch(err => {
        console.error("Couldn't open website:", err);
        Alert.alert('Error', "Couldn't open website");
      });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} style={styles.settingIcon} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: darkTheme.border, true: 'rgba(108, 92, 231, 0.5)' }}
              thumbColor={notificationsEnabled ? darkTheme.accent : darkTheme.secondaryText}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleOpenUserManual}>
            <View style={styles.settingLeft}>
              <HelpCircle size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} style={styles.settingIcon} />
              <Text style={styles.settingText}>User Manual</Text>
            </View>
            <ChevronRight size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleContactSupport}>
            <View style={styles.settingLeft}>
              <ExternalLink size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} style={styles.settingIcon} />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <ChevronRight size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleOpenPrivacyPolicy}>
            <View style={styles.settingLeft}>
              <Shield size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} style={styles.settingIcon} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={width > 400 ? 20 : 18} color={darkTheme.secondaryText} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.appVersion}>
            {CONFIG.APP.NAME} v{CONFIG.APP.VERSION}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: width > 400 ? 20 : 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: width > 400 ? 30 : 25,
  },
  sectionTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: width > 400 ? 16 : 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width > 400 ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: width > 400 ? 12 : 10,
  },
  settingText: {
    fontSize: width > 400 ? 16 : 14,
    color: darkTheme.text,
  },
  footer: {
    alignItems: 'center',
    marginTop: width > 400 ? 20 : 15,
  },
  appVersion: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
  },
});