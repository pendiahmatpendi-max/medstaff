import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App'; // Sesuaikan path jika perlu
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CameraRouteProp = RouteProp<RootStackParamList, 'AttendanceCamera'>;

export default function AttendanceCameraScreen() {
  const navigation = useNavigation();
  const route = useRoute<CameraRouteProp>();
  const insets = useSafeAreaInsets();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      // Minta izin lokasi saat komponen dimuat
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan akses lokasi untuk presensi.');
        setIsLocating(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(currentLocation);
      } catch (error) {
        Alert.alert('Error', 'Gagal mendapatkan lokasi GPS.');
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ textAlign: 'center', marginBottom: 16 }}>Kami membutuhkan izin untuk menggunakan kamera.</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={{ color: '#fff' }}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && location) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      
      // Arahkan ke layar konfirmasi dengan membawa data
      // @ts-ignore
      navigation.navigate('AttendanceConfirmation', {
        photoUri: photo?.uri,
        type: route.params.type,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Absensi</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.mainInstruction}>Ambil Selfie</Text>
        <Text style={styles.subInstruction}>Pastikan wajah terlihat dengan jelas.</Text>
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing="front"
        >
          {/* Overlay UI inside Camera */}
          <View style={styles.cameraOverlay}>
            
            {/* Location Status Pill */}
            <View style={[styles.locationBadge, location ? styles.locationSuccess : styles.locationLoading]}>
              {isLocating ? (
                <>
                  <ActivityIndicator size="small" color="#0b8fac" style={{ marginRight: 8 }} />
                  <Text style={styles.locationText}>Mendeteksi lokasi...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name={location ? "check-circle" : "error"} size={16} color={location ? "#059669" : "#dc2626"} style={{ marginRight: 6 }} />
                  <Text style={[styles.locationText, { color: location ? "#059669" : "#dc2626" }]}>
                    {location ? "Lokasi terverifikasi" : "Lokasi tidak ditemukan"}
                  </Text>
                </>
              )}
            </View>

            {/* Face Frame Guide */}
            <View style={styles.faceFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.cameraInstruction}>Posisikan wajah di dalam bingkai</Text>

          </View>
        </CameraView>
      </View>

      {/* Footer Controls */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={[styles.captureBtnInner, (!location || isLocating) && { opacity: 0.5 }]} 
          onPress={takePicture}
          disabled={!location || isLocating} // Disable tombol jika GPS belum dapat
        >
          <View style={styles.captureBtnCore}>
            <MaterialIcons name="photo-camera" size={32} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  permissionBtn: { backgroundColor: '#7bc1b7', padding: 12, borderRadius: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  
  instructionContainer: { alignItems: 'center', paddingVertical: 16 },
  mainInstruction: { fontSize: 24, fontWeight: 'bold', color: '#006277', marginBottom: 4 },
  subInstruction: { fontSize: 14, color: '#6b7280' },

  cameraContainer: { flex: 1, marginHorizontal: 20, borderRadius: 32, overflow: 'hidden', backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  
  locationBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)' },
  locationLoading: { backgroundColor: 'rgba(255,255,255,0.9)' },
  locationSuccess: { backgroundColor: '#d1fae5' },
  locationText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  faceFrame: { width: 220, height: 280, marginTop: 40, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#7bc1b7' },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
  
  cameraInstruction: { color: '#ffffff', fontSize: 12, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 20 },

  footer: { height: 120, justifyContent: 'center', alignItems: 'center' },
  captureBtnInner: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#e2e2e2', justifyContent: 'center', alignItems: 'center' },
  captureBtnCore: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#7bc1b7', justifyContent: 'center', alignItems: 'center' },
});