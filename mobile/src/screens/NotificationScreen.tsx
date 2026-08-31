import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import MedStaffIcon, { MedStaffIconName } from '../components/MedStaffIcon';
import Animated, { FadeInUp } from 'react-native-reanimated';

export type NotificationCategory = 'system' | 'shift' | 'security';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  color: string;
  icon: MedStaffIconName;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'System Update Required',
    description: 'Please update to the latest version of MedStaff.',
    time: '10:42 AM',
    category: 'system',
    color: '#f59e0b', // amber
    icon: 'notification', 
    unread: true,
  },
  {
    id: '2',
    title: 'Shift Change Approved',
    description: 'Your request to swap shifts is approved.',
    time: 'Yesterday, 4:15 PM',
    category: 'shift',
    color: '#3b82f6', // blue
    icon: 'calendar', 
    unread: false,
  },
  {
    id: '3',
    title: 'Password Expiring Soon',
    description: 'Your network password will expire in 3 days.',
    time: 'Mon, 9:00 AM',
    category: 'security',
    color: '#a855f7', // purple
    icon: 'personal', 
    unread: false,
  },
  {
    id: '4',
    title: 'New Shift Assigned',
    description: 'You have been assigned to ER Triage.',
    time: 'Oct 5, 2:30 PM',
    category: 'shift',
    color: '#10b981', // emerald
    icon: 'history', 
    unread: true,
  }
];

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handlePress = (notif: NotificationItem) => {
    // Mark as read locally
    setNotifications(prev => 
      prev.map(n => n.id === notif.id ? { ...n, unread: false } : n)
    );
    // Navigate to detail
    navigation.navigate('NotificationDetail', { notification: notif });
  };

  return (
    <View style={styles.container}>
      {/* HEADER SANGAT SEDERHANA */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#f3f6f8' }}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* NOTIFICATION LIST */}
        <View style={styles.listContainer}>
          {notifications.map((notif, index) => (
            <Animated.View 
              key={notif.id}
              entering={FadeInUp.delay(index * 100).springify().damping(14)}
            >
              <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handlePress(notif)}
              >
                {/* Unread Indicator */}
                {notif.unread && (
                  <View style={[styles.unreadDot, { backgroundColor: notif.color }]} />
                )}
                
                {/* Icon Container */}
                <View style={[styles.iconContainer, { backgroundColor: notif.color }]}>
                  <MedStaffIcon name={notif.icon} size={20} color="#ffffff" variant="filled" />
                </View>
                
                {/* Content */}
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={1}>{notif.title}</Text>
                  <Text style={styles.description} numberOfLines={1}>{notif.description}</Text>
                  <Text style={styles.time}>{notif.time}</Text>
                </View>
                
                {/* Chevron */}
                <View style={styles.chevronContainer}>
                  <MedStaffIcon name="chevron-right" size={20} color="#bbcabf" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f8',
  },
  
  // --- HEADER ---
  headerContent: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', // Title benar-benar center horizontal
    paddingHorizontal: 20 
  },
  backBtn: { 
    position: 'absolute', 
    left: 20, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#ffffff', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2 }, 
      android: { elevation: 1 }
    })
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1f2937' 
  },

  // --- KONTEN ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110, // Memberi ruang untuk bottom navigation bar
    paddingTop: 16,     // Jarak antara header dan list notifikasi
  },
  listContainer: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(187, 202, 191, 0.3)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5 },
      android: { elevation: 1 }
    })
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 5,
    zIndex: 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 },
      android: { elevation: 3 }
    })
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16, // Space for chevron and unread dot
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 1,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9ca3af',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  }
});