import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Background Gradient Header */}
      <LinearGradient
        colors={['#10B981', '#0D9488', '#f9f9f9']}
        locations={[0, 0.4, 0.8]}
        style={[styles.headerBackground, { height: 350 }]}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- HEADER --- */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Absensi</Text>
          <Text style={styles.subtitle}>Kelola kehadiran Anda hari ini</Text>
        </View>

        {/* --- ACTION BUTTONS (MULAI & SELESAI KERJA) --- */}
        <View style={styles.actionContainer}>
          {/* Button Mulai Kerja */}
         <TouchableOpacity 
  style={styles.actionButtonWrapper} 
  activeOpacity={0.8}
  onPress={() => {
    // 1. Munculkan Pop-up di layar HP
    Alert.alert("Info", "Tombol Mulai Kerja Berhasil Ditekan!");
    
    // 2. Jalankan Navigasi
    navigation.navigate('AttendanceCamera', { type: 'in' });
  }} 
>
            <LinearGradient
              colors={['#10B981', '#0D9488']}
              style={styles.btnMulaiKerja}
            >
              <View style={styles.circlePlaceholder}>
                <MaterialIcons name="login" size={24} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.btnTextLight}>Mulai</Text>
                <Text style={styles.btnTextBoldWhite}>Kerja</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Button Selesai Kerja */}
          <TouchableOpacity 
  style={styles.actionButtonWrapper} 
  activeOpacity={0.8}
  onPress={() => navigation.navigate('AttendanceCamera', { type: 'out' })} // Navigasi ke kamera
>
            <View style={styles.btnSelesaiKerja}>
              <View style={styles.iconSelesaiContainer}>
                <MaterialIcons name="logout" size={24} color="#666666" />
              </View>
              <View>
                <Text style={styles.btnTextLightDark}>Selesai</Text>
                <Text style={styles.btnTextBoldDark}>Kerja</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* --- REQUIREMENTS SECTION --- */}
        <View style={styles.reqCard}>
          <Text style={styles.reqTitle}>PERSYARATAN ABSENSI</Text>
          
          {/* Item 1: Foto Selfie */}
          <View style={styles.reqItem}>
            <View style={[styles.reqIconBg, { backgroundColor: '#e0f2fe' }]}>
              <MaterialIcons name="camera-alt" size={20} color="#0284c7" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Foto Selfie</Text>
              <Text style={styles.reqItemSub}>Wajib menggunakan seragam</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </View>

          {/* Item 2: Lokasi GPS */}
          <View style={styles.reqItem}>
            <View style={[styles.reqIconBg, { backgroundColor: '#d1fae5' }]}>
              <MaterialIcons name="location-on" size={20} color="#059669" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Lokasi GPS</Text>
              <Text style={styles.reqItemSub}>Radius maks. 50m dari klinik</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </View>

          {/* Item 3: Waktu Server */}
          <View style={[styles.reqItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.reqIconBg, { backgroundColor: '#f5f5f4' }]}>
              <MaterialIcons name="dns" size={20} color="#57534e" />
            </View>
            <View style={styles.reqTextContainer}>
              <Text style={styles.reqItemTitle}>Waktu Server</Text>
              <Text style={styles.reqItemSub}>Sinkronisasi otomatis</Text>
            </View>
            <MaterialIcons name="check-circle" size={24} color="#a3e635" />
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0 },
  // justify content diubah ke flex-start karena icon profil dihapus
  header: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  
  actionContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 30, gap: 16 },
  actionButtonWrapper: { flex: 1, height: 160 },
  btnMulaiKerja: { flex: 1, borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  circlePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  btnTextLight: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500' },
  btnTextBoldWhite: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginTop: 2 },
  
  btnSelesaiKerja: { flex: 1, borderRadius: 24, backgroundColor: '#ffffff', padding: 20, justifyContent: 'space-between', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 }}) },
  iconSelesaiContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f4f4f5', justifyContent: 'center', alignItems: 'center' },
  btnTextLightDark: { color: '#6b7280', fontSize: 14, fontWeight: '500' },
  btnTextBoldDark: { color: '#374151', fontSize: 22, fontWeight: 'bold', marginTop: 2 },

  reqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 30, borderRadius: 24, padding: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 }}) },
  reqTitle: { fontSize: 12, fontWeight: '700', color: '#4b5563', marginBottom: 20, letterSpacing: 0.5 },
  reqItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  reqIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reqTextContainer: { flex: 1, marginLeft: 16 },
  reqItemTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  reqItemSub: { fontSize: 12, color: '#6b7280' },
});