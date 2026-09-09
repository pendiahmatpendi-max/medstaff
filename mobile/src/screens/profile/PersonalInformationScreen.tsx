import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyProfile, EmployeeProfile } from '../../api/api';

export default function PersonalInformationScreen() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMyProfile();
      const data = response?.data ?? response;

      setProfile(data);
    } catch (error) {
      console.error('Gagal mengambil personal information:', error);
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
      <Text style={styles.title}>Personal Information</Text>

      <View style={styles.card}>
        <Info label="Full Name" value={profile?.fullName} />
        <Info label="Employee ID" value={profile?.employeeId} />
        <Info label="Phone" value={profile?.phone} />
        <Info label="Birth Place" value={profile?.birthPlace} />
        <Info label="Birth Date" value={profile?.birthDate} />
        <Info label="Gender" value={profile?.gender} />
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

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C1C',
    marginBottom: 20,
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
