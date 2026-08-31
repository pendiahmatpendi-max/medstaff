import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  useDerivedValue,
  runOnJS,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82; // Disimpan di variabel agar bisa digunakan untuk centering presisi

// ==================================================
// 1. KOMPONEN 3D GLOSSY ICON UNTUK QUICK MENU
// ==================================================
const AppIcon3D = ({ 
  iconName, 
  IconFamily, 
  colors 
}: { 
  iconName: string, 
  IconFamily: any, 
  colors: [string, string] 
}) => {
  return (
    <View style={[styles.gridMenuIconBox, { backgroundColor: colors[1], overflow: 'hidden', borderWidth: 0 }]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={{
        position: 'absolute',
        top: -5,
        left: -10,
        right: -10,
        height: '55%',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
      }} />
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.25)']} 
        start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} 
        style={StyleSheet.absoluteFill} 
      />
      <IconFamily
        name={iconName}
        size={26} 
        color="#ffffff"
        solid
        style={{
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 3,
          zIndex: 10,
          marginTop: 2
        }}
      />
    </View>
  );
};

// ==================================================
// 2. KOMPONEN KALENDER INTERAKTIF
// ==================================================
const InteractiveDayCard = ({ item, index, activeIndexSV, touchX, isTouched }: any) => {
  const CARD_WIDTH_DAY = 54;
  const GAP = 8;
  const STEP = CARD_WIDTH_DAY + GAP;
  const CENTER_X = index * STEP + (CARD_WIDTH_DAY / 2);

  const isActiveDerived = useDerivedValue(() => {
    if (isTouched.value) {
      const distance = Math.abs(touchX.value - CENTER_X);
      return distance < (STEP / 2);
    }
    return activeIndexSV.value === index;
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const active = isActiveDerived.value;
    return {
      transform: [
        { scale: withSpring(active ? 1.12 : 1, { damping: 14, stiffness: 200 }) },
        { translateY: withSpring(active ? -4 : 0, { damping: 14, stiffness: 200 }) }
      ],
      zIndex: active ? 10 : 1,
    };
  });

  const gradientOpacityStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isActiveDerived.value ? 1 : 0, { damping: 20, stiffness: 200 })
  }));

  const textColorStyle = useAnimatedStyle(() => ({
    color: isActiveDerived.value ? '#ffffff' : '#374151'
  }));
  const dayNameColorStyle = useAnimatedStyle(() => ({
    color: isActiveDerived.value ? 'rgba(255,255,255,0.9)' : '#9ca3af'
  }));
  const dotOpacityStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isActiveDerived.value ? 1 : 0)
  }));

  return (
    <Animated.View style={[styles.dayCardWrapper, animatedContainerStyle]}>
      <View style={styles.dayCardBase}>
        <Animated.View style={[StyleSheet.absoluteFill, gradientOpacityStyle]}>
          <LinearGradient colors={['#7bc1b7', '#0b8fac']} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <View style={styles.cardContent}>
          <Animated.Text style={[styles.dayName, dayNameColorStyle]}>{item.day}</Animated.Text>
          <Animated.Text style={[styles.dayNumber, textColorStyle]}>{item.date}</Animated.Text>
          <Animated.View style={[styles.activeDot, dotOpacityStyle]} />
        </View>
      </View>
    </Animated.View>
  );
};

// ==================================================
// MOCK DATA PENGUMUMAN
// ==================================================
const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    date: '12 Oct 2023',
    title: 'Clinic Health Protocol Update',
    desc: 'Please note the latest updates regarding hygiene standards in the outpatient area starting this week...',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop',
    isImportant: true
  },
  {
    id: '2',
    date: '10 Oct 2023',
    title: 'Staff Schedule Update',
    desc: 'The annual medical check-up for all clinic staff will begin next Monday. Please review your schedule.',
    image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=1000&auto=format&fit=crop',
    isImportant: false
  },
  {
    id: '3',
    date: '08 Oct 2023',
    title: 'Employee Health Check',
    desc: 'Updated triage procedures for the Emergency Room have been published. All ER staff must review them.',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop',
    isImportant: true
  }
];

// ==================================================
// KOMPONEN: STACKED ANNOUNCEMENT CARD
// ==================================================
const StackedAnnouncementCard = ({ item, index, carouselIndexSV, totalItems }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    let diff = (index - carouselIndexSV.value) % totalItems;
    
    if (diff < -0.5) diff += totalItems;
    if (diff > totalItems - 0.5) diff -= totalItems;

    let translateX = diff * 22; 
    let scale = Math.max(0.85, 1 - Math.abs(diff) * 0.05); 
    let opacity = 1 - Math.abs(diff) * 0.15;
    let zIndex = Math.round(100 - Math.abs(diff) * 10);
    
    if (diff < 0) {
      translateX = diff * width * 0.85;
      scale = 1; 
      opacity = interpolate(diff, [-1, -0.5, 0], [0, 0, 1], Extrapolation.CLAMP);
      zIndex = 200; 
    }

    if (diff > 1.5) {
      opacity = 0;
    }

    return {
      position: 'absolute',
      top: 0,
      // HORIZONTAL CENTERING TRICK (Tepat di tengah container, terlepas dari batas ujung layar)
      left: '50%',
      marginLeft: -CARD_WIDTH / 2, 
      zIndex: zIndex,
      elevation: zIndex,
      transform: [
        { translateX },
        { scale }
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.newsCard, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.9} style={{ flex: 1 }}>
        <View style={styles.newsImageContainer}>
          <Image source={{ uri: item.image }} style={styles.newsImage} />
          {item.isImportant && (
            <View style={styles.badgePenting}>
              <Text style={styles.badgePentingText}>IMPORTANT</Text>
            </View>
          )}
        </View>
        <View style={styles.newsContent}>
          <Text style={styles.newsDate}>{item.date}</Text>
          <Text style={styles.newsTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.newsDesc} numberOfLines={2}>{item.desc}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ==================================================
// 3. MAIN HOMESCREEN
// ==================================================
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // --- Kalender Logic ---
  const { currentMonthYear, days, initialActiveIndex } = useMemo(() => {
    const namaHari = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const namaBulan = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const today = new Date();
    const generatedDays = [];
    let todayIndex = 0;

    for (let i = -3; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      generatedDays.push({ day: namaHari[d.getDay()], date: d.getDate().toString() });
      if (i === 0) todayIndex = generatedDays.length - 1; 
    }

    return { currentMonthYear: `${namaBulan[today.getMonth()]} ${today.getFullYear()}`, days: generatedDays, initialActiveIndex: todayIndex };
  }, []);

  const activeIndexSV = useSharedValue(initialActiveIndex); 
  const touchX = useSharedValue(-1);
  const isTouched = useSharedValue(false);

  const updateActiveDate = (x: number) => {
    const nearestIndex = Math.max(0, Math.min(Math.round(x / 62), days.length - 1));
    activeIndexSV.value = nearestIndex;
  };

  const passiveGesture = Gesture.Pan().manualActivation(true) 
    .onTouchesDown((e) => { touchX.value = e.allTouches[0].x; isTouched.value = true; })
    .onTouchesMove((e) => { touchX.value = e.allTouches[0].x; })
    .onTouchesUp((e) => { isTouched.value = false; runOnJS(updateActiveDate)(e.allTouches[0].x); })
    .onTouchesCancelled(() => { isTouched.value = false; });

  // --- Stacked Carousel Logic ---
  const carouselIndexSV = useSharedValue(0);
  const carouselStartX = useSharedValue(0);
  const TOTAL_ANNOUNCEMENTS = MOCK_ANNOUNCEMENTS.length;

  const carouselPanGesture = Gesture.Pan()
    .onStart(() => {
      carouselStartX.value = carouselIndexSV.value;
    })
    .onUpdate((e) => {
      carouselIndexSV.value = carouselStartX.value - (e.translationX / (width * 0.7));
    })
    .onEnd((e) => {
      let diff = carouselIndexSV.value - carouselStartX.value;
      
      let targetOffset = 0;
      if (e.velocityX < -300 || diff > 0.3) {
        targetOffset = 1; 
      } else if (e.velocityX > 300 || diff < -0.3) {
        targetOffset = -1; 
      }

      const nextTarget = Math.round(carouselStartX.value) + targetOffset;
      carouselIndexSV.value = withSpring(nextTarget, { damping: 18, stiffness: 120 });
    });

  const handleNextAnnouncement = () => {
    const nextTarget = Math.round(carouselIndexSV.value) + 1;
    carouselIndexSV.value = withSpring(nextTarget, { damping: 18, stiffness: 120 });
  };

  const handlePrevAnnouncement = () => {
    const prevTarget = Math.round(carouselIndexSV.value) - 1;
    carouselIndexSV.value = withSpring(prevTarget, { damping: 18, stiffness: 120 });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#167A70', '#58AAA0', '#C7E3DF', '#F5FAF9']}
        locations={[0, 0.3, 0.65, 1]}
        style={styles.mainBackground}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.modernLogoCircle}>
              <FontAwesome5 name="heartbeat" size={20} color="#167A70" />
            </View>
            <Text style={styles.logoText}>MedStaff</Text>
          </View>
        </View>

        {/* --- CALENDAR WIDGET --- */}
        <View style={styles.calendarHeader}>
          <Text style={styles.monthText}>{currentMonthYear}</Text>
          <TouchableOpacity style={styles.monthFilter}>
            <Text style={styles.monthFilterText}>This Month</Text>
            <Feather name="chevron-down" size={16} color="#7bc1b7" />
          </TouchableOpacity>
        </View>

        <GestureHandlerRootView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
            <GestureDetector gesture={passiveGesture}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {days.map((item, index) => (
                  <InteractiveDayCard key={index} item={item} index={index} activeIndexSV={activeIndexSV} touchX={touchX} isTouched={isTouched} />
                ))}
              </View>
            </GestureDetector>
          </ScrollView>
        </GestureHandlerRootView>

        {/* --- MAIN ABSENSI CARD --- */}
        <LinearGradient 
          colors={['#7bc1b7', '#0b8fac']} 
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.statusCard}
        >
          <View style={[styles.decorCircle, { top: -30, right: -30, width: 120, height: 120 }]} />
          <View style={[styles.decorCircle, { bottom: -40, left: -40, width: 160, height: 160 }]} />

          <View style={styles.statusCardContent}>
            <View style={styles.statusCardTop}>
              <View>
                <Text style={styles.statusSubtitle}>Clock In</Text>
                <Text style={styles.statusTitle}>07:45 <Text style={{fontSize: 14, fontWeight: 'normal'}}>WIB</Text></Text>
              </View>
              <View style={styles.activeBadge}>
                <View style={styles.activeBadgeDot} />
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>

            <View style={[styles.statusCardBottom, { width: '100%', gap: 12 }]}>
              <TouchableOpacity style={[styles.clockOutBtn, { flex: 1, justifyContent: 'center', paddingHorizontal: 10 }]} onPress={() => navigation.navigate('Attendance')}>
                <MaterialIcons name="login" size={16} color="#0b8fac" />
                <Text style={styles.clockOutText} numberOfLines={1}>Clock In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.clockOutBtn, { flex: 1, justifyContent: 'center', paddingHorizontal: 10 }]} onPress={() => navigation.navigate('Attendance')}>
                <Text style={styles.clockOutText} numberOfLines={1}>Clock Out</Text>
                <MaterialIcons name="logout" size={16} color="#0b8fac" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* --- QUICK ACCESS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.quickMenuScroll}
        >
          <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Attendance')} activeOpacity={0.7}>
            <AppIcon3D IconFamily={FontAwesome5} iconName="fingerprint" colors={['#4ade80', '#16a34a']} />
            <Text style={styles.quickMenuText}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Riwayat')} activeOpacity={0.7}>
            <AppIcon3D IconFamily={FontAwesome5} iconName="clock" colors={['#60a5fa', '#2563eb']} />
            <Text style={styles.quickMenuText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickMenuItem} activeOpacity={0.7}>
            <AppIcon3D IconFamily={FontAwesome5} iconName="calendar-day" colors={['#fb923c', '#ea580c']} />
            <Text style={styles.quickMenuText}>Leave</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickMenuItem} activeOpacity={0.7}>
            <AppIcon3D IconFamily={FontAwesome5} iconName="exchange-alt" colors={['#c084fc', '#7c3aed']} />
            <Text style={styles.quickMenuText}>Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickMenuItem} activeOpacity={0.7}>
            <AppIcon3D IconFamily={FontAwesome5} iconName="stopwatch" colors={['#fbbf24', '#d97706']} />
            <Text style={styles.quickMenuText}>Overtime</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickMenuItem} activeOpacity={0.7}>
            <AppIcon3D IconFamily={FontAwesome5} iconName="chart-line" colors={['#f43f5e', '#e11d48']} />
            <Text style={styles.quickMenuText}>Activity</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* --- ANNOUNCEMENTS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          <TouchableOpacity>
            <Text style={styles.lihatSemuaText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.carouselContainerWrapper}>
          
          <TouchableOpacity style={[styles.carouselSideBtn, { left: 0 }]} onPress={handlePrevAnnouncement} activeOpacity={0.6}>
            <View style={styles.carouselIconCircle}>
              <Feather name="chevron-left" size={20} color="#0b8fac" />
            </View>
          </TouchableOpacity>

          <GestureHandlerRootView style={styles.carouselStackAreaContainer}>
            <GestureDetector gesture={carouselPanGesture}>
              <View style={styles.carouselStackArea}>
                {MOCK_ANNOUNCEMENTS.map((item, index) => (
                  <StackedAnnouncementCard 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    carouselIndexSV={carouselIndexSV} 
                    totalItems={TOTAL_ANNOUNCEMENTS}
                  />
                ))}
              </View>
            </GestureDetector>
          </GestureHandlerRootView>

          <TouchableOpacity style={[styles.carouselSideBtn, { right: 0 }]} onPress={handleNextAnnouncement} activeOpacity={0.6}>
            <View style={styles.carouselIconCircle}>
              <Feather name="chevron-right" size={20} color="#0b8fac" />
            </View>
          </TouchableOpacity>
          
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6f8' }, 
  mainBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
  scrollContent: { paddingBottom: 110 }, 
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }, 
  modernLogoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 }}) },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 20 },
  monthText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  monthFilter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthFilterText: { fontSize: 13, color: '#7bc1b7', fontWeight: '600' },
  calendarScroll: { paddingHorizontal: 20, marginBottom: 24, paddingVertical: 10 },
  
  dayCardWrapper: { width: 54, height: 74, elevation: 6, shadowColor: '#0b8fac', shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  dayCardBase: { flex: 1, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardContent: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  
  dayName: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  dayNumber: { fontSize: 16, fontWeight: 'bold' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ffffff', marginTop: 4 },

  statusCard: { marginHorizontal: 20, borderRadius: 28, marginBottom: 28, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#0b8fac', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12 }, android: { elevation: 8 }}) },
  decorCircle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999 },
  statusCardContent: { padding: 24, zIndex: 10 },
  statusCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  statusSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  statusTitle: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  activeBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80', marginRight: 6 },
  activeBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  statusCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  jamMasukLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 },
  jamMasukTime: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  clockOutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, gap: 8, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 }}) },
  clockOutText: { color: '#0b8fac', fontWeight: 'bold', fontSize: 14 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  lihatSemuaText: { fontSize: 13, color: '#0b8fac', fontWeight: '600' },
  
  quickMenuScroll: { paddingHorizontal: 20, marginBottom: 24, flexDirection: 'row', gap: 16 },
  quickMenuItem: { width: 82, alignItems: 'center', gap: 8 },
  gridMenuIconBox: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  quickMenuText: { fontSize: 12, fontWeight: '600', color: '#374151', textAlign: 'center' },

  // --- STACKED CAROUSEL CONTROLS ---
  carouselContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 10,
    height: 220, 
  },
  carouselSideBtn: {
    width: 38,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
  },
  carouselIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 }, 
      android: { elevation: 2 }
    })
  },

  // --- STACKED CAROUSEL AREA ---
  carouselStackAreaContainer: {
    flex: 1,
    height: '100%',
    marginHorizontal: 4, 
  },
  carouselStackArea: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    transform: [{ translateX: -4 }], // Ini akan membantu centering jika absolute children memiliki auto-margin
  },
  newsCard: { 
    width: CARD_WIDTH, // Menggunakan konstanta lebar kartu
    height: 200,         
    backgroundColor: '#ffffff', 
    borderRadius: 24, 
    overflow: 'hidden', 
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 }, 
      android: { elevation: 4 }
    }) 
  },
  newsImageContainer: { 
    width: '100%', 
    height: 96, 
    position: 'relative' 
  },
  newsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgePenting: { position: 'absolute', top: 12, left: 12, backgroundColor: '#b91c1c', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  badgePentingText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  
  newsContent: { padding: 16 }, 
  newsDate: { fontSize: 12, color: '#0b8fac', fontWeight: '600', marginBottom: 4 },
  newsTitle: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', marginBottom: 4, lineHeight: 20 },
  newsDesc: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
});