import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, Platform, ActivityIndicator, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { User, Mail, LogOut, ChevronRight, Zap, Clock, Shield, Bell } from 'lucide-react-native';
import { darkTheme } from '@/constants/colors';
import { useForexStore } from '@/store/forex-store';
import { CONFIG } from '@/constants/config';

const { width } = Dimensions.get('window');

export default function AccountScreen() {
  const router = useRouter();
  const { isPremium, premiumExpiryDate, marketDaysRemaining, setPremiumStatus } = useForexStore();
  const [loading, setLoading] = useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {
          // Here you would handle the logout logic
          // For now, we'll just navigate to a hypothetical login screen or home
          router.push('/(tabs)');
        }}
      ]
    );
  };
  
  const handlePremiumPress = () => {
    router.push('/premium');
  };
  
  const formatExpiryDate = () => {
    if (!premiumExpiryDate) return 'N/A';
    const date = new Date(premiumExpiryDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <User size={width > 400 ? 48 : 40} color={darkTheme.secondaryText} />
          </View