import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import {
  getMyProfile,
  updateMyProfile,
  getTodaySchedule,
  EmployeeProfile,
} from '../../api/api';

const InfoRow = ({
  label,
  value,
  isEditing,
  isEditable = true,
  onChangeText,
}: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>

    {isEditing && isEditable ? (
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={onChangeText}
      />
    ) : (
      <Text
        style={[
          styles.infoValue,
          !isEditable &&
            isEditing &&
            styles.readOnlyField,
        ]}
      >
        {value || '-'}
      </Text>
    )}
  </View>
);

const formatBirthDate = (value: string | null | undefined) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function WorkInformationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] =
    useState<EmployeeProfile | null>(null);

  const [workSchedule, setWorkSchedule] =
    useState('Not scheduled');

  const [position, setPosition] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);

      const [profileResponse, scheduleResponse] =
        await Promise.all([
          getMyProfile(),
          getTodaySchedule(),
        ]);

      const profileData = profileResponse?.data ?? null;

      setProfile(profileData);
      setPosition(profileData?.position ?? '');

      const schedule = scheduleResponse?.data ?? null;

      if (schedule?.shift) {
        const shift = schedule.shift;

        setWorkSchedule(
          `${shift.name} (${shift.startTime} — ${shift.endTime})`,
        );
      } else {
        setWorkSchedule('Not scheduled');
      }
    } catch (error) {
      console.error(
        'Gagal mengambil informasi pekerjaan:',
        error,
      );

      Alert.alert(
        'Error',
        'Gagal mengambil informasi pekerjaan.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!profile) {
      return;
    }

    if (!position.trim()) {
      Alert.alert(
        'Validasi',
        'Position tidak boleh kosong.',
      );
      return;
    }

    try {
      setSaving(true);

      const response = await updateMyProfile({
        position: position.trim(),
      });

      const updatedProfile =
        response?.data ?? {
          ...profile,
          position: position.trim(),
        };

      setProfile(updatedProfile);
      setPosition(updatedProfile.position ?? '');
      setIsEditing(false);

      Alert.alert(
        'Berhasil',
        'Informasi pekerjaan berhasil diperbarui.',
      );
    } catch (error: any) {
      console.error(
        'Gagal memperbarui informasi pekerjaan:',
        error,
      );

      Alert.alert(
        'Gagal',
        error?.message ??
          'Gagal memperbarui informasi pekerjaan.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPosition(profile?.position ?? '');
    setIsEditing(false);
  };

  const employeeId = profile?.employeeId ?? '-';
  const company = profile?.companyName ?? '-';

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather
            name="arrow-left"
            size={24}
            color="#1F2937"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Work Information
        </Text>

        {!isEditing ? (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            disabled={loading || !profile}
          >
            <Text
              style={[
                styles.editHeaderText,
                (!profile || loading) &&
                  styles.disabledText,
              ]}
            >
              Edit
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#0B8FAC"
            />

            <Text style={styles.loadingText}>
              Loading work information...
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.scrollContent
            }
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Employment Information
              </Text>

              <View style={styles.card}>
                <InfoRow
                  label="Employee ID"
                  value={employeeId}
                  isEditing={isEditing}
                  isEditable={false}
                />

                <View style={styles.divider} />

                <InfoRow
                  label="Position"
                  value={position}
                  isEditing={isEditing}
                  isEditable={true}
                  onChangeText={setPosition}
                />

                <View style={styles.divider} />

                <InfoRow
                  label="Department"
                  value="-"
                  isEditing={isEditing}
                  isEditable={false}
                />

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Employment Status
                  </Text>

                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>
                      Not available
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <InfoRow
                  label="Join Date"
                  value="-"
                  isEditing={isEditing}
                  isEditable={false}
                />

                <View style={styles.divider} />

                <InfoRow
                  label="Clinic"
                  value={company}
                  isEditing={isEditing}
                  isEditable={false}
                />

                <View style={styles.divider} />

                <InfoRow
                  label="Work Location"
                  value={company}
                  isEditing={isEditing}
                  isEditable={false}
                />

                <View style={styles.divider} />

                <InfoRow
                  label="Work Schedule"
                  value={workSchedule}
                  isEditing={isEditing}
                  isEditable={false}
                />
              </View>
            </View>
          </ScrollView>
        )}

        {isEditing && (
          <View
            style={[
              styles.footer,
              {
                paddingBottom:
                  insets.bottom + 16,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.saveButton,
                saving && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  editHeaderText: {
    fontSize: 16,
    color: '#0B8FAC',
    fontWeight: '600',
  },

  disabledText: {
    color: '#9CA3AF',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },

      android: {
        elevation: 2,
      },
    }),
  },

  infoRow: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },

  readOnlyField: {
    color: '#9CA3AF',
  },

  infoInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B8FAC',
    flex: 2,
    textAlign: 'right',
    padding: 0,
  },

  statusPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  saveButton: {
    backgroundColor: '#7BC1B7',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
