import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdjustmentScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Form State
  const [adjustmentType, setAdjustmentType] = useState('Forgot Clock In');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  // Date State
  const [date, setDate] = useState(new Date(2026, 8, 8)); // 08 September 2026
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time In State
  const [clockIn, setClockIn] = useState('08:00 AM');
  const [showTimeInPicker, setShowTimeInPicker] = useState(false);

  // Time Out State
  const [clockOut, setClockOut] = useState('05:00 PM');
  const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);

  // Reason State
  const [reason, setReason] = useState('');

  // Validation / Error State
  const [touched, setTouched] = useState(false);

  const adjustmentTypes = [
    'Forgot Clock In',
    'Forgot Clock Out',
    'Missing Schedule',
    'Incorrect Attendance',
    'Other'
  ];

  const formatDateDisplay = (d: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('en-GB', options);
  };

  // Conditional Validation Checks
  const isClockInRequired = adjustmentType === 'Forgot Clock In' || adjustmentType === 'Incorrect Attendance';
  const isClockOutRequired = adjustmentType === 'Forgot Clock Out' || adjustmentType === 'Incorrect Attendance';

  const isReasonValid = reason.trim().length > 0;
  const isTypeValid = adjustmentType.trim().length > 0;

  const handleSubmit = () => {
    setTouched(true);

    if (!isTypeValid || !isReasonValid) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (isClockInRequired && !clockIn.trim()) {
      Alert.alert('Error', 'Clock In time is required for this adjustment type.');
      return;
    }

    if (isClockOutRequired && !clockOut.trim()) {
      Alert.alert('Error', 'Clock Out time is required for this adjustment type.');
      return;
    }

    // Success feedback and return
    Alert.alert('Success', 'Adjustment submitted successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adjustment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* TITLE & DESCRIPTION */}
        <View style={styles.titleSection}>
          <Text style={styles.screenHeading}>Attendance Adjustment</Text>
          <Text style={styles.screenSubheading}>Submit a correction if your attendance record is missing or incorrect.</Text>
        </View>

        {/* ADJUSTMENT TYPE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Adjustment Type <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TouchableOpacity 
            style={styles.dropdownSelector} 
            activeOpacity={0.8}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            <Text style={styles.dropdownSelectedText}>{adjustmentType}</Text>
            <Feather name={showTypeDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
          </TouchableOpacity>

          {showTypeDropdown && (
            <View style={styles.dropdownList}>
              {adjustmentTypes.map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={[styles.dropdownItem, adjustmentType === item && styles.dropdownItemSelected]}
                  onPress={() => {
                    setAdjustmentType(item);
                    setShowTypeDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, adjustmentType === item && styles.dropdownItemTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* DATE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TouchableOpacity 
            style={styles.inputContainer} 
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{formatDateDisplay(date)}</Text>
            <Feather name="calendar" size={18} color="#0B8FAC" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* CLOCK IN */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Clock In {isClockInRequired && <Text style={styles.requiredAsterisk}>*</Text>}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={clockIn}
              onChangeText={setClockIn}
              placeholder="08:00 AM"
              placeholderTextColor="#9CA3AF"
            />
            <Feather name="clock" size={18} color="#9CA3AF" />
          </View>
        </View>

        {/* CLOCK OUT */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Clock Out {isClockOutRequired && <Text style={styles.requiredAsterisk}>*</Text>}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={clockOut}
              onChangeText={setClockOut}
              placeholder="05:00 PM"
              placeholderTextColor="#9CA3AF"
            />
            <Feather name="clock" size={18} color="#9CA3AF" />
          </View>
        </View>

        {/* CURRENT ATTENDANCE (READ-ONLY) */}
        <View style={styles.currentAttendanceCard}>
          <Text style={styles.currentAttendanceHeader}>Current Attendance</Text>
          <View style={styles.currentAttendanceRow}>
            <View style={styles.currentAttendanceCol}>
              <Text style={styles.currentAttendanceLabel}>Clock In</Text>
              <Text style={styles.currentAttendanceValue}>—</Text>
            </View>
            <View style={styles.currentAttendanceDivider} />
            <View style={styles.currentAttendanceCol}>
              <Text style={styles.currentAttendanceLabel}>Clock Out</Text>
              <Text style={styles.currentAttendanceValue}>05:02 PM</Text>
            </View>
          </View>
        </View>

        {/* REASON */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Reason <Text style={styles.requiredAsterisk}>*</Text></Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={styles.textArea}
              value={reason}
              onChangeText={setReason}
              placeholder="Write your reason..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          {touched && !isReasonValid && (
            <Text style={styles.errorText}>Reason is required.</Text>
          )}
        </View>

        {/* SUPPORTING DOCUMENT */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Supporting Document</Text>
          <TouchableOpacity style={styles.addDocButton} activeOpacity={0.7}>
            <Feather name="plus" size={16} color="#0B8FAC" />
            <Text style={styles.addDocText}>Add Document</Text>
          </TouchableOpacity>
        </View>

        {/* REQUEST SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeader}>Adjustment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Type</Text>
            <Text style={styles.summaryVal}>{adjustmentType}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Date</Text>
            <Text style={styles.summaryVal}>{formatDateDisplay(date)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Clock In</Text>
            <Text style={styles.summaryVal}>{clockIn || '—'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Clock Out</Text>
            <Text style={styles.summaryVal}>{clockOut || '—'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Reason</Text>
            <Text style={[styles.summaryVal, { flex: 2, textAlign: 'right' }]} numberOfLines={2}>
              {reason || '—'}
            </Text>
          </View>
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity 
          style={styles.submitButton} 
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Adjustment</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  // Title section
  titleSection: { marginBottom: 24 },
  screenHeading: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  screenSubheading: { fontSize: 13, color: '#6B7280', lineHeight: 18 },

  // Form Group
  formGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  requiredAsterisk: { color: '#E11D48' },

  inputContainer: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 56, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4 }, 
      android: { elevation: 1 } 
    }) 
  },
  inputText: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1F2937' },

  // Dropdown
  dropdownSelector: {
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 56, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4 }, 
      android: { elevation: 1 } 
    })
  },
  dropdownSelectedText: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    marginTop: 6,
    overflow: 'hidden',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 }, 
      android: { elevation: 2 } 
    })
  },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemSelected: { backgroundColor: '#F0F9F8' },
  dropdownItemText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  dropdownItemTextSelected: { color: '#0B8FAC', fontWeight: '700' },

  // Current Attendance
  currentAttendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentAttendanceHeader: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 12 },
  currentAttendanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  currentAttendanceCol: { flex: 1, alignItems: 'center' },
  currentAttendanceDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },
  currentAttendanceLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  currentAttendanceValue: { fontSize: 15, fontWeight: '700', color: '#1F2937' },

  // Textarea
  textAreaContainer: { height: 110, paddingVertical: 12, alignItems: 'flex-start' },
  textArea: { flex: 1, fontSize: 15, color: '#1F2937', width: '100%' },
  errorText: { fontSize: 12, color: '#E11D48', marginTop: 4, marginLeft: 4 },

  // Supporting Document
  addDocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9F8',
    borderWidth: 1,
    borderColor: '#7BC1B7',
    borderStyle: 'dashed',
    borderRadius: 14,
    height: 48,
    gap: 8,
  },
  addDocText: { fontSize: 14, fontWeight: '700', color: '#0B8FAC' },

  // Request Summary
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, 
      android: { elevation: 1 } 
    })
  },
  summaryHeader: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  summaryKey: { fontSize: 13, color: '#6B7280', fontWeight: '500', flex: 1 },
  summaryVal: { fontSize: 13, color: '#1F2937', fontWeight: '700', flex: 1.5, textAlign: 'right' },

  // Submit Button
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
});
