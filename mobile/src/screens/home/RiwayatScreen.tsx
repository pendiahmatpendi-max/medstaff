import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { getAttendanceHistory } from '../../api/api';

type FilterCategory = 'All' | 'Attendance' | 'Leave' | 'Overtime' | 'Shift';
type StatusType = 'Hadir' | 'Terlambat' | 'Izin';

interface HistoryRecord {
  id: string;
  category: FilterCategory;
  title: string;
  detail: string;
  status: StatusType;
  timestamp: number;
}

const CATEGORIES: FilterCategory[] = [
  'All',
  'Attendance',
  'Leave',
  'Overtime',
  'Shift',
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const getStatusStyles = (status: StatusType) => {
  switch (status) {
    case 'Hadir':
      return { color: '#10B981', bg: '#DCFCE7' };
    case 'Terlambat':
      return { color: '#F59E0B', bg: '#FEF3C7' };
    case 'Izin':
      return { color: '#EF4444', bg: '#FEE2E2' };
    default:
      return { color: '#6B7280', bg: '#F3F4F6' };
  }
};

const getCategoryStyles = (category: FilterCategory) => {
  switch (category) {
    case 'Attendance':
      return { color: '#FFFFFF', bg: '#059669' };
    case 'Leave':
      return { color: '#FFFFFF', bg: '#EA580C' };
    case 'Overtime':
      return { color: '#FFFFFF', bg: '#D97706' };
    case 'Shift':
      return { color: '#FFFFFF', bg: '#7C3AED' };
    default:
      return { color: '#FFFFFF', bg: '#0B8FAC' };
  }
};

const getCategoryIcon = (category: FilterCategory) => {
  switch (category) {
    case 'Attendance':
      return 'user-check';
    case 'Leave':
      return 'calendar-day';
    case 'Overtime':
      return 'stopwatch';
    case 'Shift':
      return 'exchange-alt';
    default:
      return 'file-alt';
  }
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const formatTime = (value: string | null | undefined) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] =
    useState<FilterCategory>('All');

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);

  const [pickerMode, setPickerMode] =
    useState<'calendar' | 'monthYear'>('calendar');

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);

        const response = await getAttendanceHistory();

        const rawData = response.data ?? [];

        const records: HistoryRecord[] = rawData
          .filter((item: any) => item && item.id)
          .map((item: any) => {
            const attendanceDate = item.attendanceDate
              ? new Date(item.attendanceDate)
              : new Date();

            const clockInTime = formatTime(item.clockIn);
            const clockOutTime = formatTime(item.clockOut);

            const timestamp = item.clockIn
              ? new Date(item.clockIn).getTime()
              : attendanceDate.getTime();

            let status: StatusType = 'Hadir';

            if (item.status === 'TERLAMBAT') {
              status = 'Terlambat';
            } else if (item.status === 'IZIN') {
              status = 'Izin';
            }

            let detail = 'Attendance';

            if (clockInTime && clockOutTime) {
              detail = `Clock In · ${clockInTime} | Clock Out · ${clockOutTime}`;
            } else if (clockInTime) {
              detail = `Clock In · ${clockInTime}`;
            } else if (clockOutTime) {
              detail = `Clock Out · ${clockOutTime}`;
            }

            return {
              id: String(item.id),
              category: 'Attendance',
              title: 'Attendance',
              detail,
              status,
              timestamp,
            };
          });

        if (mounted) {
          setData(records);
        }
      } catch (error) {
        console.error(
          'Gagal mengambil riwayat attendance:',
          error,
        );

        if (mounted) {
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const groupedHistory = useMemo(() => {
    let filtered = [...data];

    if (activeCategory !== 'All') {
      filtered = filtered.filter(
        item => item.category === activeCategory,
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = endDate
        ? new Date(endDate)
        : new Date(startDate);

      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(item => {
        return (
          item.timestamp >= start.getTime() &&
          item.timestamp <= end.getTime()
        );
      });
    }

    filtered.sort((a, b) => b.timestamp - a.timestamp);

    const groups: {
      title: string;
      data: HistoryRecord[];
    }[] = [];

    filtered.forEach(item => {
      const date = new Date(item.timestamp);
      const today = new Date();

      let groupTitle = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      if (isSameDay(date, today)) {
        groupTitle = 'Today';
      } else if (
        isSameDay(
          date,
          new Date(today.getTime() - 86400000),
        )
      ) {
        groupTitle = 'Yesterday';
      }

      const existingGroup = groups.find(
        group => group.title === groupTitle,
      );

      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        groups.push({
          title: groupTitle,
          data: [item],
        });
      }
    });

    return groups;
  }, [activeCategory, startDate, endDate, data]);

  const handleOpenModal = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setViewDate(startDate || new Date());
    setPickerMode('calendar');
    setDateModalVisible(true);
  };

  const handleApplyDate = () => {
    setStartDate(tempStart);
    setEndDate(tempEnd);
    setDateModalVisible(false);
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setTempStart(null);
    setTempEnd(null);
    setDateModalVisible(false);
  };

  const handleDayPress = (day: number) => {
    const selectedDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day,
    );

    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(selectedDate);
      setTempEnd(null);
    } else if (
      selectedDate.getTime() < tempStart.getTime()
    ) {
      setTempStart(selectedDate);
    } else {
      setTempEnd(selectedDate);
    }
  };

  const applyQuickFilter = (
    type: 'today' | 'week' | 'month' | 'all',
  ) => {
    const now = new Date();

    if (type === 'all') {
      setTempStart(null);
      setTempEnd(null);
    } else if (type === 'today') {
      setTempStart(now);
      setTempEnd(now);
      setViewDate(now);
    } else if (type === 'week') {
      const start = new Date(now);
      const day = start.getDay();

      const diff =
        start.getDate() -
        day +
        (day === 0 ? -6 : 1);

      start.setDate(diff);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      setTempStart(start);
      setTempEnd(end);
      setViewDate(now);
    } else if (type === 'month') {
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      );

      setTempStart(start);
      setTempEnd(end);
      setViewDate(now);
    }

    setPickerMode('calendar');
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(
      year,
      month + 1,
      0,
    ).getDate();

    const firstDay = new Date(
      year,
      month,
      1,
    ).getDay();

    const startingBlankDays =
      firstDay === 0 ? 6 : firstDay - 1;

    const daysArray: React.ReactNode[] = [];

    for (let i = 0; i < startingBlankDays; i++) {
      daysArray.push(
        <View
          key={`blank-${i}`}
          style={styles.calDayBox}
        />,
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(year, month, i);
      const currTime = currDate.getTime();

      const startTs = tempStart?.getTime();
      const endTs =
        tempEnd?.getTime() || startTs;

      const isStart =
        !!tempStart &&
        isSameDay(currDate, tempStart);

      const isEnd =
        !!tempEnd &&
        isSameDay(currDate, tempEnd);

      const isSelected = isStart || isEnd;

      const isInRange =
        !!tempStart &&
        !!tempEnd &&
        currTime > startTs! &&
        currTime < endTs!;

      const isToday = isSameDay(
        currDate,
        new Date(),
      );

      daysArray.push(
        <View
          key={i}
          style={[
            styles.calDayBox,
            isInRange &&
              styles.calDayInRange,
          ]}
        >
          {isStart && tempEnd && (
            <View
              style={[
                styles.calRangeConnector,
                styles.calRangeRight,
              ]}
            />
          )}

          {isEnd && tempStart && (
            <View
              style={[
                styles.calRangeConnector,
                styles.calRangeLeft,
              ]}
            />
          )}

          <TouchableOpacity
            style={[
              styles.calDayBtn,
              isSelected &&
                styles.calDaySelected,
            ]}
            onPress={() =>
              handleDayPress(i)
            }
          >
            <Text
              style={[
                styles.calDayText,
                isSelected &&
                  styles.calDayTextSelected,
                isToday &&
                  !isSelected &&
                  styles.calDayTextToday,
              ]}
            >
              {i}
            </Text>
          </TouchableOpacity>
        </View>,
      );
    }

    return daysArray;
  };

  const renderMonthYearPicker = () => {
    const currentYear = new Date().getFullYear();

    const years = Array.from(
      { length: 10 },
      (_, i) => currentYear - 5 + i,
    );

    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerTitle}>
          Select Month
        </Text>

        <View style={styles.pickerGrid}>
          {MONTHS.map((month, index) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.pickerItem,
                viewDate.getMonth() === index &&
                  styles.pickerItemActive,
              ]}
              onPress={() =>
                setViewDate(
                  new Date(
                    viewDate.getFullYear(),
                    index,
                    1,
                  ),
                )
              }
            >
              <Text
                style={[
                  styles.pickerText,
                  viewDate.getMonth() === index &&
                    styles.pickerTextActive,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.pickerTitle,
            { marginTop: 16 },
          ]}
        >
          Select Year
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 10,
          }}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.pickerItem,
                viewDate.getFullYear() === year &&
                  styles.pickerItemActive,
              ]}
              onPress={() =>
                setViewDate(
                  new Date(
                    year,
                    viewDate.getMonth(),
                    1,
                  ),
                )
              }
            >
              <Text
                style={[
                  styles.pickerText,
                  viewDate.getFullYear() === year &&
                    styles.pickerTextActive,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() =>
            setPickerMode('calendar')
          }
        >
          <Text style={styles.applyBtnText}>
            Back to Calendar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  let displayFilterText = 'All Time';

  if (startDate) {
    const startFormat =
      startDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });

    if (
      endDate &&
      !isSameDay(startDate, endDate)
    ) {
      const endFormat =
        endDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

      displayFilterText =
        `${startFormat} - ${endFormat}`;
    } else {
      displayFilterText =
        startDate.toLocaleDateString(
          'en-GB',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        );
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            height: 60 + insets.top,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Feather
            name="arrow-left"
            size={24}
            color="#1F2937"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          History
        </Text>
      </View>

      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.categoryScroll
          }
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                activeCategory === category &&
                  styles.categoryPillActive,
              ]}
              onPress={() =>
                setActiveCategory(category)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category &&
                    styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.dateFilterContainer}>
        <TouchableOpacity
          style={styles.dateFilterBtn}
          activeOpacity={0.7}
          onPress={handleOpenModal}
        >
          <View style={styles.dateFilterLeft}>
            <Feather
              name="calendar"
              size={16}
              color="#0B8FAC"
            />

            <Text style={styles.dateFilterText}>
              {displayFilterText}
            </Text>
          </View>

          <Feather
            name="chevron-down"
            size={16}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }
      >
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator
              size="large"
              color="#0B8FAC"
            />

            <Text
              style={[
                styles.emptySubtitle,
                { marginTop: 16 },
              ]}
            >
              Memuat riwayat...
            </Text>
          </View>
        ) : groupedHistory.length > 0 ? (
          groupedHistory.map(group => (
            <View
              key={group.title}
              style={styles.groupContainer}
            >
              <View style={styles.groupHeader}>
                <Text
                  style={styles.groupTitle}
                >
                  {group.title}
                </Text>

                <View
                  style={styles.groupDivider}
                />
              </View>

              {group.data.map(item => {
                const statusStyle =
                  getStatusStyles(item.status);

                const categoryStyle =
                  getCategoryStyles(
                    item.category,
                  );

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.cardIconBg,
                        {
                          backgroundColor:
                            categoryStyle.bg,
                        },
                      ]}
                    >
                      <FontAwesome5
                        name={getCategoryIcon(
                          item.category,
                        )}
                        size={16}
                        color={
                          categoryStyle.color
                        }
                        solid
                      />
                    </View>

                    <View
                      style={styles.cardBody}
                    >
                      <Text
                        style={
                          styles.cardTitle
                        }
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={
                          styles.cardDetail
                        }
                      >
                        {item.detail}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.cardTrailing
                      }
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              statusStyle.color,
                          },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View
              style={
                styles.emptyIconCircle
              }
            >
              <Feather
                name="inbox"
                size={32}
                color="#9CA3AF"
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No history found
            </Text>

            <Text
              style={styles.emptySubtitle}
            >
              Belum ada data pada periode atau
              kategori yang dipilih.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDateModalVisible(false)
        }
      >
        <TouchableWithoutFeedback
          onPress={() =>
            setDateModalVisible(false)
          }
        >
          <View
            style={styles.modalOverlay}
          >
            <TouchableWithoutFeedback>
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
                  style={styles.modalHeader}
                >
                  <Text
                    style={styles.modalTitle}
                  >
                    Select Date Range
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      setDateModalVisible(
                        false,
                      )
                    }
                    style={
                      styles.modalCloseBtn
                    }
                  >
                    <Feather
                      name="x"
                      size={22}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.quickFilterScroll
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.quickFilterBtn
                    }
                    onPress={() =>
                      applyQuickFilter(
                        'today',
                      )
                    }
                  >
                    <Text
                      style={
                        styles.quickFilterText
                      }
                    >
                      Today
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.quickFilterBtn
                    }
                    onPress={() =>
                      applyQuickFilter(
                        'week',
                      )
                    }
                  >
                    <Text
                      style={
                        styles.quickFilterText
                      }
                    >
                      This Week
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.quickFilterBtn
                    }
                    onPress={() =>
                      applyQuickFilter(
                        'month',
                      )
                    }
                  >
                    <Text
                      style={
                        styles.quickFilterText
                      }
                    >
                      This Month
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.quickFilterBtn
                    }
                    onPress={() =>
                      applyQuickFilter(
                        'all',
                      )
                    }
                  >
                    <Text
                      style={
                        styles.quickFilterText
                      }
                    >
                      All Time
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {pickerMode ===
                'calendar' ? (
                  <>
                    <View
                      style={styles.calNav}
                    >
                      <View
                        style={{
                          flexDirection:
                            'row',
                          gap: 12,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            setViewDate(
                              new Date(
                                viewDate.getFullYear() -
                                  1,
                                viewDate.getMonth(),
                                1,
                              ),
                            )
                          }
                        >
                          <Feather
                            name="chevrons-left"
                            size={20}
                            color="#374151"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            setViewDate(
                              new Date(
                                viewDate.getFullYear(),
                                viewDate.getMonth() -
                                  1,
                                1,
                              ),
                            )
                          }
                        >
                          <Feather
                            name="chevron-left"
                            size={20}
                            color="#374151"
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          setPickerMode(
                            'monthYear',
                          )
                        }
                        style={
                          styles.calNavCenter
                        }
                      >
                        <Text
                          style={
                            styles.calNavText
                          }
                        >
                          {
                            MONTHS[
                              viewDate.getMonth()
                            ]
                          }{' '}
                          {viewDate.getFullYear()}
                        </Text>

                        <Feather
                          name="chevron-down"
                          size={16}
                          color="#0B8FAC"
                        />
                      </TouchableOpacity>

                      <View
                        style={{
                          flexDirection:
                            'row',
                          gap: 12,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            setViewDate(
                              new Date(
                                viewDate.getFullYear(),
                                viewDate.getMonth() +
                                  1,
                                1,
                              ),
                            )
                          }
                        >
                          <Feather
                            name="chevron-right"
                            size={20}
                            color="#374151"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            setViewDate(
                              new Date(
                                viewDate.getFullYear() +
                                  1,
                                viewDate.getMonth(),
                                1,
                              ),
                            )
                          }
                        >
                          <Feather
                            name="chevrons-right"
                            size={20}
                            color="#374151"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={
                        styles.weekdaysRow
                      }
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <Text
                          key={day}
                          style={
                            styles.weekdayText
                          }
                        >
                          {day}
                        </Text>
                      ))}
                    </View>

                    <View
                      style={styles.daysGrid}
                    >
                      {renderCalendarDays()}
                    </View>

                    <View
                      style={styles.modalActions}
                    >
                      <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={
                          handleClearDate
                        }
                      >
                        <Text
                          style={
                            styles.clearBtnText
                          }
                        >
                          Clear
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={
                          handleApplyDate
                        }
                      >
                        <Text
                          style={
                            styles.applyBtnText
                          }
                        >
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  renderMonthYearPicker()
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },

  categoryWrapper: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
  },

  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
    marginTop: 12,
  },

  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  categoryPillActive: {
    backgroundColor: '#0B8FAC',
    borderColor: '#0B8FAC',
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },

  dateFilterContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  dateFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  dateFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  groupContainer: {
    marginTop: 20,
  },

  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 12,
  },

  groupDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },

  cardDetail: {
    fontSize: 13,
    color: '#6B7280',
  },

  cardTrailing: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },

  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickFilterScroll: {
    gap: 8,
    marginBottom: 24,
  },

  quickFilterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },

  quickFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },

  calNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  calNavCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  calNavText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calDayBox: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  calDayBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    zIndex: 2,
  },

  calDaySelected: {
    backgroundColor: '#0B8FAC',
  },

  calDayText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },

  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  calDayTextToday: {
    color: '#0B8FAC',
    fontWeight: '800',
  },

  calDayInRange: {
    backgroundColor: 'rgba(11, 143, 172, 0.15)',
  },

  calRangeConnector: {
    position: 'absolute',
    width: '50%',
    height: 36,
    backgroundColor: 'rgba(11,143, 172, 0.15)',
    zIndex: 1,
  },

  calRangeLeft: {
    left: 0,
  },

  calRangeRight: {
    right: 0,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },

  clearBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    minWidth: 100,
  },

  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },

  applyBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#0B8FAC',
    alignItems: 'center',
    minWidth: 120,
  },

  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pickerContainer: {
    paddingVertical: 10,
  },

  pickerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
  },

  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },

  pickerItemActive: {
    backgroundColor: '#0B8FAC',
  },

  pickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },

  pickerTextActive: {
    color: '#FFFFFF',
  },
});


