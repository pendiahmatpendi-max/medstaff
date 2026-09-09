import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const InfoRow = ({ label, value, isEditing, isEditable = true, onChangeText }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isEditing && isEditable ? (
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={onChangeText}
      />
    ) : (
      <Text style={[styles.infoValue, !isEditable && isEditing && styles.readOnlyField]}>
        {value}
      </Text>
    )}
  </View>
);

export default function WorkInformationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const [workInfo, setWorkInfo] = useState({
    employeeId: 'MS-0001',
    position: 'General Practitioner',
    department: 'Medical',
    employmentStatus: 'Active',
    joinDate: '01 January 2025',
    clinic: 'Klinik Pratama UNIMUS',
    workLocation: 'Klinik Pratama UNIMUS',
    workSchedule: 'According to assigned shift'
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Information</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editHeaderText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment Information</Text>
            <View style={styles.card}>
              <InfoRow
                label="Employee ID"
                value={workInfo.employeeId}
                isEditing={isEditing}
                isEditable={false}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Position"
                value={workInfo.position}
                isEditing={isEditing}
                isEditable={true}
                onChangeText={(text: string) => setWorkInfo({ ...workInfo, position: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Department"
                value={workInfo.department}
                isEditing={isEditing}
                isEditable={true}
                onChangeText={(text: string) => setWorkInfo({ ...workInfo, department: text })}
              />
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employment Status</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{workInfo.employmentStatus}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <InfoRow
                label="Join Date"
                value={workInfo.joinDate}
                isEditing={isEditing}
                isEditable={false}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Clinic"
                value={workInfo.clinic}
                isEditing={isEditing}
                isEditable={true}
                onChangeText={(text: string) => setWorkInfo({ ...workInfo, clinic: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Work Location"
                value={workInfo.workLocation}
                isEditing={isEditing}
                isEditable={true}
                onChangeText={(text: string) => setWorkInfo({ ...workInfo, workLocation: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Work Schedule"
                value={workInfo.workSchedule}
                isEditing={isEditing}
                isEditable={true}
                onChangeText={(text: string) => setWorkInfo({ ...workInfo, workSchedule: text })}
              />
            </View>
          </View>
        </ScrollView>

        {isEditing && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF'
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  editHeaderText: { fontSize: 16, color: '#0B8FAC', fontWeight: '600' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }) },
  infoRow: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 14, color: '#6B7280', flex: 1 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1F2937', flex: 2, textAlign: 'right' },
  readOnlyField: { color: '#9CA3AF' },
  infoInput: { fontSize: 14, fontWeight: '600', color: '#0B8FAC', flex: 2, textAlign: 'right', padding: 0 },
  statusPill: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 13, fontWeight: '600', color: '#059669' },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveButton: { backgroundColor: '#7BC1B7', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelButton: { height: 56, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '600' }
});
