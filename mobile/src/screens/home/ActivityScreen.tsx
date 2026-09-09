import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- MOCK DATA DATE ---
const DATES: any[] = [];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeDate, setActiveDate] = useState('8');

  // Navigasi ke Activity Detail (jika ada)
  const handleActivityPress = () => {
    if (navigation.getState().routeNames.includes('ActivityDetail')) {
      navigation.navigate('ActivityDetail');
    }
  };

  return (
    <View style={styles.container}>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
      >
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hello, Sarah</Text>
            <Text style={styles.dateSubtitle}>Today, 8 Sep</Text>
          </View>
        </View>

        {/* --- CARD 1: HERO BANNER (ACTIVITY 1) --- */}
        <View style={styles.heroSection}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleActivityPress}>
            <LinearGradient
              colors={['#7BC1B7', '#58AAA0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Morning Jogging</Text>
                <Text style={styles.heroSubtitle}>06:00 - 07:00 • Clinic Courtyard</Text>
                
                <View style={styles.statusPillSuccess}>
                  <Text style={styles.statusTextSuccess}>✓ Checked In</Text>
                </View>
              </View>

              {/* 3D Icon Element */}
              <View style={styles.abstract3DContainer}>
                <View style={styles.abstractCircle} />
                <View style={styles.abstractFloatingBox}>
                  <FontAwesome5 name="running" size={28} color="#0B8FAC" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* --- HORIZONTAL DATE PICKER --- */}
        <View style={styles.datePickerSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.dateScrollContent}
          >
            {DATES.length > 0 ? (
              DATES.map((item) => {
                const isActive = activeDate === item.date;
                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.datePill, isActive && styles.datePillActive]}
                    onPress={() => setActiveDate(item.date)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dateDay, isActive && styles.dateDayActive]}>{item.day}</Text>
                    <Text style={[styles.dateNum, isActive && styles.dateNumActive]}>{item.date}</Text>
                    {isActive && <View style={styles.activeDot} />}
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ textAlign: 'center', width: '100%', color: '#9CA3AF' }}>No dates available</Text>
            )}
          </ScrollView>
        </View>

        {/* --- BENTO GRID: OTHER ACTIVITIES --- */}
        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Activities</Text>
            <TouchableOpacity>
              <Feather name="more-horizontal" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.bentoGrid}>
            
            {/* CARD 2: LEFT TALL CARD */}
            <TouchableOpacity style={[styles.bentoCard, styles.bentoLeft]} activeOpacity={0.8} onPress={handleActivityPress}>
              <View style={styles.bentoHeader}>
                <View style={styles.bentoIconLight}>
                  <Feather name="users" size={18} color="#D97706" />
                </View>
                <Feather name="arrow-up-right" size={20} color="#1F2937" />
              </View>

              <View style={styles.bentoLeftContent}>
                <Text style={styles.shiftTitle}>Staff Meeting</Text>
                <Text style={styles.shiftTime}>14:00 - 16:00</Text>
                
                <View style={styles.locationPill}>
                  <Feather name="map-pin" size={12} color="#1F2937" />
                  <Text style={styles.locationText} numberOfLines={1}>Meeting Room 2</Text>
                </View>
              </View>

              <View style={styles.bentoLeftFooter}>
                <View style={styles.statusPillPending}>
                  <Text style={styles.statusTextPending}>Not Checked In</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* RIGHT COLUMN: STACKED CARDS */}
            <View style={styles.bentoRightCol}>
              
              {/* CARD 3: RIGHT TOP SQUARE */}
              <TouchableOpacity style={[styles.bentoCard, styles.bentoRightTop]} activeOpacity={0.8} onPress={handleActivityPress}>
                <View style={styles.bentoHeader}>
                  <View style={styles.bentoIconTeal}>
                    <Feather name="book-open" size={18} color="#0B8FAC" />
                  </View>
                </View>
                <View style={styles.bentoRightTopContent}>
                  <Text style={styles.taskTitle}>Kajian</Text>
                  <Text style={styles.taskTime}>16:00 - 17:00</Text>
                  <Text style={styles.taskLoc} numberOfLines={1}>Meeting Hall</Text>
                </View>
                <View style={[styles.statusPillPending, styles.statusSmall]}>
                  <Text style={styles.statusTextPendingSmall}>Not Checked In</Text>
                </View>
              </TouchableOpacity>

              {/* CARD 4: RIGHT BOTTOM RECTANGLE */}
              <TouchableOpacity style={[styles.bentoCard, styles.bentoRightBottom]} activeOpacity={0.8} onPress={handleActivityPress}>
                <View style={styles.bentoIconSmallTeal}>
                  <FontAwesome5 name="trophy" size={14} color="#0B8FAC" />
                </View>
                <View style={styles.smallCardTextWrapper}>
                  <Text style={styles.smallCardTitle} numberOfLines={1}>Futsal Competition</Text>
                  <Text style={styles.smallCardTime} numberOfLines={1}>18:30</Text>
                  <Text style={styles.smallCardStatus} numberOfLines={1}>Pending</Text>
                </View>
              </TouchableOpacity>

            </View>

          </View>
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Off-white
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  dateSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },

  // --- HERO BANNER (ACTIVITY 1) ---
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  heroCard: {
    width: '100%',
    height: 160,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#7BC1B7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 16,
  },
  statusPillSuccess: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusTextSuccess: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },

  abstract3DContainer: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abstractCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  abstractFloatingBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '15deg' }],
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: -4, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12 },
      android: { elevation: 10 },
    }),
  },

  // --- DATE PICKER PILLS ---
  datePickerSection: {
    marginBottom: 32,
  },
  dateScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  datePill: {
    width: 58,
    height: 85,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 },
      android: { elevation: 1 },
    }),
  },
  datePillActive: {
    backgroundColor: '#0B8FAC', 
    ...Platform.select({
      ios: { shadowColor: '#0B8FAC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  dateDayActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  dateNumActive: {
    color: '#FFFFFF',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },

  // --- BENTO GRID ---
  scheduleSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoCard: {
    borderRadius: 28, 
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  
  // ACTIVITY 2: Left Tall Card
  bentoLeft: {
    flex: 1.1,
    backgroundColor: '#F6F0D7', // Soft Sand / Yellow
    height: 240,
    justifyContent: 'space-between',
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bentoIconLight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoLeftContent: {
    marginTop: 10,
  },
  shiftTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  shiftTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  bentoLeftFooter: {
    marginTop: 10,
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTextPending: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },

  // Right Column
  bentoRightCol: {
    flex: 1,
    gap: 12,
    height: 240,
  },
  
  // ACTIVITY 3: Right Top Square
  bentoRightTop: {
    flex: 1.4,
    backgroundColor: '#E6F4F1',
    justifyContent: 'space-between',
    padding: 16,
    overflow: 'hidden',
  },
  bentoIconTeal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoRightTopContent: {
    marginTop: 2,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B8FAC',
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7BC1B7',
  },
  taskLoc: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  statusSmall: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  statusTextPendingSmall: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '700',
  },

  // ACTIVITY 4: Right Bottom Rectangle
  bentoRightBottom: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bentoIconSmallTeal: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardTextWrapper: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  smallCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  smallCardTime: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  smallCardStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
});