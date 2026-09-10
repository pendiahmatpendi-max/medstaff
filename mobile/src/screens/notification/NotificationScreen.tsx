import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import MedStaffIcon, { MedStaffIconName } from '../../components/MedStaffIcon';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  getNotifications,
  markNotificationAsRead,
} from '../../api/api';

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

function getCategoryStyle(category: string): {
  category: NotificationCategory;
  color: string;
  icon: MedStaffIconName;
} {
  const value = category?.toLowerCase();

  if (value === 'shift' || value === 'schedule' || value === 'jadwal') {
    return {
      category: 'shift',
      color: '#3b82f6',
      icon: 'calendar',
    };
  }

  if (
    value === 'security' ||
    value === 'keamanan' ||
    value === 'password'
  ) {
    return {
      category: 'security',
      color: '#a855f7',
      icon: 'personal',
    };
  }

  return {
    category: 'system',
    color: '#f59e0b',
    icon: 'notification',
  };
}

function formatNotificationTime(value: unknown): string {
  if (!value) return '-';

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function mapNotification(item: any): NotificationItem {
  const style = getCategoryStyle(
    item?.category ??
      item?.type ??
      item?.notificationType ??
      'system',
  );

  return {
    id: String(item?.id ?? ''),
    title: String(item?.title ?? item?.name ?? 'Notifikasi'),
    description: String(
      item?.description ??
        item?.message ??
        item?.content ??
        '',
    ),
    time: formatNotificationTime(
      item?.createdAt ??
        item?.created_at ??
        item?.time ??
        item?.date,
    ),
    category: style.category,
    color: item?.color ?? style.color,
    icon: (item?.icon ?? style.icon) as MedStaffIconName,
    unread: Boolean(
      item?.unread ??
        item?.isUnread ??
        item?.is_unread ??
        !item?.isRead,
    ),
  };
}

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      const rawData = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.items)
          ? response.data.items
          : Array.isArray(response?.items)
            ? response.items
            : [];

      setNotifications(
        rawData
          .map(mapNotification)
          .filter((item: NotificationItem) => item.id),
      );
    } catch (error) {
      console.error('Gagal mengambil notifikasi:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (notif: NotificationItem) => {
    if (notif.unread) {
      try {
        await markNotificationAsRead(notif.id);
      } catch (error) {
        console.error(
          'Gagal menandai notifikasi sebagai dibaca:',
          error,
        );
      }

      setNotifications(prev =>
        prev.map(item =>
          item.id === notif.id
            ? { ...item, unread: false }
            : item,
        ),
      );
    }

    navigation.navigate('NotificationDetail', {
      notification: {
        ...notif,
        unread: false,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: '#f3f6f8',
        }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather
              name="arrow-left"
              size={22}
              color="#1f2937"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#0b8fac" />
            <Text style={styles.stateText}>
              Memuat notifikasi...
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MedStaffIcon
                name="notification"
                size={28}
                color="#0b8fac"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Belum ada notifikasi
            </Text>

            <Text style={styles.emptyDescription}>
              Notifikasi akan muncul di sini ketika tersedia.
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {notifications.map((notif, index) => (
              <Animated.View
                key={notif.id}
                entering={FadeInUp
                  .delay(index * 100)
                  .springify()
                  .damping(14)}
              >
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => handlePress(notif)}
                >
                  {notif.unread && (
                    <View
                      style={[
                        styles.unreadDot,
                        { backgroundColor: notif.color },
                      ]}
                    />
                  )}

                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: notif.color },
                    ]}
                  >
                    <MedStaffIcon
                      name={notif.icon}
                      size={20}
                      color="#ffffff"
                      variant="filled"
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text
                      style={styles.title}
                      numberOfLines={1}
                    >
                      {notif.title}
                    </Text>

                    <Text
                      style={styles.description}
                      numberOfLines={1}
                    >
                      {notif.description}
                    </Text>

                    <Text style={styles.time}>
                      {notif.time}
                    </Text>
                  </View>

                  <View style={styles.chevronContainer}>
                    <MedStaffIcon
                      name="chevron-right"
                      size={20}
                      color="#bbcabf"
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f8',
  },

  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    paddingTop: 16,
    flexGrow: 1,
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16,
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
  },

  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },

  stateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f6f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },

  emptyDescription: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
