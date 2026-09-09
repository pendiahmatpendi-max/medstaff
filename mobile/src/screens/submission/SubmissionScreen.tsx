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
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  getMyLeaveRequests,
  getMyDocumentRequests,
} from '../../api/api';

type SubmissionStatus = 'Pending Approval' | 'Approved' | 'Rejected';

interface Submission {
  id: string;
  type: string;
  date: string;
  status: SubmissionStatus;
  iconName: string;
  iconColors: [string, string];
}

const getStatusValue = (item: any): string => {
  return String(
    item?.status ??
      item?.leaveStatus ??
      item?.documentRequestStatus ??
      '',
  ).toUpperCase();
};

const normalizeStatus = (item: any): SubmissionStatus => {
  const status = getStatusValue(item);

  if (status === 'APPROVED') {
    return 'Approved';
  }

  if (status === 'REJECTED') {
    return 'Rejected';
  }

  return 'Pending Approval';
};

const getItemDate = (item: any): string => {
  const value =
    item?.createdAt ??
    item?.requestDate ??
    item?.startDate ??
    item?.date;

  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const mapLeaveSubmission = (item: any): Submission => ({
  id: `leave-${item?.id ?? Math.random()}`,
  type: 'Leave Request',
  date: getItemDate(item),
  status: normalizeStatus(item),
  iconName: 'calendar-day',
  iconColors: ['#fb923c', '#ea580c'],
});

const mapDocumentSubmission = (item: any): Submission => ({
  id: `document-${item?.id ?? Math.random()}`,
  type: 'Document Request',
  date: getItemDate(item),
  status: normalizeStatus(item),
  iconName: 'file-alt',
  iconColors: ['#60a5fa', '#2563eb'],
});

const AppIcon3D = ({
  iconName,
  colors,
  size = 48,
  iconSize = 20,
}: {
  iconName: string;
  colors: [string, string];
  size?: number;
  iconSize?: number;
}) => {
  return (
    <View
      style={[
        styles.icon3DContainer,
        {
          width: size,
          height: size,
          backgroundColor: colors[1],
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.icon3DHighlight,
          { height: size * 0.55 },
        ]}
      />

      <LinearGradient
        colors={[
          'transparent',
          'rgba(0,0,0,0.2)',
        ]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <FontAwesome5
        name={iconName}
        size={iconSize}
        color="#ffffff"
        solid
        style={styles.icon3DObject}
      />
    </View>
  );
};

export default function SubmissionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSubmissions = async () => {
      try {
        setLoading(true);

        const [leaveResponse, documentResponse] =
          await Promise.allSettled([
            getMyLeaveRequests(),
            getMyDocumentRequests(),
          ]);

        if (!mounted) {
          return;
        }

        const leaveData =
          leaveResponse.status === 'fulfilled'
            ? leaveResponse.value?.data
            : [];

        const documentData =
          documentResponse.status === 'fulfilled'
            ? documentResponse.value?.data
            : [];

        const leaveItems = Array.isArray(leaveData)
          ? leaveData
          : leaveData?.items ??
            leaveData?.requests ??
            leaveData?.leaveRequests ??
            [];

        const documentItems = Array.isArray(documentData)
          ? documentData
          : documentData?.items ??
            documentData?.requests ??
            documentData?.documentRequests ??
            [];

        const combined = [
          ...leaveItems.map(mapLeaveSubmission),
          ...documentItems.map(mapDocumentSubmission),
        ];

        combined.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
            return 0;
          }

          return dateB - dateA;
        });

        setSubmissions(combined);
      } catch (error) {
        console.error(
          'Gagal mengambil data submissions:',
          error,
        );

        if (mounted) {
          setSubmissions([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSubmissions();

    return () => {
      mounted = false;
    };
  }, []);

  const pendingCount = submissions.filter(
    (item) => item.status === 'Pending Approval',
  ).length;

  const approvedCount = submissions.filter(
    (item) => item.status === 'Approved',
  ).length;

  const rejectedCount = submissions.filter(
    (item) => item.status === 'Rejected',
  ).length;

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'Pending Approval':
        return {
          bg: '#fef3c7',
          text: '#d97706',
          dot: '#f59e0b',
        };

      case 'Approved':
        return {
          bg: '#dcfce7',
          text: '#16a34a',
          dot: '#22c55e',
        };

      case 'Rejected':
        return {
          bg: '#fee2e2',
          text: '#dc2626',
          dot: '#ef4444',
        };

      default:
        return {
          bg: '#f3f4f6',
          text: '#6b7280',
          dot: '#9ca3af',
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: '#F9F9F9',
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

          <Text style={styles.headerTitle}>
            Submissions
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SUMMARY */}
        <LinearGradient
          colors={['#7bc1b7', '#0b8fac']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View
            style={[
              styles.decorCircle,
              {
                top: -40,
                right: -20,
                width: 150,
                height: 150,
              },
            ]}
          />

          <View
            style={[
              styles.decorCircle,
              {
                bottom: -50,
                left: -30,
                width: 120,
                height: 120,
                opacity: 0.05,
              },
            ]}
          />

          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>
              Submission Summary
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Submission')
              }
            >
              <Text style={styles.heroCta}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingSummary}>
              <ActivityIndicator
                size="small"
                color="#ffffff"
              />
            </View>
          ) : (
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatValue,
                    { color: '#fef3c7' },
                  ]}
                >
                  {pendingCount}
                </Text>

                <Text style={styles.heroStatLabel}>
                  Pending
                </Text>
              </View>

              <View style={styles.heroStatDivider} />

              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatValue,
                    { color: '#dcfce7' },
                  ]}
                >
                  {approvedCount}
                </Text>

                <Text style={styles.heroStatLabel}>
                  Approved
                </Text>
              </View>

              <View style={styles.heroStatDivider} />

              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatValue,
                    { color: '#fee2e2' },
                  ]}
                >
                  {rejectedCount}
                </Text>

                <Text style={styles.heroStatLabel}>
                  Rejected
                </Text>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* SHORTCUT GRID */}
        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() =>
              navigation.navigate('LeaveRequest')
            }
            activeOpacity={0.7}
          >
            <AppIcon3D
              iconName="calendar-day"
              colors={['#fb923c', '#ea580c']}
              size={50}
              iconSize={24}
            />

            <Text style={styles.shortcutItemText}>
              Leave
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() =>
              navigation.navigate('Adjustment')
            }
            activeOpacity={0.7}
          >
            <AppIcon3D
              iconName="user-check"
              colors={['#4ade80', '#16a34a']}
              size={50}
              iconSize={24}
            />

            <Text style={styles.shortcutItemText}>
              Adjustment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() =>
              navigation.navigate('Shift')
            }
            activeOpacity={0.7}
          >
            <AppIcon3D
              iconName="exchange-alt"
              colors={['#c084fc', '#7c3aed']}
              size={50}
              iconSize={24}
            />

            <Text style={styles.shortcutItemText}>
              Shift
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() =>
              navigation.navigate('Overtime')
            }
            activeOpacity={0.7}
          >
            <AppIcon3D
              iconName="stopwatch"
              colors={['#fbbf24', '#d97706']}
              size={50}
              iconSize={24}
            />

            <Text style={styles.shortcutItemText}>
              Overtime
            </Text>
          </TouchableOpacity>
        </View>

        {/* RECENT SUBMISSIONS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Recent Submissions
          </Text>

          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator
                size="small"
                color="#0B8FAC"
              />

              <Text style={styles.emptyTitle}>
                Loading submissions...
              </Text>
            </View>
          ) : submissions.length > 0 ? (
            <View style={styles.recentList}>
              {submissions.map((item) => {
                const statusColors =
                  getStatusColor(item.status);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recentCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recentIconWrapper}>
                      <AppIcon3D
                        iconName={item.iconName}
                        colors={item.iconColors}
                        size={36}
                        iconSize={14}
                      />
                    </View>

                    <View style={styles.recentContent}>
                      <Text style={styles.recentType}>
                        {item.type}
                      </Text>

                      <Text style={styles.recentDate}>
                        {item.date}
                      </Text>
                    </View>

                    <View
                      style={styles.recentStatusArea}
                    >
                      <View
                        style={[
                          styles.statusPill,
                          {
                            backgroundColor:
                              statusColors.bg,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor:
                                statusColors.dot,
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                statusColors.text,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.status ===
                          'Pending Approval'
                            ? 'Pending'
                            : item.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Feather
                  name="file-text"
                  size={26}
                  color="#0B8FAC"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No submissions yet
              </Text>

              <Text style={styles.emptySubtitle}>
                Belum ada pengajuan yang tersedia.
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
    backgroundColor: '#F9F9F9',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
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
        shadowOffset: {
          width: 0,
          height: 1,
        },
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

  icon3DContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon3DHighlight: {
    position: 'absolute',
    top: -5,
    left: -10,
    right: -10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },

  icon3DObject: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3,
    zIndex: 10,
    marginTop: 1,
  },

  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    overflow: 'hidden',

    ...Platform.select({
      ios: {
        shadowColor: '#0b8fac',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  decorCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
  },

  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },

  heroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  heroCta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  loadingSummary: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },

  heroStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  heroStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },

  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 28,
  },

  shortcutItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  shortcutItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1C1C',
    textAlign: 'center',
    marginTop: 6,
  },

  sectionContainer: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1C1C',
    marginBottom: 14,
  },

  recentList: {
    gap: 8,
  },

  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  recentIconWrapper: {
    marginRight: 12,
  },

  recentContent: {
    flex: 1,
    marginRight: 8,
  },

  recentType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1C',
    marginBottom: 2,
  },

  recentDate: {
    fontSize: 12,
    color: '#6C7A71',
  },

  recentStatusArea: {
    alignItems: 'flex-end',
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderStyle: 'dashed',
  },

  emptyIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F3F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1C',
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 12,
    color: '#6C7A71',
  },
});
