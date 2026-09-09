import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList } from '../../App';

type ConfirmRouteProp = RouteProp<RootStackParamList, 'AttendanceConfirmation'>;

export default function AttendanceConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute<ConfirmRouteProp>();
  const insets = useSafeAreaInsets();

  const { photoUri, type, latitude, longitude } = route.params;

  // Dapatkan waktu saat ini
  const now = new Date();
  const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const typeText = type === 'in' ? 'Clock In' : 'Clock Out';

  const handleSubmit = () => {
    // Di sini logika tembak API ke Backend
    // Setelah sukses, kembali ke Beranda (MainTabs)
    // @ts-ignore
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Absensi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Photo Preview */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <View style={styles.timeOverlay}>
            <Text style={styles.timeOverlayText}>{typeText}</Text>
            <Text style={styles.timeOverlayTime}>{timeString}</Text>
          </View>
        </View>

        {/* Location / Map Card */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <MaterialIcons name="location-on" size={20} color="#059669" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.mapTitle}>Lokasi Terverifikasi</Text>
              <Text style={styles.mapSubtitle}>Sesuai dengan koordinat GPS Anda</Text>
            </View>
          </View>
          
          <View style={styles.mapPreviewContainer}>
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          </View>
        </View>

      </ScrollView>

      {/* Floating Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancelText}>Ulangi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
          <Text style={styles.btnSubmitText}>Konfirmasi Absen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  
  photoContainer: { width: '100%', height: 350, borderRadius: 24, overflow: 'hidden', marginBottom: 20, position: 'relative', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }, android: { elevation: 5 }}) },
  photo: { width: '100%', height: '100%' },
  timeOverlay: { position: 'absolute', bottom: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
  timeOverlayText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  timeOverlayTime: { fontSize: 20, color: '#0b8fac', fontWeight: 'bold' },

  mapCard: { backgroundColor: '#fff', borderRadius: 24, padding: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 }}) },
  mapHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  mapTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  mapSubtitle: { fontSize: 12, color: '#6b7280' },
  mapPreviewContainer: { width: '100%', height: 180, borderRadius: 16, overflow: 'hidden' },
  map: { width: '100%', height: '100%' },

  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  btnCancel: { flex: 1, height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: '#f3f4f6', marginRight: 12 },
  btnCancelText: { color: '#4b5563', fontSize: 16, fontWeight: '600' },
  btnSubmit: { flex: 2, height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: '#7bc1b7' },
  btnSubmitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});