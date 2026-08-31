import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MedStaffIcon from '../components/MedStaffIcon';
import { useNavigation } from '@react-navigation/native';

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Background Gradient Header */}
      <LinearGradient
        colors={['#7BC1B7', '#0B8FAC', '#f9f9f9']}
        locations={[0, 0.4, 0.9]}
        style={[styles.headerBackground, { height: 350 }]}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- HEADER --- */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MedStaffIcon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Attendance</Text>
          <Text style={styles.subtitle}>Manage your work hours efficiently</Text>
        </View>

        {/* --- LIQUID GLASS ACTION CARDS --- */}
        <View style={styles.actionRow}>
          
          {/* Clock In Card */}
          <TouchableOpacity 
            style={styles.cardWrapper} 
            activeOpacity={0.85}
            onPress={() => {
              Alert.alert("Info", "Clock In action triggered!");
              navigation.navigate('AttendanceCamera', { type: 'in' });
            }} 
          >
            <LinearGradient
              colors={['#7BC1B7', '#0B8FAC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassCardPrimary}
            >
              {/* Liquid Highlight Effect */}
              <View style={styles.liquidHighlightLight} />
              
              <View style={styles.iconCirclePrimary}>
                {/* DIUBAH KEMBALI KE clock-in AGAR TYPESCRIPT VALID */}
                <MedStaffIcon name="clock-in" size={22} color="#ffffff" />
              </View>
              <Text style={styles.cardTextWhite}>Clock In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Clock Out Card */}
          <TouchableOpacity 
            style={styles.cardWrapper} 
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AttendanceCamera', { type: 'out' })} 
          >
            <View style={styles.glassCardSecondary}>
              {/* Liquid Highlight Effect */}
              <View style={styles.liquidHighlightDark} />

              <View style={styles.iconCircleSecondary}>
                {/* DIUBAH KEMBALI KE clock-out AGAR TYPESCRIPT VALID */}
                <MedStaffIcon name="clock-out" size={22} color="#0B8FAC" />
              </View>
              <Text style={styles.cardTextDark}>Clock Out</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* --- REQUIREMENTS SECTION --- */}
        <View style={styles.reqCard}>
          <Text style={styles.reqTitle}>ATTENDANCE REQUIREMENTS</Text>
          
          {/* Item 1: Selfie Photo */}
          <View style={styles.reqItem}>
            <View style={[styles.reqIconBg, { backgroundColor: '#e0f2fe' }]}>
              <MedStaffIcon name="camera" size={20} color="#0284c7" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Selfie Photo</Text>
              <Text style={styles.reqItemSub}>Uniform required</Text>
            </View>
            <MedStaffIcon name="chevron-right" size={24} color="#ccc" />
          </View>

          {/* Item 2: GPS Location */}
          <View style={styles.reqItem}>
            <View style={[styles.reqIconBg, { backgroundColor: '#d1fae5' }]}>
              <MedStaffIcon name="location" size={20} color="#059669" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>GPS Location</Text>
              <Text style={styles.reqItemSub}>{'<'} 50m radius</Text>
            </View>
            <MedStaffIcon name="chevron-right" size={24} color="#ccc" />
          </View>

          {/* Item 3: Server Time */}
          <View style={[styles.reqItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.reqIconBg, { backgroundColor: '#f5f5f4' }]}>
              <MedStaffIcon name="server" size={20} color="#57534e" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Server Time</Text>
              <Text style={styles.reqItemSub}>Auto-sync</Text>
            </View>
            <MedStaffIcon name="success" size={24} color="#a3e635" />
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0 },
  header: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  
  // --- COMPACT ACTION CARDS (LIQUID GLASS STYLE) ---
  actionRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    marginTop: 20, 
    gap: 16 
  },
  cardWrapper: { 
    flex: 1, 
    aspectRatio: 1.1, 
    maxHeight: 140, 
  },
  
  // PRIMARY CLOCK IN CARD
  glassCardPrimary: { 
    flex: 1, 
    borderRadius: 24, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    ...Platform.select({ 
      ios: { shadowColor: '#0b8fac', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12 }, 
      android: { elevation: 6 }
    })
  },
  liquidHighlightLight: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    height: '55%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  iconCirclePrimary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 2,
  },
  cardTextWhite: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '700', 
    zIndex: 2 
  },

  // SECONDARY CLOCK OUT CARD
  glassCardSecondary: { 
    flex: 1, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    overflow: 'hidden',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, 
      android: { elevation: 2 }
    }) 
  },
  liquidHighlightDark: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    height: '55%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  iconCircleSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 2,
  },
  cardTextDark: { 
    color: '#1f2937', 
    fontSize: 16, 
    fontWeight: '700', 
    zIndex: 2 
  },

  // --- REQUIREMENTS CARD (ORIGINAL) ---
  reqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 24, borderRadius: 24, padding: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 }}) },
  reqTitle: { fontSize: 12, fontWeight: '700', color: '#4b5563', marginBottom: 20, letterSpacing: 0.5 },
  reqItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  reqIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reqTextContainer: { flex: 1, marginLeft: 16 },
  reqItemTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  reqItemSub: { fontSize: 12, color: '#6b7280' },
});