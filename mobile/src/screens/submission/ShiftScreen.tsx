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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  useAnimatedReaction,
  withTiming,
  withSequence,
  interpolate, 
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

// --- MOCK DATA ---
interface Shift {
  id: string;
  shortDate: string;
  fullDate: string;
  name: string;
  hours: string;
  duration: string;
  location: string;
  status: string;
}

const TODAY_SHIFT: Shift = {
  id: 'today',
  shortDate: 'FRI, 4 SEP',
  fullDate: 'Friday, 4 September 2026',
  name: 'Morning Shift',
  hours: '07:00 — 15:00',
  duration: '8 Hours',
  location: 'Klinik Pratama UNIMUS',
  status: 'Scheduled',
};

const UPCOMING_SHIFTS: Shift[] = [
  { id: '1', shortDate: 'Sat, 5 Sep', fullDate: 'Saturday, 5 September 2026', name: 'Morning Shift', hours: '07:00 — 15:00', duration: '8 Hours', location: 'Klinik Pratama UNIMUS', status: 'Scheduled' },
  { id: '2', shortDate: 'Sun, 6 Sep', fullDate: 'Sunday, 6 September 2026', name: 'Evening Shift', hours: '15:00 — 23:00', duration: '8 Hours', location: 'Klinik Pratama UNIMUS', status: 'Scheduled' },
  { id: '3', shortDate: 'Mon, 7 Sep', fullDate: 'Monday, 7 September 2026', name: 'Night Shift', hours: '23:00 — 07:00', duration: '8 Hours', location: 'Klinik Pratama UNIMUS', status: 'Scheduled' },
];

// ==================================================
// KOMPONEN: DATE CARD (100% UI-THREAD ANIMATION)
// ==================================================
const ITEM_WIDTH = 54;
const SPACING = 12;
const STEP = ITEM_WIDTH + SPACING; 

const DayCard = ({ item, index, activeIndex, onPress }: any) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (activeIndex.value === index) {
      progress.value = 1;
    }
  }, []);

  useAnimatedReaction(
    () => activeIndex.value === index,
    (isActive, wasActive) => {
      if (isActive && !wasActive) {
        progress.value = withSequence(
          withTiming(1.5, { duration: 150 }), 
          withTiming(1, { duration: 150 })    
        );
      } else if (!isActive && wasActive) {
        progress.value = withTiming(0, { duration: 250 }); 
      }
    }
  );

  const animContainer = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1, 1.5], [1, 1.04, 1.08]);
    const translateY = interpolate(progress.value, [0, 1, 1.5], [0, 0, -3]);
    const shadowOp = interpolate(progress.value, [0, 1, 1.5], [0.01, 0.08, 0.15]);
    
    return {
      transform: [{ scale }, { translateY }],
      shadowOpacity: shadowOp,
      elevation: interpolate(progress.value, [0, 1, 1.5], [0, 4, 6]),
    };
  });

  const animGradientOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1, 1.5], [0, 1, 1]),
  }));

  const animBorder = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], ['#E2E8F0', 'transparent']),
  }));

  const animDayName = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#64748B', '#FFFFFF']),
  }));

  const animDayNum = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#0F172A', '#FFFFFF']),
  }));

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onPress(index, item.id)}>
      <Animated.View style={[styles.dayCardWrapper, animContainer]}>
        <Animated.View style={[styles.dayCardBase, animBorder]}>
          
          <Animated.View style={[StyleSheet.absoluteFill, animGradientOpacity]}>
            <LinearGradient 
              colors={['#7BC1B7', '#0B8FAC']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={[StyleSheet.absoluteFill, { borderRadius: 16 }]} 
            />
          </Animated.View>
          
          <View style={styles.dayCardContent}>
            <Animated.Text style={[styles.dayName, animDayName]}>{item.dayName}</Animated.Text>
            <Animated.Text style={[styles.dayNum, animDayNum]}>{item.date}</Animated.Text>
            {item.isToday && <View style={styles.todayDot} />}
          </View>

        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ==================================================
// MAIN SCREEN
// ==================================================
export default function ShiftScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeDateId, setActiveDateId] = useState<string>("0"); 

  const days = useMemo(() => {
    const namaHari = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const generated = [];
    const today = new Date();
    for (let i = -15; i <= 15; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      generated.push({ id: i.toString(), dayName: namaHari[d.getDay()], date: d.getDate().toString(), isToday: i === 0 });
    }
    return generated;
  }, []);

  const daysLength = days.length;
  const initialTodayIndex = days.findIndex(d => d.id === "0"); 

  const activeIndex = useSharedValue(initialTodayIndex);
  const scrollX = useSharedValue(0);
  const focusOffset = useSharedValue(initialTodayIndex * STEP);

  const handleActiveIndexChangeJS = (index: number) => {
    const id = days[index]?.id;
    if (id && activeDateId !== id) {
      setActiveDateId(id);
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
      const newIndex = Math.round((scrollX.value + focusOffset.value) / STEP);
      if (newIndex >= 0 && newIndex < daysLength && newIndex !== activeIndex.value) {
        activeIndex.value = newIndex; 
        runOnJS(handleActiveIndexChangeJS)(newIndex); 
      }
    }
  });

  const handlePress = (index: number, id: string) => {
    focusOffset.value = (index * STEP) - scrollX.value; 
    activeIndex.value = index; 
    setActiveDateId(id);
  };

  const openShiftDetail = (shift: Shift) => {
    setSelectedShift(shift);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedShift(null), 300);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#0B8FAC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shift</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* DATE SELECTOR */}
        <View style={styles.calendarContainer}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {days.map((item, index) => (
              <DayCard 
                key={item.id}
                item={item} 
                index={index}
                activeIndex={activeIndex}
                onPress={handlePress} 
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/* TODAY'S SHIFT */}
        <Text style={styles.selectedDate}>{TODAY_SHIFT.fullDate}</Text>
        
        <View style={styles.shiftCardContainer}>
          <LinearGradient colors={['#7BC1B7', '#0B8FAC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shiftCard}>
            <View style={[styles.abstractShape, styles.wave1]} />
            <View style={[styles.abstractShape, styles.wave2]} />
            <View style={styles.cardContent}>
              <Text style={styles.shiftNameWhite}>{TODAY_SHIFT.name}</Text>
              <Text style={styles.shiftTimeWhite}>{TODAY_SHIFT.hours}</Text>
              <Text style={styles.shiftLocWhite}>{TODAY_SHIFT.location}</Text>
              <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                <View style={styles.statusPillWhite}>
                  <Text style={styles.statusTextWhite}>{TODAY_SHIFT.status}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* UPCOMING SHIFTS */}
        <Text style={styles.upcomingTitle}>Upcoming Shifts</Text>

        <View style={styles.upcomingList}>
          {UPCOMING_SHIFTS.map((shift) => (
            <TouchableOpacity key={shift.id} style={styles.upcomingCard} onPress={() => openShiftDetail(shift)} activeOpacity={0.7}>
              <View>
                <Text style={styles.upcomingShortDate}>{shift.shortDate}</Text>
                <Text style={styles.upcomingName}>{shift.name}</Text>
                <Text style={styles.upcomingHours}>{shift.hours}</Text>
              </View>
              <View style={styles.arrowCircle}>
                <Feather name="chevron-right" size={20} color="#64748B" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- SHIFT REQUEST ACTION (UPDATED TO GRADIENT BUTTON) --- */}
        <View style={styles.requestButtonWrapper}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ShiftRequest')}
          >
            <LinearGradient 
              colors={['#7BC1B7', '#0B8FAC']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.requestGradient}
            >
              <Feather name="refresh-cw" size={20} color="#FFFFFF" />
              <Text style={styles.requestButtonText}>Shift Request</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* BOTTOM SHEET MODAL (SHIFT DETAIL) */}
      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.modalDragIndicator} />
          {selectedShift && (
            <>
              <Text style={styles.modalTitle}>Shift Detail</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shift Name</Text>
                <Text style={styles.detailValue}>{selectedShift.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{selectedShift.fullDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Working Hours</Text>
                <Text style={styles.detailValue}>{selectedShift.hours}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{selectedShift.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{selectedShift.location}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{selectedShift.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButtonPrimary} onPress={closeModal}>
                <Text style={styles.closeButtonTextPrimary}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  scrollContent: { paddingBottom: 40 },
  
  calendarContainer: { paddingVertical: 16, marginBottom: 8 },
  dayCardWrapper: { width: ITEM_WIDTH, height: 74, marginRight: SPACING, shadowColor: '#0B8FAC', shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  dayCardBase: { flex: 1, borderRadius: 16, borderWidth: 1, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  dayCardContent: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  dayName: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  dayNum: { fontSize: 16, fontWeight: '700' },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#F6F0D7', position: 'absolute', bottom: 8 },

  selectedDate: { fontSize: 15, fontWeight: '600', color: '#0F172A', paddingHorizontal: 24, marginBottom: 16 },
  
  shiftCardContainer: { marginHorizontal: 20, marginBottom: 12, marginTop: 4, ...Platform.select({ ios: { shadowColor: '#0B8FAC', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.35, shadowRadius: 30 }, android: { elevation: 14 }}) },
  shiftCard: { borderRadius: 28, overflow: 'hidden', position: 'relative' },
  cardContent: { paddingVertical: 14, paddingHorizontal: 28, zIndex: 10 },
  abstractShape: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)' },
  wave1: { width: 160, height: 160, borderRadius: 80, top: -40, right: -20, transform: [{ scaleX: 1.2 }, { rotate: '25deg' }] },
  wave2: { width: 140, height: 140, borderRadius: 70, bottom: -50, right: 30, transform: [{ scaleY: 1.1 }, { rotate: '-15deg' }] },
  shiftNameWhite: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  shiftTimeWhite: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.95)', marginBottom: 10 },
  shiftLocWhite: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  statusPillWhite: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusTextWhite: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  upcomingTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 12, marginBottom: 16, paddingHorizontal: 24 },
  upcomingList: { paddingHorizontal: 20, gap: 12 },
  upcomingCard: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(226, 232, 240, 0.6)', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16 }, android: { elevation: 2 }}) },
  upcomingShortDate: { fontSize: 11, fontWeight: '600', color: '#0B8FAC', textTransform: 'uppercase', letterSpacing: 0.5 },
  upcomingName: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginTop: 4 },
  upcomingHours: { fontSize: 12, color: '#64748B', marginTop: 4 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },

  // --- NEW: COMPACT GRADIENT BUTTON STYLES ---
  requestButtonWrapper: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({ 
      ios: { shadowColor: '#0B8FAC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12 }, 
      android: { elevation: 4 }
    })
  },
  requestGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    gap: 10
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  modalDragIndicator: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 14, color: '#64748B' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  statusPill: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  closeButtonPrimary: { backgroundColor: '#0B8FAC', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  closeButtonTextPrimary: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
});