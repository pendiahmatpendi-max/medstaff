import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import MedStaffIcon, { MedStaffIconName } from './MedStaffIcon';
import { useNavigation } from '@react-navigation/native'; // 1. IMPORT HOOK NAVIGASI
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Import tipe navigasi
import { colors } from '../theme/colors';

const menus = [
  { id: 1, icon: 'calendar', label: 'Cuti', color: colors.menuCuti, route: null },
  { id: 2, icon: 'overtime', label: 'Lembur', color: colors.menuLembur, route: null },
  { id: 3, icon: 'attendance', label: 'Presensi', color: colors.menuPresensi, route: 'Attendance' },
  { id: 4, icon: 'swap', label: 'Ganti Shift', color: colors.menuGantiShift, route: null },
  { id: 5, icon: 'history', label: 'Riwayat', color: colors.menuRiwayat, route: 'Riwayat' },
];

export default function QuickMenu() {
  // 3. PANGGIL HOOK NAVIGASI
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleMenuPress = (route: string | null) => {
    if (route) {
      // @ts-ignore - abaikan error ts sementara karena dynamic route
      navigation.navigate(route);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {menus.map((menu) => (
        <View key={menu.id} style={styles.menuItem}>
          <TouchableOpacity 
            style={[styles.iconBtn, { backgroundColor: menu.color.bg }]}
            onPress={() => handleMenuPress(menu.route)} // 4. PANGGIL FUNGSI SAAT DIKLIK
          >
            <MedStaffIcon name={menu.icon as MedStaffIconName} size={24} color={menu.color.text} />
          </TouchableOpacity>
          <Text style={styles.label}>{menu.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 16, paddingHorizontal: 2 },
  menuItem: { alignItems: 'center', width: 72, gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 12, color: colors.onSurfaceVariant, textAlign: 'center', fontWeight: '500' },
});
