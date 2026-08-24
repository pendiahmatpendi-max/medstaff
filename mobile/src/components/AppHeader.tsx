import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP1Z_s-w-GNvnFvb1CigqL3Qxn1ZxCavpezhhRb2XkQDrkEwRT-ebHnbgPq3Kmrcg1xyIEPwbfu19j6t6le-5vWd2xY3b2oK5fyNlEAREtK832nvMmpqDUkoHYit0VwokjDYThr67xV1WI_5FiyiIxDftKjJYGiVgRT3c-Fo6h3Hj2D5fPZ4quYbNnSJBP0rU1CG5QFczOfr4MPamCku2P9TonUR0JjL_a7ueh8r4z5uKaU4Mys1Y6dkPGFk6_jVcbsw4' }}
          style={styles.logo}
        />
        <Text style={styles.title}>MedStaff</Text>
      </View>
      <TouchableOpacity style={styles.notifButton}>
        <MaterialIcons name="notifications-none" size={24} color={colors.onSurfaceVariant} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 32, height: 32, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  notifButton: { padding: 8 },
});