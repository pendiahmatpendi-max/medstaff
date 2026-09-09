import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const PINInput = ({ label, placeholder, value, onChangeText, error }: any) => {
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
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default function PINScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [currentPIN, setCurrentPIN] = useState('');
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');
  
  const [errors, setErrors] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!currentPIN) newErrors.current = 'Current PIN is required';
    else if (currentPIN.length !== 6) newErrors.current = 'PIN must be 6 digits';

    if (!newPIN) newErrors.new = 'New PIN is required';
    else if (newPIN.length !== 6) newErrors.new = 'PIN must be 6 digits';
    
    if (!confirmPIN) newErrors.confirm = 'Please confirm your new PIN';
    else if (newPIN !== confirmPIN) newErrors.confirm = 'PINs do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePIN = () => {
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
        <Text style={styles.headerTitle}>PIN</Text>
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
              <Text style={styles.successText}>PIN changed successfully</Text>
            </View>
          ) : (
            <View style={styles.formCard}>
              <PINInput
                label="Current PIN"
                placeholder="Enter 6-digit current PIN"
                value={currentPIN}
                onChangeText={setCurrentPIN}
                error={errors.current}
              />
              <PINInput
                label="New PIN"
                placeholder="Enter 6-digit new PIN"
                value={newPIN}
                onChangeText={setNewPIN}
                error={errors.new}
              />
              <PINInput
                label="Confirm New PIN"
                placeholder="Re-enter 6-digit new PIN"
                value={confirmPIN}
                onChangeText={setConfirmPIN}
                error={errors.confirm}
              />
            </View>
          )}
        </ScrollView>

        {!isSuccess && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity style={styles.submitButton} onPress={handleChangePIN}>
              <Text style={styles.submitButtonText}>Change PIN</Text>
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
  input: { flex: 1, fontSize: 15, color: '#1F2937', letterSpacing: 4 },
  inputError: { borderColor: '#EF4444' },
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
