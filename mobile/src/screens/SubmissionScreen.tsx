import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// ==================================================
// TYPES & MOCK DATA
// ==================================================
type SubmissionStatus = 'Pending Approval' | 'Approved' | 'Rejected';

interface Submission {
  id: string;
  type: string;
  date: string;
  status: SubmissionStatus;
  iconName: string;
  iconColors: [string, string];
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    type: "Leave",
    date: "20–22 August 2026",
    status: "Pending Approval",
    iconName: "calendar-day",
    iconColors: ["#fb923c", "#ea580c"]
  },
  {
    id: "2",
    type: "Overtime",
    date: "18 August 2026 · 2 hours",
    status: "Approved",
    iconName: "stopwatch",
    iconColors: ["#fbbf24", "#d97706"]
  },
  {
    id: "3",
    type: "Attendance",
    date: "15 August 2026",
    status: "Rejected",
    iconName: "user-check",
    iconColors: ["#4ade80", "#16a34a"]
  },
];

// ==================================================
// REUSABLE COMPONENT: 3D APP ICON
// ==================================================
const AppIcon3D = ({ iconName, colors, size = 48, iconSize = 20 }: { iconName: string, colors: [string, string], size?: number, iconSize?: number }) => {
  return (
    <View style={[styles.icon3DContainer, { width: size, height: size, backgroundColor: colors[1] }]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.icon3DHighlight, { height: size * 0.55 }]} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.2)']} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      
      <FontAwesome5 name={iconName} size={iconSize} color="#ffffff" solid style={styles.icon3DObject} />
    </View>
  );
};

// ==================================================
// MAIN SCREEN
// ==================================================
export default function SubmissionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Status pill colours
  const getStatusColor = (status: SubmissionStatus) => {
    switch(status) {
      case 'Pending Approval': return { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' }; // Amber
      case 'Approved': return { bg: '#dcfce7', text: '#16a34a', dot: '#22c55e' }; // Green
      case 'Rejected': return { bg: '#fee2e2', text: '#dc2626', dot: '#ef4444' }; // Red
      default: return { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' };
    }
  };

  return (
    <View style={styles.container}>
      
      {/* --- HEADER SANGAT SEDERHANA --- */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#F9F9F9' }}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submissions</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- HERO SUMMARY CARD --- */}
        <LinearGradient 
          colors={['#7bc1b7', '#0b8fac']} 
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Decorative Background Visuals */}
          <View style={[styles.decorCircle, { top: -40, right: -20, width: 150, height: 150 }]} />
          <View style={[styles.decorCircle, { bottom: -50, left: -30, width: 120, height: 120, opacity: 0.05 }]} />
          
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>Submission Summary</Text>
            <TouchableOpacity>
              <Text style={styles.heroCta}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatValue, { color: '#fef3c7' }]}>2</Text>
              <Text style={styles.heroStatLabel}>Pending</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatValue, { color: '#dcfce7' }]}>5</Text>
              <Text style={styles.heroStatLabel}>Approved</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatValue, { color: '#fee2e2' }]}>1</Text>
              <Text style={styles.heroStatLabel}>Rejected</Text>
            </View>
          </View>
        </LinearGradient>

        {/* --- SECTION: BUAT PENGAJUAN (HORIZONTAL SCROLL) --- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalShortcutContent}
        >
          <TouchableOpacity style={styles.shortcutItem} activeOpacity={0.7}>
            <AppIcon3D iconName="calendar-day" colors={['#fb923c', '#ea580c']} size={50} iconSize={24} />
            <Text style={styles.shortcutItemText}>Leave</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shortcutItem} activeOpacity={0.7}>
            <AppIcon3D iconName="user-check" colors={['#4ade80', '#16a34a']} size={50} iconSize={24} />
            <Text style={styles.shortcutItemText}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shortcutItem} activeOpacity={0.7}>
            <AppIcon3D iconName="exchange-alt" colors={['#c084fc', '#7c3aed']} size={50} iconSize={24} />
            <Text style={styles.shortcutItemText}>Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shortcutItem} activeOpacity={0.7}>
            <AppIcon3D iconName="stopwatch" colors={['#fbbf24', '#d97706']} size={50} iconSize={24} />
            <Text style={styles.shortcutItemText}>Overtime</Text>
          </TouchableOpacity>
        </ScrollView>
            
        {/* --- SECTION: PENGAJUAN TERBARU (COMPACT LIST) --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Submissions</Text>

          {MOCK_SUBMISSIONS.length > 0 ? (
            <View style={styles.recentList}>
              {MOCK_SUBMISSIONS.map((item) => {
                const statusColors = getStatusColor(item.status);
                // Keep status labels compact for narrow screens.
                return (
                  <TouchableOpacity key={item.id} style={styles.recentCard} activeOpacity={0.7}>
                    
                    {/* Icon Kecil */}
                    <View style={styles.recentIconWrapper}>
                      <AppIcon3D iconName={item.iconName} colors={item.iconColors} size={36} iconSize={14} />
                    </View>

                    {/* Informasi Pengajuan */}
                    <View style={styles.recentContent}>
                      <Text style={styles.recentType}>{item.type}</Text>
                      <Text style={styles.recentDate}>{item.date}</Text>
                    </View>

                    {/* Status Pill (Text Status disembunyikan di layar sangat kecil, diganti flex-end) */}
                    <View style={styles.recentStatusArea}>
                      <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                        <Text style={[styles.statusText, { color: statusColors.text }]} numberOfLines={1}>
                          {item.status === "Pending Approval" ? "Pending" : item.status}
                        </Text>
                      </View>
                    </View>
                    
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* --- EMPTY STATE --- */
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Feather name="file-text" size={28} color="#bbcabf" />
              </View>
              <Text style={styles.emptyTitle}>No submissions yet</Text>
              <Text style={styles.emptySubtitle}>Your submissions will appear here.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // GLOBAL STYLES
  // ==========================================
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 }, // Ditambahkan paddingTop agar ada jarak dari header ke card

  // ==========================================
  // HEADER
  // ==========================================
  headerContent: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', // Title benar-benar center
    paddingHorizontal: 20 
  },
  backBtn: { 
    position: 'absolute', 
    left: 20, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#ffffff', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2 }, 
      android: { elevation: 1 }
    })
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1f2937' 
  },

  // ==========================================
  // 3D ICON COMPONENT
  // ==========================================
  icon3DContainer: { borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  icon3DHighlight: { position: 'absolute', top: -5, left: -10, right: -10, backgroundColor: 'rgba(255,255,255,0.25)', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  icon3DObject: { textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3, zIndex: 10, marginTop: 1 },

  // ==========================================
  // HERO SUMMARY CARD (VISUAL)
  // ==========================================
  heroCard: { 
    borderRadius: 24, // Diubah dari 24 ke 28 agar lebih soft/rounded
    padding: 20, 
    marginBottom: 28, 
    overflow: 'hidden', 
    ...Platform.select({ 
      ios: { shadowColor: '#0b8fac', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12 }, 
      android: { elevation: 6 }
    }) 
  },
  decorCircle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, zIndex: 10 },
  heroTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  heroCta: { fontSize: 12, fontWeight: '600', color: '#ffffff', opacity: 0.9, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  heroStatDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },

  // ==========================================
  // SHORTCUT GRID (HORIZONTAL SCROLL - MINIMAL)
  // ==========================================
  horizontalShortcutContent: { paddingHorizontal: 20, gap: 14, paddingRight: 20, marginBottom: 28 },
  shortcutItem: { alignItems: 'center', justifyContent: 'flex-start', width: 80 },
  shortcutItemText: { fontSize: 11, fontWeight: '600', color: '#1A1C1C', textAlign: 'center', marginTop: 6 },

  // ==========================================
  // RECENT SUBMISSIONS (COMPACT LIST)
  // ==========================================
  sectionContainer: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1C1C', marginBottom: 14 },
  recentList: { gap: 12 },
  recentCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, // Diubah dari 18 ke 20 agar lebih soft/rounded, tapi tetap konsisten
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    borderWidth: 0, 
    ...Platform.select({ 
      ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 }, 
      android: { elevation: 1 }
    }) 
  },
  recentIconWrapper: { marginRight: 12 },
  recentContent: { flex: 1, marginRight: 8 },
  recentType: { fontSize: 15, fontWeight: '600', color: '#1A1C1C', marginBottom: 2 },
  recentDate: { fontSize: 12, color: '#6C7A71' },
  recentStatusArea: { alignItems: 'flex-end' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },

  // ==========================================
  // EMPTY STATE
  // ==========================================
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 32, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, // Diubah dari 20 ke 24 agar selaras dengan roundness card lainnya
    borderWidth: 1, 
    borderColor: '#E2E2E2', 
    borderStyle: 'dashed' 
  },
  emptyIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F3F4', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: '#1A1C1C', marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: '#6C7A71' }
});