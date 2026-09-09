import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getTodaySchedule,
  getShifts,
} from '../../api/api';

type ShiftOption = {
  id: string;
  name: string;
  hours: string;
};

const REQUEST_TYPES = [
  'Change Shift',
  'Exchange Shift',
  'Other Shift Request',
];

export default function ShiftRequestScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [requestType, setRequestType] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [requestedShift, setRequestedShift] =
    useState<ShiftOption | null>(null);
  const [reason, setReason] = useState('');

  const [currentShift, setCurrentShift] =
    useState<ShiftOption | null>(null);

  const [shiftOptions, setShiftOptions] = useState<
    ShiftOption[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [isTypeModalVisible, setTypeModalVisible] =
    useState(false);

  const [isShiftModalVisible, setShiftModalVisible] =
    useState(false);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const loadShiftData = async () => {
    try {
      setLoading(true);

      const [todayResponse, shiftsResponse] =
        await Promise.all([
          getTodaySchedule(),
          getShifts(),
        ]);

      const todayData = todayResponse?.data ?? null;
      const todayShift = todayData?.shift ?? null;

      if (todayShift) {
        setCurrentShift({
          id: String(todayShift.id),
          name: todayShift.name,
          hours: `${todayShift.startTime} — ${todayShift.endTime}`,
        });
      } else {
        setCurrentShift(null);
      }

      const rawShifts = shiftsResponse?.data;

      const shifts = Array.isArray(rawShifts)
        ? rawShifts
        : rawShifts?.items ??
          rawShifts?.shifts ??
          [];

      const mappedShifts: ShiftOption[] = shifts
        .filter((shift: any) => shift?.isActive !== false)
        .map((shift: any) => ({
          id: String(shift.id),
          name: String(shift.name),
          hours: `${shift.startTime} — ${shift.endTime}`,
        }));

      setShiftOptions(mappedShifts);
    } catch (error) {
      console.error(
        'Gagal mengambil data shift:',
        error,
      );

      setCurrentShift(null);
      setShiftOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShiftData();
  }, []);

  const handleDateChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    const isIOS = Platform.OS === 'ios';

    if (!isIOS) {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (value: Date | null) => {
    if (!value) {
      return 'DD / MM / YYYY';
    }

    return value.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isFormValid =
    Boolean(
      requestType &&
        date &&
        requestedShift &&
        reason.trim().length > 0,
    );

  const handleSubmit = () => {
    if (!isFormValid) {
      return;
    }

    Alert.alert(
      'Fitur Belum Tersedia',
      'Pengajuan perubahan shift belum memiliki endpoint backend. Data tidak dikirim atau disimpan.',
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      {/* HEADER */}
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
          Shift Request
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* FORM AREA */}
          <View style={styles.formCard}>
            {/* Request Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Request Type
              </Text>

              <TouchableOpacity
                style={styles.selectBox}
                activeOpacity={0.7}
                onPress={() =>
                  setTypeModalVisible(true)
                }
              >
                <Text
                  style={[
                    styles.inputText,
                    !requestType &&
                      styles.placeholderText,
                  ]}
                >
                  {requestType ||
                    'Select request type'}
                </Text>

                <Feather
                  name="chevron-down"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>

              <TouchableOpacity
                style={styles.selectBox}
                onPress={() =>
                  setShowDatePicker(true)
                }
              >
                <Text
                  style={[
                    styles.inputText,
                    !date &&
                      styles.placeholderText,
                  ]}
                >
                  {formatDate(date)}
                </Text>

                <Feather
                  name="calendar"
                  size={18}
                  color="#7BC1B7"
                />
              </TouchableOpacity>
            </View>

            {/* Current Shift */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Current Shift
              </Text>

              <View
                style={[
                  styles.selectBox,
                  styles.readOnlyBox,
                ]}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#0B8FAC"
                  />
                ) : currentShift ? (
                  <View>
                    <Text
                      style={
                        styles.readOnlyTextMain
                      }
                    >
                      {currentShift.name}
                    </Text>

                    <Text
                      style={
                        styles.readOnlyTextSub
                      }
                    >
                      {currentShift.hours}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={
                      styles.readOnlyTextSub
                    }
                  >
                    No shift assigned today
                  </Text>
                )}

                <Feather
                  name="lock"
                  size={16}
                  color="#9CA3AF"
                />
              </View>
            </View>

            {/* Requested Shift */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Requested Shift
              </Text>

              <TouchableOpacity
                style={styles.selectBox}
                activeOpacity={0.7}
                onPress={() =>
                  setShiftModalVisible(true)
                }
                disabled={
                  loading ||
                  shiftOptions.length === 0
                }
              >
                {requestedShift ? (
                  <View>
                    <Text style={styles.inputText}>
                      {requestedShift.name}
                    </Text>

                    <Text
                      style={styles.inputSubText}
                    >
                      {requestedShift.hours}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={styles.placeholderText}
                  >
                    {loading
                      ? 'Loading shifts...'
                      : shiftOptions.length === 0
                        ? 'No shifts available'
                        : 'Select requested shift'}
                  </Text>
                )}

                <Feather
                  name="chevron-down"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            {/* Reason */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Reason
              </Text>

              <View
                style={styles.textAreaContainer}
              >
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

            {/* Supporting Document */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Supporting Document (Optional)
              </Text>

              <View
                style={[
                  styles.attachmentButton,
                  styles.attachmentDisabled,
                ]}
              >
                <Feather
                  name="paperclip"
                  size={18}
                  color="#9CA3AF"
                />

                <Text
                  style={[
                    styles.attachmentText,
                    styles.attachmentDisabledText,
                  ]}
                >
                  Document upload unavailable
                </Text>
              </View>
            </View>
          </View>

          {/* SUMMARY */}
          {isFormValid && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>
                Request Summary
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Date
                </Text>

                <Text style={styles.summaryValue}>
                  {formatDate(date)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Current Shift
                </Text>

                <Text style={styles.summaryValue}>
                  {currentShift?.name ?? '-'}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Requested Shift
                </Text>

                <Text style={styles.summaryValue}>
                  {requestedShift?.name ?? '-'}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryRow,
                  {
                    borderBottomWidth: 0,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.summaryLabel,
                    { marginBottom: 6 },
                  ]}
                >
                  Reason
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      fontWeight: '400',
                      color: '#4B5563',
                      lineHeight: 20,
                    },
                  ]}
                >
                  {reason}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* SUBMIT BUTTON */}
        <View
          style={[
            styles.bottomContainer,
            {
              paddingBottom:
                insets.bottom + 16,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.submitButton,
              !isFormValid &&
                styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={!isFormValid}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              Submit Shift Request
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* DATE PICKER */}
      {showDatePicker && (
        <View
          style={
            Platform.OS === 'ios'
              ? styles.iosPickerContainer
              : undefined
          }
        >
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity
                onPress={() =>
                  setShowDatePicker(false)
                }
              >
                <Text
                  style={styles.iosPickerDone}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={handleDateChange}
            textColor="#1F2937"
          />
        </View>
      )}

      {/* REQUEST TYPE MODAL */}
      <Modal
        visible={isTypeModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              setTypeModalVisible(false)
            }
          />

          <View
            style={[
              styles.modalContent,
              {
                paddingBottom:
                  insets.bottom + 20,
              },
            ]}
          >
            <View
              style={styles.modalDragIndicator}
            />

            <Text style={styles.modalTitle}>
              Request Type
            </Text>

            {REQUEST_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  setRequestType(type);
                  setTypeModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    requestType === type &&
                      styles.modalOptionActive,
                  ]}
                >
                  {type}
                </Text>

                {requestType === type && (
                  <Feather
                    name="check"
                    size={20}
                    color="#7BC1B7"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* REQUESTED SHIFT MODAL */}
      <Modal
        visible={isShiftModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              setShiftModalVisible(false)
            }
          />

          <View
            style={[
              styles.modalContent,
              {
                paddingBottom:
                  insets.bottom + 20,
              },
            ]}
          >
            <View
              style={styles.modalDragIndicator}
            />

            <Text style={styles.modalTitle}>
              Requested Shift
            </Text>

            {shiftOptions.length === 0 ? (
              <View
                style={styles.noShiftContainer}
              >
                <Text
                  style={styles.noShiftText}
                >
                  No active shifts available.
                </Text>
              </View>
            ) : (
              shiftOptions.map((shift) => (
                <TouchableOpacity
                  key={shift.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setRequestedShift(shift);
                    setShiftModalVisible(
                      false,
                    );
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        requestedShift?.id ===
                          shift.id &&
                          styles.modalOptionActive,
                      ]}
                    >
                      {shift.name}
                    </Text>

                    <Text
                      style={styles.inputSubText}
                    >
                      {shift.hours}
                    </Text>
                  </View>

                  {requestedShift?.id ===
                    shift.id && (
                    <Feather
                      name="check"
                      size={20}
                      color="#7BC1B7"
                    />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </Modal>
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
  },

  backButton: {
    padding: 4,
    marginLeft: -4,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },

      android: {
        elevation: 2,
      },
    }),
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },

  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    paddingVertical: 12,
  },

  readOnlyBox: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },

  inputText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },

  inputSubText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  placeholderText: {
    color: '#9CA3AF',
    fontSize: 15,
  },

  readOnlyTextMain: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },

  readOnlyTextSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },

  textAreaContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 120,
  },

  textArea: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 24,
  },

  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9F8',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#7BC1B7',
    borderRadius: 16,
    height: 56,
    gap: 8,
  },

  attachmentDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },

  attachmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B8FAC',
  },

  attachmentDisabledText: {
    color: '#9CA3AF',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },

  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#F9F9F9',
  },

  submitButton: {
    backgroundColor: '#7BC1B7',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#7BC1B7',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },

      android: {
        elevation: 4,
      },
    }),
  },

  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  modalDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },

  modalOptionActive: {
    color: '#7BC1B7',
    fontWeight: '700',
  },

  noShiftContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },

  noShiftText: {
    fontSize: 14,
    color: '#6B7280',
  },

  iosPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },

  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },

  iosPickerDone: {
    color: '#0B8FAC',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
