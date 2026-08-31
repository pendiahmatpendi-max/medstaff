import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import MedStaffIcon from '../components/MedStaffIcon';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NotificationItem } from './NotificationScreen';

type ParamList = {
  NotificationDetail: { notification: NotificationItem };
};

export default function NotificationDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'NotificationDetail'>>();
  
  // Fallback jikanya params kosong untuk aman
  const notification = route.params?.notification;

  if (!notification) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Notification not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* APP BAR */}
      <View style={[styles.appBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MedStaffIcon name="chevron-left" size={24} color="#0b8fac" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Detail Notifikasi</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          entering={FadeInDown.springify().damping(15)} 
          style={styles.detailCard}
        >
          {/* LARGE ICON CENTERED */}
          <View style={styles.headerCenter}>
            <View style={styles.iconOuterWrapper}>
              {/* Fake opacity layer underneath */}
              <View style={[StyleSheet.absoluteFill, styles.iconSoftBg, { backgroundColor: notification.color }]} />
              <View style={[styles.iconInner, { backgroundColor: notification.color }]}>
                <MedStaffIcon name={notification.icon} size={36} color="#ffffff" variant="filled" />
              </View>
            </View>

            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryText, { color: notification.color }]}>
                {notification.category.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* TEXT CONTENT */}
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{notification.time}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>{notification.description}</Text>
          
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f8',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#f3f6f8',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 }
    })
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b8fac',
  },
  placeholder: {
    width: 44,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(187, 202, 191, 0.3)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 }
    })
  },
  headerCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconOuterWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  iconSoftBg: {
    opacity: 0.15,
  },
  iconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
      android: { elevation: 4 }
    })
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f6f8',
    borderWidth: 1,
    borderColor: 'rgba(187, 202, 191, 0.4)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(187, 202, 191, 0.4)',
    marginHorizontal: -24,
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  }
});
