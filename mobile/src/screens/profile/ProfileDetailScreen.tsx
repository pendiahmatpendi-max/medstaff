import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export default function ProfileDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Local State
  const [fullName, setFullName] = useState('dr. Winter Aespa');
  const [jobTitle, setJobTitle] = useState('Dokter Umum');
  const [photo, setPhoto] = useState<string | null>('https://i.pravatar.cc/300'); // Mock initial photo

  const handlePhotoPress = () => {
    // Native Action Sheet behavior via Alert for simplicity without adding new dependencies
    Alert.alert(
      'Profile Photo',
      'Choose an action for your profile picture',
      [
        { 
          text: 'Change Photo', 
          onPress: () => setPhoto('https://i.pravatar.cc/301') // Mock new photo 
        },
        { 
          text: 'Remove Photo', 
          onPress: () => setPhoto(null),
          style: 'destructive' 
        },
        { 
          text: 'Cancel', 
          style: 'cancel' 
        }
      ]
    );
  };

  const handleSave = () => {
    // Mock save & success feedback
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const isFormValid = fullName.trim().length > 0 && jobTitle.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* PROFILE PHOTO */}
          <View style={styles.photoSection}>
            <TouchableOpacity activeOpacity={0.8} onPress={handlePhotoPress}>
              <View style={styles.avatarContainer}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Feather name="user" size={40} color="#9CA3AF" />
                  </View>
                )}
                <View style={styles.editBadge}>
                  <Feather name="camera" size={14} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* FORM: FULL NAME */}
          <View style={[styles.formSection, { marginBottom: 12 }]}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* FORM: JOB TITLE */}
          <View style={[styles.formSection, { marginBottom: 12 }]}>
            <Text style={styles.label}>Job Title</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={jobTitle}
                onChangeText={setJobTitle}
                placeholder="Enter your job title"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

        </ScrollView>

        {/* SAVE BUTTON */}
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity 
            style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]} 
            activeOpacity={0.8}
            disabled={!isFormValid}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  // Photo Section
  photoSection: { alignItems: 'center', marginBottom: 40 },
  avatarContainer: { position: 'relative', width: 110, height: 110 },
  avatarImage: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E5E7EB' },
  avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#0B8FAC', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#F9F9F9' },

  // Form
  formSection: { marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  inputContainer: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16, height: 56, justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 1 }}) },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1F2937' },

  // Bottom Save Button
  bottomContainer: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#F9F9F9' },
  saveButton: { backgroundColor: '#7BC1B7', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#7BC1B7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 }}) },
  saveButtonDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0, elevation: 0 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});