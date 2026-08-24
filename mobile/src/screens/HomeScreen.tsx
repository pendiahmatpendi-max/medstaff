import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Data Dummy Kalender
  const days = [
    { day: 'Sen', date: '16', active: false },
    { day: 'Sel', date: '17', active: true },
    { day: 'Rab', date: '18', active: false },
    { day: 'Kam', date: '19', active: false },
    { day: 'Jum', date: '20', active: false },
    { day: 'Sab', date: '21', active: false },
  ];

  return (
    <View style={styles.container}>
      {/* Background Utama (Sesuai HTML: Putih keabu-abuan/Biru sangat muda) */}
     <LinearGradient
  colors={['#167A70', '#58AAA0', '#C7E3DF', '#F5FAF9']}
  locations={[0, 0.3, 0.65, 1]}
  style={styles.mainBackground}
/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}>
        
        {/* --- HEADER PROFILE --- */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image 
              // Ini URL logo MedStaff yang ada di desain HTML awal Anda
              source={require('../../assets/logo.png')} 
              style={styles.logoImage} 
            />
            <Text style={styles.logoText}>MedStaff</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Feather name="bell" size={20} color="#0b8fac" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* --- CALENDAR WIDGET --- */}
        <View style={styles.calendarHeader}>
          <Text style={styles.monthText}>Oktober 2023</Text>
          <TouchableOpacity style={styles.monthFilter}>
            <Text style={styles.monthFilterText}>Bulan Ini</Text>
            <Feather name="chevron-down" size={16} color="#7bc1b7" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
          {days.map((item, index) => {
            if (item.active) {
              return (
                <LinearGradient 
                  key={index}
                  colors={['#7bc1b7', '#0b8fac']} 
                  style={[styles.dayCard, styles.dayCardActive]}
                >
                  <Text style={styles.dayNameActive}>{item.day}</Text>
                  <Text style={styles.dayNumberActive}>{item.date}</Text>
                  <View style={styles.activeDot} />
                </LinearGradient>
              );
            }
            return (
              <TouchableOpacity key={index} style={styles.dayCard}>
                <Text style={styles.dayName}>{item.day}</Text>
                <Text style={styles.dayNumber}>{item.date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* --- MAIN ABSENSI CARD --- */}
        <LinearGradient 
          colors={['#7bc1b7', '#0b8fac']} 
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.statusCard}
        >
          {/* Decorative Circles */}
          <View style={[styles.decorCircle, { top: -30, right: -30, width: 120, height: 120 }]} />
          <View style={[styles.decorCircle, { bottom: -40, left: -40, width: 160, height: 160 }]} />

          <View style={styles.statusCardContent}>
            <View style={styles.statusCardTop}>
              <View>
                <Text style={styles.statusSubtitle}>Status Hari Ini</Text>
                <Text style={styles.statusTitle}>Sedang Bekerja</Text>
              </View>
              <View style={styles.activeBadge}>
                <View style={styles.activeBadgeDot} />
                <Text style={styles.activeBadgeText}>Aktif</Text>
              </View>
            </View>

            <View style={styles.statusCardBottom}>
              <View>
                <Text style={styles.jamMasukLabel}>Jam Masuk</Text>
                <Text style={styles.jamMasukTime}>07:45 <Text style={{fontSize: 14, fontWeight: 'normal'}}>WIB</Text></Text>
              </View>
              <TouchableOpacity 
                style={styles.clockOutBtn}
                onPress={() => navigation.navigate('Attendance')}
              >
                <FontAwesome5 name="sign-out-alt" size={16} color="#0b8fac" />
                <Text style={styles.clockOutText}>Clock Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* --- QUICK ACCESS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          <Feather name="more-horizontal" size={20} color="#9ca3af" />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickMenuScroll}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Attendance')}>
            <View style={styles.menuIconBox}><FontAwesome5 name="fingerprint" size={24} color="#7bc1b7" /></View>
            <Text style={styles.menuLabel}>Presensi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Riwayat')}>
            <View style={styles.menuIconBox}><MaterialIcons name="history" size={28} color="#0b8fac" /></View>
            <Text style={styles.menuLabel}>Riwayat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Feather name="calendar" size={24} color="#f97316" /></View>
            <Text style={styles.menuLabel}>Cuti</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><FontAwesome5 name="exchange-alt" size={20} color="#8b5cf6" /></View>
            <Text style={styles.menuLabel}>Ganti Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><MaterialIcons name="more-time" size={28} color="#f59e0b" /></View>
            <Text style={styles.menuLabel}>Lembur</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* --- PENGUMUMAN (Sesuai Gambar Request Terbaru) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pengumuman</Text>
          <TouchableOpacity>
            <Text style={styles.lihatSemuaText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newsCard} activeOpacity={0.9}>
          <View style={styles.newsImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop' }} 
              style={styles.newsImage} 
            />
            <View style={styles.badgePenting}>
              <Text style={styles.badgePentingText}>PENTING</Text>
            </View>
          </View>
          
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>12 Okt 2023</Text>
            <Text style={styles.newsTitle}>Pembaruan Protokol Kesehatan Klinik</Text>
            <Text style={styles.newsDesc} numberOfLines={2}>Harap perhatikan pembaruan terbaru mengenai standar kebersihan di area pasien rawat jalan mulai minggu...</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6f8' }, // Background abu-abu sangat muda sesuai HTML
  mainBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
  scrollContent: { paddingBottom: 110 }, // Space untuk floating bottom nav
  
  // Header
   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImage: { width: 36, height: 36, resizeMode: 'cover' , borderRadius: 10,},
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#000000', letterSpacing: 0.5 },
  
  notifBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 3 }}) },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: '#fff' },

  // Calendar
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 20 },
  monthText: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  monthFilter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthFilterText: { fontSize: 13, color: '#7bc1b7', fontWeight: '600' },
  calendarScroll: { gap: 8, paddingHorizontal: 20, marginBottom: 24 },
  dayCard: { width: 54, height: 74, backgroundColor: '#ffffff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f3f4f6', marginRight: 0 },
  dayCardActive: { transform: [{ scale: 1.05 }], borderWidth: 0, shadowColor: '#0b8fac', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  dayName: { fontSize: 12, color: '#9ca3af', fontWeight: '600', marginBottom: 4 },
  dayNameActive: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: 4 },
  dayNumber: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  dayNumberActive: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ffffff', marginTop: 4 },

  // Status Card
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

  // Quick Access
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  lihatSemuaText: { fontSize: 13, color: '#0b8fac', fontWeight: '600' },
  quickMenuScroll: { paddingHorizontal: 20, gap: 16, marginBottom: 24 },
  menuItem: { alignItems: 'center', width: 68 },
  menuIconBox: { width: 60, height: 60, backgroundColor: '#ffffff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#f3f4f6', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 }, android: { elevation: 1 }}) },
  menuLabel: { fontSize: 11, color: '#4b5563', fontWeight: '600', textAlign: 'center' },

  // Pengumuman (Sesuai Gambar)
  newsCard: { marginHorizontal: 20, backgroundColor: '#ffffff', borderRadius: 24, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 }, android: { elevation: 4 }}) },
  newsImageContainer: { width: '100%', height: 140, position: 'relative' },
  newsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgePenting: { position: 'absolute', top: 16, left: 16, backgroundColor: '#b91c1c', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  badgePentingText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  newsContent: { padding: 20 },
  newsDate: { fontSize: 12, color: '#0b8fac', fontWeight: '600', marginBottom: 8 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 8, lineHeight: 22 },
  newsDesc: { fontSize: 13, color: '#6b7280', lineHeight: 20 },
});