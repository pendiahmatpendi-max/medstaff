import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Other Leave'];

export default function LeaveRequestScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Form State
  const [leaveType, setLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState<string>('');

  // UI State
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const isIOS = Platform.OS === 'ios';
    if (!isIOS) setShowPicker(null); // Hide picker on Android after selection
    
    if (selectedDate) {
      if (showPicker === 'start') setStartDate(selectedDate);
      if (showPicker === 'end') setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'DD / MM / YYYY';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      alert('Please fill all fields');
      return;
    }

    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const leaveData = {
      type: leaveType,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      duration: `${duration} Day${duration > 1 ? 's' : ''}`,
      reason: reason,
      status: 'pending',
    };

    navigation.navigate('LeaveDetail', { leaveData });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Request</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Leave Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Leave Type</Text>
              <TouchableOpacity 
                style={styles.selectBox} 
                activeOpacity={0.7}
                onPress={() => setTypeModalVisible(true)}
              >
                <Text style={[styles.inputText, !leaveType && styles.placeholderText]}>
                  {leaveType || 'Select leave type'}
                </Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Dates (Start & End) */}
            <View style={styles.rowGroup}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity 
                  style={styles.selectBox} 
                  onPress={() => setShowPicker('start')}
                >
                  <Text style={[styles.inputText, !startDate && styles.placeholderText]}>
                    {formatDate(startDate)}
                  </Text>
                  <Feather name="calendar" size={18} color="#7BC1B7" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity 
                  style={styles.selectBox} 
                  onPress={() => setShowPicker('end')}
                >
                  <Text style={[styles.inputText, !endDate && styles.placeholderText]}>
                    {formatDate(endDate)}
                  </Text>
                  <Feather name="calendar" size={18} color="#7BC1B7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reason */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write your reason..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
            </View>

            {/* Attachment */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Attachment</Text>
              <TouchableOpacity style={styles.attachmentButton} activeOpacity={0.7}>
                <Feather name="plus" size={18} color="#0B8FAC" />
                <Text style={styles.attachmentText}>Add Attachment</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>SUBMIT LEAVE REQUEST</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Real Date Picker (Modal for iOS, Dialog for Android) */}
      {showPicker && (
        <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity onPress={() => setShowPicker(null)}>
                <Text style={styles.iosPickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={(showPicker === 'start' ? startDate : endDate) || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            textColor="#1F2937"
          />
        </View>
      )}

      {/* Leave Type Selection Modal */}
      <Modal visible={isTypeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setTypeModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />
            <Text style={styles.modalTitle}>Select Leave Type</Text>
            {LEAVE_TYPES.map((type, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.modalOption}
                onPress={() => {
                  setLeaveType(type);
                  setTypeModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, leaveType === type && styles.modalOptionActive]}>
                  {type}
                </Text>
                {leaveType === type && <Feather name="check" size={20} color="#7BC1B7" />}
              </TouchableOpacity>
            ))}
            <View style={{ height: insets.bottom + 20 }} />
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 }, android: { elevation: 2 }}) },
  inputGroup: { marginBottom: 20 },
  rowGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  
  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 52 },
  inputText: { fontSize: 15, color: '#1F2937' },
  placeholderText: { color: '#9CA3AF' },
  
  textAreaContainer: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 100 },
  textArea: { flex: 1, fontSize: 15, color: '#1F2937', lineHeight: 22 },
  
  attachmentButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9F8', borderWidth: 1, borderStyle: 'dashed', borderColor: '#7BC1B7', borderRadius: 12, height: 52, gap: 8 },
  attachmentText: { fontSize: 14, fontWeight: '600', color: '#0B8FAC' },

  bottomContainer: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#F9F9F9' },
  submitButton: { backgroundColor: '#7BC1B7', borderRadius: 14, height: 56, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#7BC1B7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 }}) },
  submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 12 },
  modalDragIndicator: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalOptionText: { fontSize: 16, color: '#4B5563' },
  modalOptionActive: { color: '#7BC1B7', fontWeight: 'bold' },

  // iOS Date Picker Styles
  iosPickerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', zIndex: 10 },
  iosPickerHeader: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, backgroundColor: '#F9FAFB', borderTopWidth: 1, borderColor: '#E5E7EB' },
  iosPickerDone: { color: '#0B8FAC', fontWeight: 'bold', fontSize: 16 }
});