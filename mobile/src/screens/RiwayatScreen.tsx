import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedStaffIcon from '../components/MedStaffIcon';
import { getAttendanceHistory } from '../api/api';

interface AttendanceRecord {
  id?: string;
  employeeId?: string;
  attendanceDate?: string;
  clockIn?: string | null;
  clockOut?: string | null;
  status?: string | null;
}

function formatDate(value?: string | null): string {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  const days = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(value?: string | null): string {
  if (!value) return '--:--';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '--:--';

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function calculateDuration(
  clockIn?: string | null,
  clockOut?: string | null,
): string {
  if (!clockIn || !clockOut) {
    return '-';
  }

  const start = new Date(clockIn).getTime();
  const end = new Date(clockOut).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return '-';
  }

  const totalMinutes = Math.floor((end - start) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function getStatus(record: AttendanceRecord): string {
  const status = String(record.status || '').toUpperCase();

  if (status === 'TERLAMBAT') {
    return 'Terlambat';
  }

  if (status === 'IZIN') {
    return 'Izin';
  }

  return 'Tepat Waktu';
}

function getStatusColor(record: AttendanceRecord): string {
  const status = String(record.status || '').toUpperCase();

  if (status === 'TERLAMBAT') {
    return '#f97316';
  }

  if (status === 'IZIN') {
    return '#ef4444';
  }

  return '#10b981';
}

function getStatusTextColor(record: AttendanceRecord): string {
  const status = String(record.status || '').toUpperCase();

  if (status === 'TERLAMBAT') {
    return '#c2410c';
  }

  if (status === 'IZIN') {
    return '#b91c1c';
  }

  return '#059669';
}

export default function RiwayatScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const loadHistory = useCallback(async () => {
    try {
      setErrorMessage('');

      const result = await getAttendanceHistory();

      const data = Array.isArray(result?.data)
        ? result.data
        : [];

      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(
          a.attendanceDate || 0,
        ).getTime();

        const dateB = new Date(
          b.attendanceDate || 0,
        ).getTime();

        return dateB - dateA;
      });

      setRecords(sorted);
      setVisibleCount(10);
    } catch (error: any) {
      console.error(
        'Gagal mengambil riwayat absensi:',
        error,
      );

      setErrorMessage(
        error?.message ||
          'Gagal mengambil riwayat absensi.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
  }, [loadHistory]);

  const summary = useMemo(() => {
    let hadir = 0;
    let terlambat = 0;

    records.forEach((record) => {
      const status = String(
        record.status || '',
      ).toUpperCase();

      if (status === 'TERLAMBAT') {
        terlambat += 1;
      } else if (status === 'HADIR') {
        hadir += 1;
      }
    });

    return {
      hadir,
      terlambat,
    };
  }, [records]);

  const visibleRecords = useMemo(() => {
    return records.slice(0, visibleCount);
  }, [records, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((current) => current + 10);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
         <MedStaffIcon
  name="history"
  size={30}
  color="#f97316"
/>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Riwayat Absensi
        </Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleRefresh}
        >
          <MedStaffIcon
            name="calendar"
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
            onRefresh={handleRefresh}
          />
        }
      >
        {/* SUMMARY */}
        <Text style={styles.sectionTitle}>
          Ringkasan Bulan Ini
        </Text>

        <View style={styles.summaryContainer}>
          {/* HADIR */}
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconBg,
                {
                  backgroundColor: '#d1fae5',
                },
              ]}
            >
              <MedStaffIcon
                name="success"
                size={18}
                color="#059669"
              />
            </View>

            <Text style={styles.summaryLabel}>
              Hadir
            </Text>

            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryValue}>
                {summary.hadir}
              </Text>

              <Text style={styles.summaryUnit}>
                hr
              </Text>
            </View>
          </View>

          {/* TERLAMBAT */}
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconBg,
                {
                  backgroundColor: '#ffedd5',
                },
              ]}
            >
              <MedStaffIcon
                name="history"
                size={18}
                color="#ea580c"
              />
            </View>

            <Text style={styles.summaryLabel}>
              Terlambat
            </Text>

            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryValue}>
                {summary.terlambat}
              </Text>

              <Text style={styles.summaryUnit}>
                hr
              </Text>
            </View>
          </View>
        </View>

        {/* TITLE */}
        <View style={styles.groupHeader}>
          <Text style={styles.sectionTitle}>
            Riwayat Absensi
          </Text>

          <Text style={styles.recordCount}>
            {records.length} data
          </Text>
        </View>

        {/* LOADING */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color="#0b8fac"
            />

            <Text style={styles.loadingText}>
              Memuat riwayat absensi...
            </Text>
          </View>
        )}

        {/* ERROR */}
        {!loading && errorMessage !== '' && (
          <View style={styles.messageCard}>
            <MedStaffIcon
              name="warning"
              size={30}
              color="#f97316"
            />

            <Text style={styles.messageTitle}>
              Gagal memuat riwayat
            </Text>

            <Text style={styles.messageText}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryText}>
                Coba Lagi
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* EMPTY */}
        {!loading &&
          errorMessage === '' &&
          visibleRecords.length === 0 && (
            <View style={styles.messageCard}>
              <MedStaffIcon
                name="history"
                size={32}
                color="#94a3b8"
              />

              <Text style={styles.messageTitle}>
                Belum ada riwayat
              </Text>

              <Text style={styles.messageText}>
                Data absensi Anda akan muncul di sini
                setelah melakukan Clock In.
              </Text>
            </View>
          )}

        {/* RECORDS */}
        {!loading &&
          errorMessage === '' &&
          visibleRecords.map((record, index) => {
            const statusColor =
              getStatusColor(record);

            const statusTextColor =
              getStatusTextColor(record);

            const status =
              getStatus(record);

            const isIzin =
              String(
                record.status || '',
              ).toUpperCase() === 'IZIN';

            return (
              <View
                key={
                  record.id ||
                  `${record.attendanceDate}-${index}`
                }
                style={[
                  styles.recordCard,
                  {
                    borderLeftColor: statusColor,
                  },
                ]}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.recordMain}>
                    <Text
                      style={styles.recordDate}
                      numberOfLines={1}
                    >
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
                              statusTextColor,
                          },
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>

                  {!isIzin &&
                    record.clockIn &&
                    record.clockOut && (
                      <View
                        style={
                          styles.durationBadge
                        }
                      >
                        <Text
                          style={
                            styles.durationText
                          }
                        >
                          {calculateDuration(
                            record.clockIn,
                            record.clockOut,
                          )}
                        </Text>
                      </View>
                    )}
                </View>

                {!isIzin && (
                  <View style={styles.timeBox}>
                    <View
                      style={styles.timeCol}
                    >
                      <Text
                        style={styles.timeLabel}
                      >
                        Masuk
                      </Text>

                      <Text
                        style={styles.timeValue}
                      >
                        {formatTime(
                          record.clockIn,
                        )}
                      </Text>
                    </View>

                    <MedStaffIcon
                      name="arrow-right"
                      size={16}
                      color="#9ca3af"
                    />

                    <View
                      style={
                        styles.timeColRight
                      }
                    >
                      <Text
                        style={styles.timeLabel}
                      >
                        Keluar
                      </Text>

                      <Text
                        style={styles.timeValue}
                      >
                        {formatTime(
                          record.clockOut,
                        )}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}

        {/* LOAD MORE */}
        {!loading &&
          errorMessage === '' &&
          visibleRecords.length > 0 &&
          visibleCount < records.length && (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={handleLoadMore}
            >
              <Text
                style={styles.loadMoreText}
              >
                Muat Lebih Banyak
              </Text>

              <MedStaffIcon
                name="chevron-down"
                size={16}
                color="#0b8fac"
                style={{
                  marginLeft: 6,
                }}
              />
            </TouchableOpacity>
          )}

        {/* ALL DATA LOADED */}
        {!loading &&
          errorMessage === '' &&
          records.length > 0 &&
          visibleCount >= records.length && (
            <Text style={styles.endText}>
              Semua riwayat sudah ditampilkan
            </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    paddingBottom: 50,
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
    marginBottom: 28,
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
    marginBottom: 4,
  },

  recordCount: {
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

  recordMain: {
    flex: 1,
    paddingRight: 10,
  },

  recordDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
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

  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
  },

  messageCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    marginBottom: 20,
  },

  messageTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 6,
  },

  messageText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: '#0b8fac',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },

  retryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbcabf',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 4,
  },

  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0b8fac',
  },

  endText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 12,
    marginBottom: 10,
  },
});