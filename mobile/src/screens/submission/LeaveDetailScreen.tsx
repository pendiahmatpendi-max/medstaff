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

export default function LeaveDetailScreen({ route }: any) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Get Data from route params
  const leaveData = route?.params?.leaveData;

  // Fallback / Simulated Data
  const data = leaveData || {
    type: 'Annual Leave',
    startDate: '10/08/2026',
    endDate: '12/08/2026',
    duration: '3 Days',
    reason: 'Personal matters regarding family event out of town.',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
  };

  const renderStatusPill = (status: string) => {
    switch(status) {
      case 'approved':
        return (
          <View style={[styles.statusPill, { backgroundColor: '#D1FAE5' }]}>
            <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
            <Text style={[styles.statusText, { color: '#059669' }]}>Approved</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={[styles.statusPill, { backgroundColor: '#FEE2E2' }]}>
            <View style={[styles.statusDot, { backgroundColor: '#DC2626' }]} />
            <Text style={[styles.statusText, { color: '#DC2626' }]}>Rejected</Text>
          </View>
        );
      case 'pending':
      default:
        return (
          <View style={[styles.statusPill, { backgroundColor: '#FEF3C7' }]}>
            <View style={[styles.statusDot, { backgroundColor: '#D97706' }]} />
            <Text style={[styles.statusText, { color: '#D97706' }]}>Pending Approval</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Request Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Leave Request</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Leave Type</Text>
            <Text style={styles.detailValue}>{data.type}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{data.startDate}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>End Date</Text>
            <Text style={styles.detailValue}>{data.endDate}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{data.duration}</Text>
          </View>
        </View>

        {/* Reason Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reason</Text>
          <Text style={styles.reasonText}>{data.reason}</Text>
        </View>

        {/* Status & Approval History Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={{ alignItems: 'flex-start', marginBottom: 24 }}>
            {renderStatusPill(data.status)}
          </View>

          <Text style={styles.sectionTitle}>Approval History</Text>
          <View style={styles.historyContainer}>
            
            {/* Step 1: Staff */}
            <View style={styles.historyStep}>
              <View style={styles.historyIconContainer}>
                <View style={[styles.historyDot, { backgroundColor: '#7BC1B7' }]} />
                <View style={styles.historyLine} />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyRole}>Staff</Text>
                <Text style={styles.historyAction}>Submitted Request</Text>
              </View>
            </View>

            {/* Step 2: Admin/HR */}
            <View style={styles.historyStep}>
              <View style={styles.historyIconContainer}>
                <View style={[styles.historyDot, { backgroundColor: '#FBBF24' }]} />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyRole}>Admin / HR</Text>
                <Text style={[styles.historyAction, { color: '#D97706' }]}>Pending Approval</Text>
              </View>
            </View>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }, android: { elevation: 2 }}) },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
  
  reasonText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },

  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 13, fontWeight: '600' },

  historyContainer: { marginTop: 4 },
  historyStep: { flexDirection: 'row', minHeight: 48 },
  historyIconContainer: { width: 24, alignItems: 'center' },
  historyDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#FFFFFF', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }, android: { elevation: 1 }}) },
  historyLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
  historyContent: { flex: 1, paddingLeft: 12, paddingBottom: 24, justifyContent: 'flex-start', marginTop: -2 },
  historyRole: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  historyAction: { fontSize: 13, color: '#6B7280' },
});