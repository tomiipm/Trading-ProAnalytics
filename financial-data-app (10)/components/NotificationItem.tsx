import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Bell, BarChart2, User, Zap, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Notification } from '@/types/forex';
import { darkTheme } from '@/constants/colors';

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const router = useRouter();
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'signal':
        return <BarChart2 size={20} color={darkTheme.accent} />;
      case 'account':
        return <User size={20} color="#4cd137" />;
      case 'premium':
        return <Zap size={20} color={darkTheme.premium} />;
      case 'market':
        return <Globe size={20} color="#00a8ff" />;
      default:
        return <Bell size={20} color={darkTheme.text} />;
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (notification.type === 'signal' && notification.data?.signalId) {
      // Navigate to signal details
      router.push(`/signal-details?id=${notification.data.signalId}`);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, notification.read && styles.readContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: notification.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(108, 92, 231, 0.1)' }
      ]}>
        {getNotificationIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(notification.timestamp)}</Text>
      </View>
      
      {!notification.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  readContainer: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: darkTheme.secondaryText,
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: darkTheme.secondaryText,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkTheme.accent,
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});