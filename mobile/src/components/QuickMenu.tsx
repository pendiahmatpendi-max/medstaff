import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // 1. IMPORT HOOK NAVIGASI
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Import tipe navigasi
import { colors } from '../theme/colors';

const menus = [
  { id: 1, icon: 'event-busy', label: 'Cuti', color: colors.menuCuti, route: null },
  { id: 2, icon: 'more-time', label: 'Lembur', color: colors.menuLembur, route: null },
  { id: 3, icon: 'fingerprint', label: 'Presensi', color: colors.menuPresensi, route: 'Attendance' }, // 2. TAMBAHKAN ROUTE DI SINI
  { id: 4, icon: 'swap-horiz', label: 'Ganti Shift', color: colors.menuGantiShift, route: null },
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
            <MaterialIcons name={menu.icon as any} size={28} color={menu.color.text} />
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
  iconBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 12, color: colors.onSurfaceVariant, textAlign: 'center', fontWeight: '500' },
});