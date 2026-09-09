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

const InfoRow = ({ label, value, isEditing, onChangeText }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={onChangeText}
      />
    ) : (
      <Text style={styles.infoValue}>{value}</Text>
    )}
  </View>
);

export default function EducationExperienceScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const [education, setEducation] = useState({
    degree: 'Doctor of Medicine',
    institution: 'Universitas Muhammadiyah Semarang',
    field: 'Medicine',
    year: '2024'
  });

  const [experience, setExperience] = useState({
    title: 'General Practitioner',
    company: 'Klinik Pratama UNIMUS',
    period: '2025 — Present',
    responsibilities: 'Patient examination, diagnosis, treatment, and clinical care.'
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
        <Text style={styles.headerTitle}>Education & Experience</Text>
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
          
          {/* SECTION 1 - EDUCATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.card}>
              <InfoRow
                label="Degree"
                value={education.degree}
                isEditing={isEditing}
                onChangeText={(text: string) => setEducation({ ...education, degree: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Institution"
                value={education.institution}
                isEditing={isEditing}
                onChangeText={(text: string) => setEducation({ ...education, institution: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Field of Study"
                value={education.field}
                isEditing={isEditing}
                onChangeText={(text: string) => setEducation({ ...education, field: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Graduation Year"
                value={education.year}
                isEditing={isEditing}
                onChangeText={(text: string) => setEducation({ ...education, year: text })}
              />
            </View>
          </View>

          {/* SECTION 2 - WORK EXPERIENCE */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.card}>
              <InfoRow
                label="Position"
                value={experience.title}
                isEditing={isEditing}
                onChangeText={(text: string) => setExperience({ ...experience, title: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Organization"
                value={experience.company}
                isEditing={isEditing}
                onChangeText={(text: string) => setExperience({ ...experience, company: text })}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Period"
                value={experience.period}
                isEditing={isEditing}
                onChangeText={(text: string) => setExperience({ ...experience, period: text })}
              />
              <View style={styles.divider} />
              <View style={[styles.infoRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={[styles.infoLabel, { marginBottom: 6 }]}>Responsibilities</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.infoInput, styles.textAreaInput]}
                    value={experience.responsibilities}
                    onChangeText={(text: string) => setExperience({ ...experience, responsibilities: text })}
                    multiline
                  />
                ) : (
                  <Text style={styles.responsibilitiesText}>{experience.responsibilities}</Text>
                )}
              </View>
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
  infoInput: { fontSize: 14, fontWeight: '600', color: '#0B8FAC', flex: 2, textAlign: 'right', padding: 0 },
  textAreaInput: { width: '100%', textAlign: 'left', minHeight: 60 },
  responsibilitiesText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveButton: { backgroundColor: '#7BC1B7', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelButton: { height: 56, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '600' }
});
