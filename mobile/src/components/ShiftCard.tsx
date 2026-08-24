import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function ShiftCard() {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Decorative Circles */}
      <View style={[styles.circle, { top: -32, right: -32, width: 128, height: 128 }]} />
      <View style={[styles.circle, { bottom: -32, left: -32, width: 96, height: 96 }]} />
      
      <Text style={styles.date}>Senin, 24 Mei</Text>
      <Text style={styles.shiftName}>Shift Pagi</Text>
      <Text style={styles.subtitle}>Kegiatan Hari Ini</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Lihat Jadwal</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24, borderRadius: 24, overflow: 'hidden', position: 'relative' },
  circle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999 },
  date: { color: colors.onPrimary, fontSize: 14, fontWeight: '600', opacity: 0.9, marginBottom: 4 },
  shiftName: { color: colors.onPrimary, fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: colors.onPrimary, fontSize: 14, opacity: 0.9, marginBottom: 20 },
  button: { backgroundColor: colors.surface, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999 },
  buttonText: { color: colors.onSecondaryContainer, fontSize: 14, fontWeight: '600' },
});