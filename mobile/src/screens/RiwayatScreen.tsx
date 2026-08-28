import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  getAttendanceHistory,
  AttendanceRecord,
} from '../api/api';

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateString: string | null) {
  if (!dateString) return '--:--';

  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDuration(
  clockIn: string | null,
  clockOut: string | null,
) {
  if (!clockIn || !clockOut) {
    return '-';
  }

  const start = new Date(clockIn).getTime();
  const end = new Date(clockOut).getTime();

  const totalMinutes = Math.max(
    0,
    Math.floor((end - start) / 60000),
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

function getStatusText(record: AttendanceRecord) {
  if (record.status === 'TERLAMBAT') {
    return 'Terlambat';
  }

  if (record.status === 'IZIN') {
    return 'Izin';
  }

  return 'Tepat Waktu';
}

function getStatusColor(record: AttendanceRecord) {
  if (record.status === 'TERLAMBAT') {
    return '#f97316';
  }

  if (record.status === 'IZIN') {
    return '#ef4444';
  }

  return '#10b981';
}

export default function RiwayatScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      setError('');

      const result = await getAttendanceHistory();

      setRecords(result.data || []);
    } catch (err: any) {
      setError(
        err?.message || 'Gagal mengambil riwayat absensi',
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      loadHistory().finally(() => {
        setLoading(false);
      });
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);

    await loadHistory();

    setRefreshing(false);
  };

  const hadirCount = records.filter(
    item => item.status === 'HADIR',
  ).length;

  const terlambatCount = records.filter(
    item => item.status === 'TERLAMBAT',
  ).length;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather
            name="chevron-left"
            size={24}
            color="#1f2937"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Riwayat Absensi
        </Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onRefresh}
        >
          <Feather
            name="refresh-cw"
            size={20}
            color="#1f2937"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Text style={styles.sectionTitle}>
          Ringkasan Absensi
        </Text>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconBg,
                { backgroundColor: '#d1fae5' },
              ]}
            >
              <Feather
                name="check-circle"
                size={18}
                color="#059669"
              />
            </View>

            <Text style={styles.summaryLabel}>
              Hadir
            </Text>

            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryValue}>
                {hadirCount}
              </Text>

              <Text style={styles.summaryUnit}>
                hr
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconBg,
                { backgroundColor: '#ffedd5' },
              ]}
            >
              <Feather
                name="clock"
                size={18}
                color="#ea580c"
              />
            </View>

            <Text style={styles.summaryLabel}>
              Terlambat
            </Text>

            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryValue}>
                {terlambatCount}
              </Text>

              <Text style={styles.summaryUnit}>
                hr
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.groupHeader}>
          <Text style={styles.sectionTitle}>
            Riwayat Terbaru
          </Text>

          <Text style={styles.dateRange}>
            {records.length} data
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator
              size="large"
              color="#0b8fac"
            />

            <Text style={styles.infoText}>
              Mengambil riwayat absensi...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyBox}>
            <Feather
              name="alert-circle"
              size={40}
              color="#ef4444"
            />

            <Text style={styles.emptyTitle}>
              Gagal mengambil data
            </Text>

            <Text style={styles.emptyText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryBtn}
              onPress={onRefresh}
            >
              <Text style={styles.retryText}>
                Coba Lagi
              </Text>
            </TouchableOpacity>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather
              name="calendar"
              size={40}
              color="#9ca3af"
            />

            <Text style={styles.emptyTitle}>
              Belum ada riwayat
            </Text>

            <Text style={styles.emptyText}>
              Data absensi yang berhasil disimpan akan muncul di sini.
            </Text>
          </View>
        ) : (
          records.map(record => {
            const statusColor =
              getStatusColor(record);

            return (
              <View
                key={record.id}
                style={[
                  styles.recordCard,
                  {
                    borderLeftColor: statusColor,
                  },
                ]}
              >
                <View style={styles.recordHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recordDate}>
                      {formatDate(
                        record.attendanceDate,
                      )}
                    </Text>

                    <View style={styles.statusRow}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              statusColor,
                          },
                        ]}
                      />

                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              statusColor,
                          },
                        ]}
                      >
                        {getStatusText(record)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>
                      {getDuration(
                        record.clockIn,
                        record.clockOut,
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.timeBox}>
                  <View style={styles.timeCol}>
                    <Text style={styles.timeLabel}>
                      Masuk
                    </Text>

                    <Text
                      style={[
                        styles.timeValue,
                        record.status ===
                          'TERLAMBAT' && {
                          color: '#ea580c',
                        },
                      ]}
                    >
                      {formatTime(
                        record.clockIn,
                      )}
                    </Text>
                  </View>

                  <Feather
                    name="arrow-right"
                    size={16}
                    color="#9ca3af"
                  />

                  <View style={styles.timeColRight}>
                    <Text style={styles.timeLabel}>
                      Keluar
                    </Text>

                    <Text style={styles.timeValue}>
                      {formatTime(
                        record.clockOut,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },

  summaryContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  summaryIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },

  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  summaryUnit: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '500',
  },

  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  dateRange: {
    fontSize: 12,
    color: '#0b8fac',
    fontWeight: '500',
    marginBottom: 12,
  },

  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  recordDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  durationBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  durationText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },

  timeCol: {
    alignItems: 'flex-start',
  },

  timeColRight: {
    alignItems: 'flex-end',
  },

  timeLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },

  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  centerBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },

  infoText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
  },

  emptyBox: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  retryBtn: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#7bc1b7',
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
