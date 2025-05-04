import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Stack } from 'expo-router';
import { Bell, Trash2, ArrowLeft } from 'lucide-react-native';
import { useForexStore } from '@/store/forex-store';
import { darkTheme } from '@/constants/colors';
import NotificationItem from '@/components/NotificationItem';
import { Notification } from '@/types/forex';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markNotificationsAsRead, clearNotifications } = useForexStore();
  
  useEffect(() => {
    // Mark all notifications as read when this screen is opened
    markNotificationsAsRead();
  }, []);
  
  const handleBackPress = () => {
    router.back();
  };
  
  const handleClearAll = () => {
    clearNotifications();
  };
  
  const handleNotificationPress = (notification: Notification) => {
    // Handle notification press based on type
    if (notification.type === 'signal' && notification.data?.signalId) {
      // Navigate to signal details
      router.push(`/signal-details?id=${notification.data.signalId}`);
    } else if (notification.type === 'premium') {
      // Navigate to premium screen
      router.push('/premium');
    } else if (notification.type === 'account') {
      // Navigate to account screen
      router.push('/account');
    }
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Bell size={48} color={darkTheme.secondaryText} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You don't have any notifications yet. We'll notify you about new signals, market updates, and account activity.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerStyle: {
            backgroundColor: darkTheme.background,
          },
          headerTintColor: darkTheme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
              <ArrowLeft size={24} color={darkTheme.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            notifications.length > 0 ? (
              <TouchableOpacity onPress={handleClearAll} style={styles.headerButton}>
                <Trash2 size={20} color={darkTheme.danger} />
              </TouchableOpacity>
            ) : null
          ),
        }}
      />
      
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem 
            notification={item} 
            onPress={() => handleNotificationPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  headerButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
});