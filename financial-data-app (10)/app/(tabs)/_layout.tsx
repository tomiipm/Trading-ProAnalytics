import React from 'react';
import { Tabs } from 'expo-router';
import { BarChart2, LineChart, Settings } from 'lucide-react-native';
import { darkTheme } from '@/constants/colors';
import NotificationBell from '@/components/NotificationBell';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: darkTheme.background,
          borderTopColor: darkTheme.border,
          height: width > 400 ? 60 : 50,
          paddingBottom: width > 400 ? 10 : 5,
          paddingHorizontal: width > 400 ? 10 : 5,
        },
        tabBarActiveTintColor: darkTheme.accent,
        tabBarInactiveTintColor: darkTheme.secondaryText,
        tabBarLabelStyle: {
          fontSize: width > 400 ? 10 : 9,
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: darkTheme.background,
        },
        headerTintColor: darkTheme.text,
        headerShadowVisible: false,
        headerRight: () => <NotificationBell />,
        headerRightContainerStyle: {
          paddingRight: width > 400 ? 16 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Signals',
          tabBarIcon: ({ color }) => <BarChart2 size={width > 400 ? 22 : 20} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <LineChart size={width > 400 ? 22 : 20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={width > 400 ? 22 : 20} color={color} />,
        }}
      />
    </Tabs>
  );
}