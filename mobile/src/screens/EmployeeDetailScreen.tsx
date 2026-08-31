import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock Data Pegawai Lengkap
const MOCK_EMPLOYEES = [
  { 
    id: '1', 
    name: 'Dr. Sarah Jenkins', 
    role: 'Chief Surgeon', 
    employeeId: 'EMP-1042', 
    clinic: 'Klinik Pratama UNIMUS',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop', 
    statusColor: '#0b8fac' 
  },
  { 
    id: '2', 
    name: 'Michael Chang', 
    role: 'Senior Registered Nurse', 
    employeeId: 'EMP-2891', 
    clinic: 'Klinik Pratama UNIMUS',
    status: 'Aktif',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvXpeXTe11xD_sUsKivpGZRtKHdhU_mkQ2NG3rsvolHvOXjWUXgIOlhTLFyvNLUNR1Ym1tvezBfsapXU05RTTFQ0_R2eIw9jCy9xO-T0m27m9u7Rl4TXaWWyHSTxP2Ixu7OEywYmVvOmX5bniSd0E4Y3e7uJ251YdOcZKhjEEUtFU7RcJ3ToArhkiyUhsCAuA1AG-E1X4khF-fdn7OpwBelyf7gUap-8EBDTU52L6pskCIWqyYWljqag', 
    statusColor: '#10b981' 
  },
  { 
    id: '3', 
    name: 'Dr. Emily Thorne', 
    role: 'Pediatrician', 
    employeeId: 'EMP-0934', 
    clinic: 'Klinik Pratama UNIMUS',
    status: 'Cuti',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCrs92ThEc5ZsEx18iQzKzXUJF2HimGetrWYAlN2hX_iHTp0p-BmF7eaOuhEZxx1oL7E24lU4Sd3ZLs7JdU6zWeRVi16XiCwiKMC7_54PJx43yd2GEVw3qnPXmE9IqUZ1ImoZLopXTnWRy9sj0u72D5uZjK0KpK1Xk3lrmwcq2aVjhZpJ2fNK52COOxAKqSkarkjD8hxBX-AQqZnnaFn1e5_YCr7JqxzC8F0xSdbZpFVUljsDhgHed0g', 
    statusColor: '#f59e0b' 
  },
  { 
    id: '4', 
    name: 'Budi Santoso', 
    role: 'Apoteker', 
    employeeId: 'EMP-3120', 
    clinic: 'Klinik Pratama UNIMUS',
    status: 'Aktif',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    statusColor: '#10b981' 
  },
  { 
    id: '5', 
    name: 'Siti Rahma', 
    role: 'Administrasi', 
    employeeId: 'EMP-4001', 
    clinic: 'Klinik Pratama UNIMUS',
    status: 'Off',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    statusColor: '#6b7280' 
  },
];

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  
  // STATE PENTING: Menyimpan data pegawai yang sedang dipilih untuk ditampilkan di Modal
  const [selectedEmployee, setSelectedEmployee] = useState<typeof MOCK_EMPLOYEES[0] | null>(null);

  // Fitur Filter Pegawai
  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* --- HEADER GRADIENT --- */}
      <LinearGradient 
        colors={['#dceceb', '#f3f6f8']} 
        style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            <View style={styles.logoCircleBg}>
              <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
            </View>
            <Text style={styles.logoText}>MedStaff</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Feather name="bell" size={20} color="#0b8fac" />
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>Daftar Pegawai</Text>
      </LinearGradient>

      {/* --- BODY CONTENT --- */}
      <View style={styles.bodyContainer}>
        
        {/* SEARCH BAR */}
        <View style={styles.searchWrapper}>
          <Feather name="search" size={20} color="#6c7a71" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pegawai..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Feather name="x" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* EMPLOYEE LIST ATAU EMPTY STATE */}
        {filteredEmployees.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {filteredEmployees.map((emp) => (
              <TouchableOpacity 
                key={emp.id} 
                style={styles.card} 
                activeOpacity={0.7}
                // TRIGGER MODAL POPUP DI SINI (Tidak pindah screen)
                onPress={() => setSelectedEmployee(emp)} 
              >
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: emp.avatar }} style={styles.avatar} />
                </View>
                
                <View style={styles.infoWrapper}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText} numberOfLines={1}>{emp.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: emp.statusColor }]} />
                  </View>
                  <Text style={styles.roleText} numberOfLines={1}>{emp.role}</Text>
                  <Text style={styles.idText}>{emp.employeeId}</Text>
                </View>

                <Feather name="chevron-right" size={20} color="#bbcabf" style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          /* --- EMPTY STATE --- */
          <View style={styles.emptyStateContainer}>
            <View style={styles.illustrationWrapper}>
              <View style={styles.illustrationCircleLarge}>
                <View style={styles.illustrationCircleSmall}>
                  <Feather name="user-x" size={48} color="#0b8fac" />
                </View>
              </View>
              <View style={styles.errorBadge}>
                <Feather name="x" size={14} color="#fff" />
              </View>
            </View>

            <Text style={styles.emptyTitle}>Pegawai tidak ditemukan</Text>
            <Text style={styles.emptyDesc}>
              Maaf, kami tidak dapat menemukan hasil untuk pencarian Anda. Silakan coba kata kunci lain.
            </Text>

            <TouchableOpacity style={styles.resetBtn} activeOpacity={0.8} onPress={() => setSearchQuery('')}>
              <MaterialIcons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.resetBtnText}>Reset Pencarian</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ==================================================
          COMPACT MODAL POPUP (EMPLOYEE PREVIEW)
          Hanya muncul jika selectedEmployee tidak null
          ================================================== */}
      <Modal
        visible={!!selectedEmployee}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedEmployee(null)} // Support tombol back bawaan Android
      >
        {/* Backdrop Semitransparan (Klik luar card untuk tutup) */}
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setSelectedEmployee(null)}
        >
          {/* Card Modal di Tengah Layar */}
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            
            {/* Foto Penuh */}
            <Image source={{ uri: selectedEmployee?.avatar }} style={styles.modalImage} />
            
            {/* Tombol X Kanan Atas */}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedEmployee(null)}>
              <Feather name="x" size={20} color="#ffffff" />
            </TouchableOpacity>

            {/* Gradient Bawah Gelap agar Teks Terbaca */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
              locations={[0, 0.4, 1]}
              style={styles.modalGradient}
            />

            {/* Informasi di Atas Foto */}
            <View style={styles.modalContent}>
              
              <View style={styles.modalNameRow}>
                <Text style={styles.modalName} numberOfLines={1}>{selectedEmployee?.name}</Text>
                <MaterialIcons name="verified" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
              </View>

              <Text style={styles.modalRole}>{selectedEmployee?.role}</Text>

              <View style={styles.modalClinicRow}>
                <MaterialIcons name="my-location" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.modalClinic}>{selectedEmployee?.clinic}</Text>
              </View>

              {/* Baris Badge ID dan Status Aktif */}
              <View style={styles.modalBadgeRow}>
                <View style={styles.badgePill}>
                  <Feather name="hash" size={12} color="#ffffff" />
                  <Text style={styles.badgeText}>{selectedEmployee?.employeeId}</Text>
                </View>
                
                <View style={styles.badgePill}>
                  <View style={[styles.statusDot, { backgroundColor: selectedEmployee?.statusColor, marginRight: 6 }]} />
                  <Text style={styles.badgeText}>{selectedEmployee?.status}</Text>
                </View>
              </View>

            </View>

          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6f8' },
  
  // Header
  headerContainer: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircleBg: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: 22, height: 22, resizeMode: 'contain' },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#0b8fac', letterSpacing: 0.5 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }, android: { elevation: 2 }}) },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },

  bodyContainer: { flex: 1, paddingHorizontal: 20 },

  // Search Bar
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 30, paddingHorizontal: 16, height: 52, marginTop: -20, marginBottom: 20, borderWidth: 1, borderColor: '#e5e7eb', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 3 }}) },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: '100%', fontSize: 15, color: '#1f2937' },
  clearBtn: { padding: 4 },

  // List Pegawai
  scrollContent: { paddingBottom: 110, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(187, 202, 191, 0.3)', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5 }, android: { elevation: 1 }}) },
  avatarWrapper: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: 'rgba(187, 202, 191, 0.2)', overflow: 'hidden', marginRight: 14 },
  avatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoWrapper: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  nameText: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  roleText: { fontSize: 13, color: '#4b5563', marginBottom: 2 },
  idText: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  chevron: { marginLeft: 10, opacity: 0.5 },

  // Empty State
  emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60, paddingHorizontal: 20 },
  illustrationWrapper: { position: 'relative', marginBottom: 24 },
  illustrationCircleLarge: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center' },
  illustrationCircleSmall: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(16, 185, 129, 0.15)', justifyContent: 'center', alignItems: 'center' },
  errorBadge: { position: 'absolute', bottom: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#f3f6f8' },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#2f3131', marginBottom: 12, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: '#6c7a71', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 10 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, gap: 8, ...Platform.select({ ios: { shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 }}) },
  resetBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

  // ==================================================
  // MODAL STYLES
  // ==================================================
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Backdrop dimmed 50%
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%', // Lebar compact (tidak memenuhi layar)
    aspectRatio: 3 / 4, // Rasio foto portrait 
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20 },
      android: { elevation: 15 }
    })
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  modalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalName: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalRole: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
  },
  modalClinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalClinic: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 6,
    fontWeight: '500',
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});