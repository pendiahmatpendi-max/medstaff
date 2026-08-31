import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedStaffIcon from '../components/MedStaffIcon';

export default function RiwayatScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <MedStaffIcon name="chevron-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Absensi</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MedStaffIcon name="calendar" size={20} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* MONTHLY SUMMARY */}
        <Text style={styles.sectionTitle}>Ringkasan Bulan Ini</Text>
        <View style={styles.summaryContainer}>
          {/* Card Hadir */}
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBg, { backgroundColor: '#d1fae5' }]}>
              <MedStaffIcon name="success" size={18} color="#059669" />
            </View>
            <Text style={styles.summaryLabel}>Hadir</Text>
            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryValue}>18</Text>
              <Text style={styles.summaryUnit}>hr</Text>
            </View>
          </View>

          {/* Card Terlambat */}
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBg, { backgroundColor: '#ffedd5' }]}>
              <MedStaffIcon name="history" size={18} color="#ea580c" />
            </View>
            <Text style={styles.summaryLabel}>Terlambat</Text>
            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryValue}>2</Text>
              <Text style={styles.summaryUnit}>hr</Text>
            </View>
          </View>
        </View>

        {/* RECORDS: MINGGU INI */}
        <View style={styles.groupHeader}>
          <Text style={styles.sectionTitle}>Minggu Ini</Text>
          <Text style={styles.dateRange}>Okt 16 - 22</Text>
        </View>

        {/* Card: Normal (Tepat Waktu) */}
        <View style={[styles.recordCard, { borderLeftColor: '#10b981' }]}>
          <View style={styles.recordHeader}>
            <View>
              <Text style={styles.recordDate}>Senin, 16 Okt 2023</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                <Text style={[styles.statusText, { color: '#059669' }]}>Tepat Waktu</Text>
              </View>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>8h 15m</Text>
            </View>
          </View>
          
          <View style={styles.timeBox}>
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>Masuk</Text>
              <Text style={styles.timeValue}>07:45</Text>
            </View>
            <MedStaffIcon name="arrow-right" size={16} color="#9ca3af" />
            <View style={styles.timeColRight}>
              <Text style={styles.timeLabel}>Keluar</Text>
              <Text style={styles.timeValue}>16:00</Text>
            </View>
          </View>
        </View>

        {/* Card: Terlambat */}
        <View style={[styles.recordCard, { borderLeftColor: '#f97316' }]}>
          <View style={styles.recordHeader}>
            <View>
              <Text style={styles.recordDate}>Selasa, 17 Okt 2023</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#f97316' }]} />
                <Text style={[styles.statusText, { color: '#c2410c' }]}>Terlambat (15m)</Text>
              </View>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>8h 00m</Text>
            </View>
          </View>
          
          <View style={styles.timeBox}>
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>Masuk</Text>
              <Text style={[styles.timeValue, { color: '#ea580c' }]}>08:15</Text>
            </View>
            <MedStaffIcon name="arrow-right" size={16} color="#9ca3af" />
            <View style={styles.timeColRight}>
              <Text style={styles.timeLabel}>Keluar</Text>
              <Text style={styles.timeValue}>16:15</Text>
            </View>
          </View>
        </View>


        {/* RECORDS: MINGGU LALU */}
        <View style={[styles.groupHeader, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Minggu Lalu</Text>
          <Text style={styles.dateRange}>Okt 09 - 15</Text>
        </View>

        {/* Card: Cuti */}
        <View style={[styles.recordCard, { borderLeftColor: '#ef4444' }]}>
          <View style={styles.recordHeader}>
            <View>
              <Text style={styles.recordDate}>Jumat, 13 Okt 2023</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#ef4444' }]} />
                <Text style={[styles.statusText, { color: '#b91c1c' }]}>Cuti Sakit</Text>
              </View>
            </View>
            <View style={styles.iconBadge}>
              <MedStaffIcon name="medical" size={16} color="#9ca3af" />
            </View>
          </View>
        </View>

        {/* Card: Normal (Minggu Lalu) */}
        <View style={[styles.recordCard, { borderLeftColor: '#10b981' }]}>
          <View style={styles.recordHeader}>
            <View>
              <Text style={styles.recordDate}>Kamis, 12 Okt 2023</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                <Text style={[styles.statusText, { color: '#059669' }]}>Tepat Waktu</Text>
              </View>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>8h 10m</Text>
            </View>
          </View>
          
          <View style={styles.timeBox}>
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>Masuk</Text>
              <Text style={styles.timeValue}>07:50</Text>
            </View>
            <MedStaffIcon name="arrow-right" size={16} color="#9ca3af" />
            <View style={styles.timeColRight}>
              <Text style={styles.timeLabel}>Keluar</Text>
              <Text style={styles.timeValue}>16:00</Text>
            </View>
          </View>
        </View>

        {/* LOAD MORE BUTTON */}
        <TouchableOpacity style={styles.loadMoreBtn}>
          <Text style={styles.loadMoreText}>Muat Lebih Banyak</Text>
          <MedStaffIcon name="chevron-down" size={16} color="#0b8fac" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  
  // Summary Cards
  summaryContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  summaryCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#f3f4f6', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 }}) },
  summaryIconBg: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  summaryValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  summaryUnit: { fontSize: 12, color: '#9ca3af', marginLeft: 4, fontWeight: '500' },

  // List Group Header
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dateRange: { fontSize: 12, color: '#0b8fac', fontWeight: '500', marginBottom: 12 },

  // Record Cards
  recordCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6', borderLeftWidth: 4, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 }, android: { elevation: 1 }}) },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recordDate: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '500' },
  
  durationBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  durationText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  iconBadge: { backgroundColor: '#f3f4f6', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  // Time Box
  timeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginTop: 16 },
  timeCol: { alignItems: 'flex-start' },
  timeColRight: { alignItems: 'flex-end' },
  timeLabel: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
  timeValue: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },

  // Load More Button
  loadMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#bbcabf', borderRadius: 16, paddingVertical: 14, marginTop: 16 },
  loadMoreText: { fontSize: 14, fontWeight: '600', color: '#0b8fac' },
});
