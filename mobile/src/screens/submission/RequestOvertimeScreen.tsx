import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RequestOvertimeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Form State
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  
  const [pickerType, setPickerType] = useState<'date' | 'start' | 'end' | null>(null);

  const formatDate = (d?: Date) => {
    if (!d) return 'Select Date';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (d?: Date, placeholder: string = '--:--') => {
    if (!d) return placeholder;
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const strHours = String(hours).padStart(2, '0');
    return `${strHours}:${minutes} ${ampm}`;
  };

  const getDuration = () => {
    if (!startTime || !endTime) return null;
    
    // Calculate difference using only hours and minutes
    const startMins = startTime.getHours() * 60 + startTime.getMinutes();
    const endMins = endTime.getHours() * 60 + endTime.getMinutes();
    const diffMins = endMins - startMins;
    
    if (diffMins <= 0) return 'Invalid duration';
    
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    
    if (h > 0 && m > 0) return `${h} Hours ${m} Minutes`;
    if (h > 0) return `${h} Hours`;
    return `${m} Minutes`;
  };

  const onPickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setPickerType(null); // Hide picker on Android after selection
    }
    if (event.type === 'dismissed') {
      setPickerType(null);
      return;
    }
    if (selectedDate) {
      if (pickerType === 'date') setDate(selectedDate);
      else if (pickerType === 'start') setStartTime(selectedDate);
      else if (pickerType === 'end') setEndTime(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!date) return Alert.alert('Validation Error', 'Please select a date.');
    if (!startTime) return Alert.alert('Validation Error', 'Please select a start time.');
    if (!endTime) return Alert.alert('Validation Error', 'Please select an end time.');
    if (!reason.trim()) return Alert.alert('Validation Error', 'Please enter a reason for overtime.');

    const startMins = startTime.getHours() * 60 + startTime.getMinutes();
    const endMins = endTime.getHours() * 60 + endTime.getMinutes();
    
    if (endMins <= startMins) {
      return Alert.alert('Validation Error', 'End time must be later than start time.');
    }

    Alert.alert('Success', 'Overtime request submitted', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* --- HEADER --- */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Request Overtime</Text>
          <Text style={styles.headerSubtitle}>Submit your extra hours</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- FORM SECTION --- */}
        <View style={styles.formContainer}>
          
          {/* Label: Date */}
          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity 
            style={styles.inputCard} 
            activeOpacity={0.7} 
            onPress={() => setPickerType('date')}
          >
            <Feather name="calendar" size={20} color="#0B8FAC" style={styles.inputIcon} />
            <Text style={[styles.textValue, !date && { color: '#9CA3AF' }]}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {/* Label: Time */}
          <Text style={styles.inputLabel}>Time</Text>
          <View style={styles.timeRow}>
            {/* Start Time */}
            <TouchableOpacity 
              style={[styles.inputCard, styles.halfInput]} 
              activeOpacity={0.7}
              onPress={() => setPickerType('start')}
            >
              <Feather name="clock" size={20} color="#0B8FAC" style={styles.inputIcon} />
              <Text style={[styles.textValue, !startTime && { color: '#9CA3AF' }]} numberOfLines={1}>
                {formatTime(startTime, 'Start Time')}
              </Text>
            </TouchableOpacity>

            {/* End Time */}
            <TouchableOpacity 
              style={[styles.inputCard, styles.halfInput]} 
              activeOpacity={0.7}
              onPress={() => setPickerType('end')}
            >
              <Feather name="clock" size={20} color="#0B8FAC" style={styles.inputIcon} />
              <Text style={[styles.textValue, !endTime && { color: '#9CA3AF' }]} numberOfLines={1}>
                {formatTime(endTime, 'End Time')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Duration Indicator */}
          {startTime && endTime && (
            <Text style={styles.durationText}>
              {getDuration() === 'Invalid duration' 
                ? 'Invalid duration' 
                : `Duration: ${getDuration()}`}
            </Text>
          )}

          {/* Label: Reason / Notes */}
          <Text style={styles.inputLabel}>Reason / Notes</Text>
          <View style={[styles.inputCard, styles.textAreaCard]}>
            <Feather name="align-left" size={20} color="#0B8FAC" style={styles.textAreaIcon} />
            <TextInput
              style={styles.textAreaInput}
              placeholder="Enter reason for overtime (e.g., Patient care, system update)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={reason}
              onChangeText={setReason}
            />
          </View>

        </View>
      </ScrollView>

      {/* --- BOTTOM ACTION BUTTON --- */}
      <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit}>
          <LinearGradient
            colors={['#7BC1B7', '#0B8FAC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* --- NATIVE PICKER --- */}
      {pickerType && (
        <DateTimePicker
          value={
            pickerType === 'date' ? (date || new Date()) :
            pickerType === 'start' ? (startTime || new Date()) :
            (endTime || new Date())
          }
          mode={pickerType === 'date' ? 'date' : 'time'}
          display="default"
          onChange={onPickerChange}
        />
      )}
      
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Very light gray / Off-white background
  },
  
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Align perfectly to the 24px padding edge
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  headerPlaceholder: {
    width: 40, // Balances the back button width to keep text perfectly centered
  },

  // --- CONTENT ---
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: -4, // Pulls the card slightly closer to the label
    marginTop: 12,
    paddingLeft: 4,
  },

  // --- INPUT CARDS ---
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56, // Consistent height for one-liners
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  textValue: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B8FAC',
    paddingLeft: 4,
    marginTop: 4,
    marginBottom: -4,
  },

  // --- TIME INPUT ROW ---
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },

  // --- TEXT AREA ---
  textAreaCard: {
    height: 140, // Taller card
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2, // Align icon with the first line of text
  },
  textAreaInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
    lineHeight: 22,
  },

  // --- FOOTER & BUTTON ---
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#F8F9FA', // Matches background
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 28, // Heavily rounded (pill shape)
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#0B8FAC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});