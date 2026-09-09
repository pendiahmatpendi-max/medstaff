import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const PasswordInput = ({ label, placeholder, value, onChangeText, error }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!currentPassword) newErrors.current = 'Current password is required';
    if (!newPassword) newErrors.new = 'New password is required';
    else if (newPassword.length < 8) newErrors.new = 'Password must be at least 8 characters';
    
    if (!confirmPassword) newErrors.confirm = 'Please confirm your new password';
    else if (newPassword !== confirmPassword) newErrors.confirm = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = () => {
    if (validate()) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigation.goBack();
      }, 2000);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {isSuccess ? (
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <Feather name="check" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.successText}>Password changed successfully</Text>
            </View>
          ) : (
            <View style={styles.formCard}>
              <PasswordInput
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                error={errors.current}
              />
              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                error={errors.new}
              />
              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirm}
              />
            </View>
          )}
        </ScrollView>

        {!isSuccess && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
              <Text style={styles.submitButtonText}>Change Password</Text>
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
  scrollContent: { padding: 20 },
  formCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 20,
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 } 
    })
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56
  },
  input: { flex: 1, fontSize: 15, color: '#1F2937' },
  inputError: { borderColor: '#EF4444' },
  eyeIcon: { padding: 4 },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 },
  footer: { padding: 20 },
  submitButton: { 
    backgroundColor: '#7BC1B7', 
    borderRadius: 16, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#7BC1B7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 }
    })
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  successCard: { 
    backgroundColor: '#ECFDF5', 
    borderRadius: 24, 
    padding: 32, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  successIconCircle: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#10B981', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 16
  },
  successText: { color: '#065F46', fontSize: 16, fontWeight: '700', textAlign: 'center' }
});
