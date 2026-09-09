import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyProfile, EmployeeProfile } from '../../api/api';

export default function ProfileDetailScreen() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMyProfile();
      const data = response?.data ?? response;

      setProfile(data);
    } catch (error) {
      console.error('Gagal mengambil profile detail:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0b8fac" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerCard}>
        {profile?.profilePhoto ? (
          <Image
            source={{ uri: profile.profilePhoto }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(profile?.fullName || '?')
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.name}>
          {profile?.fullName || 'Nama belum tersedia'}
        </Text>

        <Text style={styles.position}>
          {profile?.position || 'Posisi belum tersedia'}
        </Text>
      </View>

      <View style={styles.card}>
        <Info label="Employee ID" value={profile?.employeeId} />
        <Info label="Phone" value={profile?.phone} />
        <Info label="Email" value={undefined} />
        <Info label="Company" value={profile?.companyName} />
        <Info label="Position" value={profile?.position} />
        <Info label="Gender" value={profile?.gender} />
        <Info label="Birth Place" value={profile?.birthPlace} />
        <Info label="Birth Date" value={profile?.birthDate} />
        <Info
          label="Identity Number"
          value={profile?.identityNumber}
        />
        <Info label="Address" value={profile?.address} />
      </View>
    </ScrollView>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <View style={styles.info}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value || '-'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E2F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0b8fac',
  },

  name: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1A1C1C',
    textAlign: 'center',
  },

  position: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },

  info: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },

  label: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 5,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1C',
  },
});
