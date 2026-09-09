import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getActivities, getMyProfile, getTodayActivities } from '../../api/api';

const { width } = Dimensions.get('window');

type Activity = {
  id: string;
  title?: string;
  name?: string;
  description?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  activityDate?: string | null;
  date?: string | null;
  location?: string | null;
  status?: string | null;
  isAttended?: boolean;
  attended?: boolean;
};

const getActivityTitle = (item: Activity) =>
  item.title || item.name || 'Activity';

const getActivityDate = (item: Activity) =>
  item.activityDate || item.date || new Date().toISOString();

const formatDate = (value: string) => {
  const date = new Date(value);

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const formatHeaderDate = () => {
  return new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
};

const formatTime = (value?: string | null) => {
  if (!value) return '--:--';

  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });
};

const getTimeRange = (item: Activity) => {
  const start = formatTime(item.startTime);
  const end = formatTime(item.endTime);

  if (start === '--:--' && end === '--:--') {
    return 'Time not specified';
  }

  if (end === '--:--') {
    return start;
  }

  return `${start} - ${end}`;
};

const getLocation = (item: Activity) =>
  item.location || 'Klinik Pratama UNIMUS';

const isAttended = (item: Activity) =>
  item.isAttended === true ||
  item.attended === true ||
  item.status === 'ATTENDED' ||
  item.status === 'HADIR' ||
  item.status === 'CHECKED_IN';

const getStatusText = (item: Activity) =>
  isAttended(item) ? '✓ Checked In' : 'Not Checked In';

const getIconName = (index: number) => {
  const icons = ['running', 'users', 'book-open', 'trophy'];
  return icons[index % icons.length];
};

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [profileName, setProfileName] = useState('MedStaff');
  const [activeDate, setActiveDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadActivities = async () => {
      try {
        setLoading(true);

        const [activitiesResponse, todayResponse, profileResponse] =
          await Promise.all([
            getActivities(),
            getTodayActivities(),
            getMyProfile(),
          ]);

        if (!mounted) return;

        const allData = Array.isArray(activitiesResponse?.data)
          ? activitiesResponse.data
          : [];

        const todayData = Array.isArray(todayResponse?.data)
          ? todayResponse.data
          : [];

        const merged = [...allData, ...todayData];

        const unique = merged.filter(
          (item: Activity, index: number, array: Activity[]) =>
            array.findIndex((other) => other.id === item.id) === index,
        );

        setActivities(unique);

        const name = profileResponse?.data?.fullName;
        if (name) {
          setProfileName(name);
        }

        if (unique.length > 0) {
          setActiveDate(getActivityDate(unique[0]));
        }
      } catch (error) {
        console.error('Gagal mengambil aktivitas:', error);

        if (mounted) {
          setActivities([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      mounted = false;
    };
  }, []);

  const dates = useMemo(() => {
    const grouped = new Map<string, Activity>();

    activities.forEach((item) => {
      const date = getActivityDate(item);
      const key = new Date(date).toISOString().slice(0, 10);

      if (!grouped.has(key)) {
        grouped.set(key, item);
      }
    });

    return Array.from(grouped.values()).map((item) => ({
      id: item.id,
      date: getActivityDate(item),
    }));
  }, [activities]);

  const selectedActivities = useMemo(() => {
    if (!activeDate) return activities;

    const selectedKey = new Date(activeDate).toISOString().slice(0, 10);

    return activities.filter((item) => {
      const itemKey = new Date(getActivityDate(item))
        .toISOString()
        .slice(0, 10);

      return itemKey === selectedKey;
    });
  }, [activities, activeDate]);

  const heroActivity = selectedActivities[0] || null;
  const otherActivities = selectedActivities.slice(1, 4);

  const handleActivityPress = (activity?: Activity | null) => {
    if (!activity) return;

    if (navigation.getState().routeNames.includes('ActivityDetail')) {
      navigation.navigate('ActivityDetail', {
        id: activity.id,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16 },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>

          <View>
            <Text style={styles.greeting}>Hello, {profileName}</Text>
            <Text style={styles.dateSubtitle}>
              Today, {formatHeaderDate()}
            </Text>
          </View>
        </View>

        {/* HERO ACTIVITY */}
        <View style={styles.heroSection}>
          {loading ? (
            <View style={styles.emptyHero}>
              <Text style={styles.emptyText}>Loading activities...</Text>
            </View>
          ) : heroActivity ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleActivityPress(heroActivity)}
            >
              <LinearGradient
                colors={['#7BC1B7', '#58AAA0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle} numberOfLines={1}>
                    {getActivityTitle(heroActivity)}
                  </Text>

                  <Text style={styles.heroSubtitle} numberOfLines={2}>
                    {getTimeRange(heroActivity)} •{' '}
                    {getLocation(heroActivity)}
                  </Text>

                  <View
                    style={
                      isAttended(heroActivity)
                        ? styles.statusPillSuccess
                        : styles.statusPillPending
                    }
                  >
                    <Text
                      style={
                        isAttended(heroActivity)
                          ? styles.statusTextSuccess
                          : styles.statusTextPending
                      }
                    >
                      {getStatusText(heroActivity)}
                    </Text>
                  </View>
                </View>

                <View style={styles.abstract3DContainer}>
                  <View style={styles.abstractCircle} />
                  <View style={styles.abstractFloatingBox}>
                    <FontAwesome5
                      name={getIconName(0)}
                      size={28}
                      color="#0B8FAC"
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyHero}>
              <FontAwesome5 name="calendar-times" size={30} color="#9CA3AF" />
              <Text style={styles.emptyHeroTitle}>No activities available</Text>
              <Text style={styles.emptyText}>
                There are no activities scheduled.
              </Text>
            </View>
          )}
        </View>

        {/* DATE PICKER */}
        <View style={styles.datePickerSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dates.length > 0 ? (
              dates.map((item) => {
                const itemKey = new Date(item.date).toISOString().slice(0, 10);
                const activeKey = activeDate
                  ? new Date(activeDate).toISOString().slice(0, 10)
                  : '';

                const isActive = activeKey === itemKey;
                const date = new Date(item.date);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.datePill,
                      isActive && styles.datePillActive,
                    ]}
                    onPress={() => setActiveDate(item.date)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        isActive && styles.dateDayActive,
                      ]}
                    >
                      {date.toLocaleDateString('en-US', {
                        weekday: 'short',
                      })}
                    </Text>

                    <Text
                      style={[
                        styles.dateNum,
                        isActive && styles.dateNumActive,
                      ]}
                    >
                      {date.getDate()}
                    </Text>

                    {isActive && <View style={styles.activeDot} />}
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noDatesText}>No dates available</Text>
            )}
          </ScrollView>
        </View>

        {/* BENTO GRID */}
        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Activities</Text>

            <TouchableOpacity>
              <Feather
                name="more-horizontal"
                size={24}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {otherActivities.length > 0 ? (
            <View style={styles.bentoGrid}>
              {otherActivities.map((activity, index) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.bentoCard,
                    index === 0
                      ? styles.bentoLeft
                      : index === 1
                        ? styles.bentoRightTop
                        : styles.bentoRightBottom,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleActivityPress(activity)}
                >
                  <View style={styles.bentoHeader}>
                    <View
                      style={
                        index === 0
                          ? styles.bentoIconLight
                          : styles.bentoIconTeal
                      }
                    >
                      {index === 0 ? (
                        <Feather name="users" size={18} color="#D97706" />
                      ) : index === 1 ? (
                        <Feather name="book-open" size={18} color="#0B8FAC" />
                      ) : (
                        <FontAwesome5
                          name="trophy"
                          size={14}
                          color="#0B8FAC"
                        />
                      )}
                    </View>

                    <Feather
                      name="arrow-up-right"
                      size={20}
                      color="#1F2937"
                    />
                  </View>

                  <View style={styles.bentoActivityContent}>
                    <Text
                      style={[
                        index === 0
                          ? styles.shiftTitle
                          : index === 1
                            ? styles.taskTitle
                            : styles.smallCardTitle,
                      ]}
                      numberOfLines={1}
                    >
                      {getActivityTitle(activity)}
                    </Text>

                    <Text
                      style={
                        index === 0
                          ? styles.shiftTime
                          : index === 1
                            ? styles.taskTime
                            : styles.smallCardTime
                      }
                    >
                      {getTimeRange(activity)}
                    </Text>

                    <View style={styles.locationPill}>
                      <Feather
                        name="map-pin"
                        size={12}
                        color="#1F2937"
                      />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {getLocation(activity)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      isAttended(activity)
                        ? styles.statusPillSuccess
                        : styles.statusPillPending
                    }
                  >
                    <Text
                      style={
                        isAttended(activity)
                          ? styles.statusTextSuccess
                          : styles.statusTextPending
                      }
                    >
                      {getStatusText(activity)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivities}>
              <Feather name="calendar" size={28} color="#9CA3AF" />
              <Text style={styles.emptyActivitiesTitle}>
                No activities available
              </Text>
              <Text style={styles.emptyText}>
                Activities from the clinic will appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  dateSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  heroCard: {
    width: '100%',
    height: 160,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#7BC1B7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 16,
  },
  statusPillSuccess: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusTextSuccess: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTextPending: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  abstract3DContainer: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abstractCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  abstractFloatingBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '15deg' }],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },
  datePickerSection: {
    marginBottom: 32,
  },
  dateScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  datePill: {
    width: 58,
    height: 85,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  datePillActive: {
    backgroundColor: '#0B8FAC',
    ...Platform.select({
      ios: {
        shadowColor: '#0B8FAC',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  dateDayActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  dateNumActive: {
    color: '#FFFFFF',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  noDatesText: {
    color: '#9CA3AF',
    paddingHorizontal: 24,
  },
  scheduleSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  bentoCard: {
    borderRadius: 28,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  bentoLeft: {
    flex: 1,
    minWidth: width * 0.43,
    backgroundColor: '#F6F0D7',
    height: 240,
    justifyContent: 'space-between',
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bentoIconLight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoIconTeal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoActivityContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
  },
  shiftTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  shiftTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B8FAC',
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7BC1B7',
    marginBottom: 6,
  },
  smallCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  smallCardTime: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    maxWidth: width * 0.3,
  },
  bentoRightTop: {
    width: width * 0.42,
    height: 160,
    backgroundColor: '#E6F4F1',
    justifyContent: 'space-between',
    padding: 16,
    overflow: 'hidden',
  },
  bentoRightBottom: {
    width: '100%',
    minHeight: 90,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyHero: {
    height: 160,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  emptyHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#374151',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyActivities: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActivitiesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#374151',
    marginTop: 10,
  },
});
