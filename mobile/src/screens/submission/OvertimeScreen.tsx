import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- MOCK DATA ---
const RECENT_OVERTIME = [
  {
    id: '1',
    date: '12 Aug 2026',
    shiftTime: '15:00 - 17:30',
    hours: '2h 30m',
    status: 'Approved',
    source: 'self',
  },
  {
    id: '2',
    date: '10 Aug 2026',
    shiftTime: '15:00 - 16:00',
    hours: '1h 00m',
    status: 'Approved',
    source: 'admin',
  },
  {
    id: '3',
    date: '15 Aug 2026',
    shiftTime: '15:00 - 18:00',
    hours: '3h 00m',
    status: 'Pending',
    source: 'self',
  },
  {
    id: '4',
    date: '05 Aug 2026',
    shiftTime: '07:00 - 08:30',
    hours: '1h 30m',
    status: 'Rejected',
    source: 'admin',
  },
];

export default function OvertimeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const renderStatusPill = (status: string) => {
    let bgColor = '#FEF3C7';
    let textColor = '#D97706';

    if (status === 'Approved') {
      bgColor = '#ECFDF5';
      textColor = '#059669';
    } else if (status === 'Rejected') {
      bgColor = '#FEE2E2';
      textColor = '#DC2626';
    }

    return (
      <View style={[styles.statusPill, { backgroundColor: bgColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Overtime</Text>
          <Text style={styles.headerSubtitle}>Manage your extra hours</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* TOP SECTION: REQUEST OVERTIME */}
        <View style={styles.requestSection}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('RequestOvertime');
            }}
          >
            <LinearGradient 
              colors={['#7BC1B7', '#0B8FAC']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.requestCard}
            >
              <View style={styles.requestCardLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="plus" size={20} color="#0B8FAC" />
                </View>
                <Text style={styles.requestCardText}>Request Overtime</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* BOTTOM SECTION: RECENT SUBMISSIONS */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Submissions</Text>
          
          <View style={styles.listContainer}>
            {RECENT_OVERTIME.map((item) => (
              <View key={item.id} style={styles.slimCard}>
                
                {/* Left: Date, shift time, and source indicator */}
                <View style={styles.cardLeft}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.timeText}>{item.shiftTime}</Text>
                  <Text style={[
                    styles.sourceTextBase, 
                    item.source === 'admin' ? styles.adminAssignedText : styles.selfRequestText
                  ]}>
                    {item.source === 'admin' ? 'Admin Assigned' : 'Self Request'}
                  </Text>
                </View>
                
                {/* Center: Total overtime hours */}
                <View style={styles.cardCenter}>
                  <Text style={styles.hoursText}>{item.hours}</Text>
                </View>
                
                {/* Right: Status pill */}
                <View style={styles.cardRight}>
                  {renderStatusPill(item.status)}
                </View>

              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9F9F9' 
  },
  scrollContent: { 
    paddingBottom: 40 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16 
  },
  backButton: { 
    padding: 8, 
    marginLeft: -8 
  },
  headerTextContainer: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1F2937' 
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginTop: 2 
  },
  requestSection: { 
    paddingHorizontal: 20, 
    marginTop: 12,
    marginBottom: 32 
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 22,
    ...Platform.select({ 
      ios: { shadowColor: '#0B8FAC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12 }, 
      android: { elevation: 6 }
    })
  },
  requestCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  requestCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  historySection: {
    paddingHorizontal: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16
  },
  listContainer: {
    gap: 12
  },
  slimCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 }, 
      android: { elevation: 1 }
    })
  },
  cardLeft: {
    flex: 2.2, 
    justifyContent: 'center'
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280'
  },
  sourceTextBase: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6, 
    letterSpacing: 0.3,
  },
  selfRequestText: {
    color: '#9CA3AF'
  },
  adminAssignedText: {
    color: '#0B8FAC' 
  },
  cardCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hoursText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B8FAC'
  },
  cardRight: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  }
});