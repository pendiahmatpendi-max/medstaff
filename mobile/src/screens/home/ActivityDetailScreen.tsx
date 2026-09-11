import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { attendActivity, getActivities } from '../../api/api';

export default function ActivityDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const activityId = route.params?.id;

  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [attended, setAttended] = useState(false);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const result = await getActivities();

      const list = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

      const found = list.find(
        (item: any) => String(item.id) === String(activityId),
      );

      if (!found) {
        throw new Error('Kegiatan tidak ditemukan.');
      }

      setActivity(found);
    } catch (error: any) {
      Alert.alert(
        'Gagal',
        error?.message || 'Gagal mengambil data kegiatan.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async () => {
    if (!activity?.id || attending || attended) return;

    setAttending(true);

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Lokasi diperlukan',
          'Izinkan akses lokasi untuk melakukan absensi kegiatan.',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const result = await attendActivity(activity.id, {
        latitude,
        longitude,
      });

      if (!result?.success) {
        throw new Error(
          result?.message || 'Gagal melakukan absensi kegiatan.',
        );
      }

      setAttended(true);

      Alert.alert(
        'Berhasil',
        result?.message || 'Absensi kegiatan berhasil.',
      );
    } catch (error: any) {
      Alert.alert(
        'Gagal Absen',
        error?.message || 'Absensi kegiatan gagal.',
      );
    } finally {
      setAttending(false);
    }
  };

  const formatDate = (value: any) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (value: any) => {
    if (!value) return '-';
    return String(value).slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0B8FAC" />
        <Text style={styles.loadingText}>Memuat kegiatan...</Text>
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.center}>
        <Feather name="calendar" size={42} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Kegiatan tidak ditemukan</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Detail Kegiatan</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather name="calendar" size={30} color="#0B8FAC" />
          </View>

          <Text style={styles.title}>
            {activity.title || activity.name || 'Kegiatan'}
          </Text>

          <View
            style={[
              styles.status,
              attended && styles.statusSuccess,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                attended && styles.statusTextSuccess,
              ]}
            >
              {attended ? 'Sudah Absen' : 'Belum Absen'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <InfoRow
            icon="calendar"
            label="Tanggal"
            value={formatDate(activity.activityDate || activity.date)}
          />

          <InfoRow
            icon="clock"
            label="Waktu"
            value={
              activity.startTime
                ? `${formatTime(activity.startTime)}${
                    activity.endTime
                      ? ` - ${formatTime(activity.endTime)}`
                      : ''
                  }`
                : activity.time || '-'
            }
          />

          <InfoRow
            icon="map-pin"
            label="Lokasi"
            value={activity.place || activity.location || 'Kegiatan Klinik'}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>

          <Text style={styles.description}>
            {activity.description || 'Tidak ada deskripsi kegiatan.'}
          </Text>
        </View>

        <View style={styles.locationNotice}>
          <Feather name="map-pin" size={20} color="#0B8FAC" />

          <View style={styles.locationTextWrap}>
            <Text style={styles.locationTitle}>
              Verifikasi lokasi
            </Text>

            <Text style={styles.locationDescription}>
              Lokasi perangkat akan dicatat saat melakukan absensi
              kegiatan.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.attendButton,
            (attending || attended) && styles.attendButtonDisabled,
          ]}
          onPress={handleAttend}
          disabled={attending || attended}
          activeOpacity={0.85}
        >
          {attending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather
                name={attended ? 'check-circle' : 'check'}
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.attendButtonText}>
                {attended ? 'Sudah Absen' : 'Absen Kegiatan'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Feather name={icon} size={18} color="#0B8FAC" />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  headerSpacer: {
    width: 42,
  },

  hero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },

  status: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
  },

  statusSuccess: {
    backgroundColor: '#ECFDF5',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },

  statusTextSuccess: {
    color: '#059669',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  infoRowLast: {
    marginBottom: 0,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
  },

  locationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F7F5',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  locationTextWrap: {
    flex: 1,
    marginLeft: 12,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B8FAC',
  },

  locationDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },

  attendButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0B8FAC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  attendButtonDisabled: {
    opacity: 0.65,
  },

  attendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0B8FAC',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

