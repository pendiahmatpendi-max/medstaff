import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      
      {/* --- TOP GRADIENT FADING TO WHITE BACKGROUND --- */}
      <View style={styles.absoluteBackground}>
        <LinearGradient
          colors={['#7BC1B7', '#0B8FAC', 'rgba(11, 143, 172, 0.08)', '#f9f9f9']}
          locations={[0, 0.3, 0.65, 0.9]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }} 
          style={StyleSheet.absoluteFill}
        />
        
        {/* Layered Organic Abstract Shapes (Translucent Blobs - Top Area Only) */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />
        <View style={styles.blob4} />
      </View>

      {/* --- HEADER (Centered Title, Clean Back Arrow) --- */}
      <View style={[styles.header, { height: 60 + insets.top, paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={[styles.backButton, { top: insets.top + (60 - 24) / 2 }]} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}>

        {/* --- COMPACT ACTION CARDS --- */}
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
            <View style={styles.glassCard}>
              <Feather name="log-in" size={24} color="#0B8FAC" />
              <Text style={styles.cardText}>Clock In</Text>
            </View>
          </TouchableOpacity>

          {/* Clock Out Card */}
          <TouchableOpacity 
            style={styles.cardWrapper} 
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AttendanceCamera', { type: 'out' })} 
          >
            <View style={styles.glassCard}>
              <Feather name="log-out" size={24} color="#0B8FAC" />
              <Text style={styles.cardText}>Clock Out</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* --- REQUIREMENTS SECTION --- */}
        <View style={styles.reqCard}>
          <Text style={styles.reqTitle}>ATTENDANCE REQUIREMENTS</Text>
          
          {/* Item 1: Selfie Photo */}
          <View style={styles.reqItem}>
            <View style={[styles.reqIconBg, { backgroundColor: '#E3F2FD' }]}>
              <Feather name="camera" size={20} color="#1976D2" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Selfie Photo</Text>
              <Text style={styles.reqItemSub}>Uniform required</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#BDBDBD" />
          </View>

          {/* Item 2: GPS Location */}
          <View style={styles.reqItem}>
            <View style={[styles.reqIconBg, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="map-pin" size={20} color="#2E7D32" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>GPS Location</Text>
              <Text style={styles.reqItemSub}>{'<'} 50m radius</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#BDBDBD" />
          </View>

          {/* Item 3: Server Time */}
          <View style={[styles.reqItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.reqIconBg, { backgroundColor: '#FFF3E0' }]}>
              <Feather name="server" size={20} color="#F57C00" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Server Time</Text>
              <Text style={styles.reqItemSub}>Auto-sync</Text>
            </View>
            <Feather name="check-circle" size={20} color="#43A047" />
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  
  // --- FADING BACKGROUND & BLOBS ---
  absoluteBackground: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' 
  },
  blob1: {
    position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ scaleX: 1.2 }, { scaleY: 0.9 }, { rotate: '45deg' }]
  },
  blob2: {
    position: 'absolute', top: 100, left: -80, width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)', transform: [{ scaleX: 1.1 }, { scaleY: 1.3 }, { rotate: '-30deg' }]
  },
  blob3: {
    position: 'absolute', top: 180, right: -40, width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)', transform: [{ scaleX: 1.2 }, { scaleY: 1.1 }, { rotate: '20deg' }]
  },
  blob4: {
    position: 'absolute', top: 60, left: 40, width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // --- HEADER & TITLES ---
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  backButton: { 
    position: 'absolute',
    left: 20,
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    zIndex: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  
  // --- COMPACT ACTION CARDS (IDENTICAL LIQUID GLASS MATERIAL) ---
  actionRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    gap: 16 
  },
  cardWrapper: { 
    flex: 1, 
    height: 96, // Compact landscape proportion
  },
  
  // SHARED GLASS MATERIAL FOR BOTH CARDS
  glassCard: { 
    flex: 1, 
    borderRadius: 24, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }, 
      android: { elevation: 2 }
    })
  },
  
  // ORGANIC SOFT REFLECTION (NO RECTANGLES)
  organicHighlight: {
    position: 'absolute',
    top: -45,
    left: -20,
    right: -20,
    height: 85,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ scaleX: 1.4 }]
  },
  cardIcon: {
    marginBottom: 6,
    zIndex: 2
  },
  cardText: { 
    color: '#0B8FAC', 
    fontSize: 14, 
    fontWeight: '700', 
    zIndex: 2 
  },

  // --- REQUIREMENTS CARD ---
  reqCard: { 
    backgroundColor: '#ffffff', 
    marginHorizontal: 20, 
    marginTop: 24, 
    borderRadius: 24, 
    padding: 20, 
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 }, 
      android: { elevation: 4 }
    }) 
  },
  reqTitle: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginBottom: 20, letterSpacing: 0.5 },
  reqItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  reqIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reqTextContainer: { flex: 1, marginLeft: 16 },
  reqItemTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  reqItemSub: { fontSize: 13, color: '#6b7280' },
});