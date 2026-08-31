import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedStaffIcon, { MedStaffIconName } from '../components/MedStaffIcon';
import { useNavigation } from '@react-navigation/native';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: MedStaffIconName;
  value?: string;
  iconColor?: string;
}

interface Section {
  title: string;
  items: MenuItem[];
}

const SECTIONS: Section[] = [
  {
    title: 'My Information',
    items: [
      { id: 'personal', title: 'Personal Information', icon: 'personal', iconColor: '#0b8fac' },
      { id: 'job', title: 'Work Information', icon: 'job', iconColor: '#0b8fac' },
      { id: 'emergency', title: 'Emergency Contact', icon: 'emergency', iconColor: '#e11d48' },
      { id: 'education', title: 'Education and Experience', icon: 'education', iconColor: '#2563eb' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'password', title: 'Change Password', icon: 'password', iconColor: '#374151' },
      { id: 'pin', title: 'PIN', icon: 'pin', iconColor: '#374151' },
      { id: 'lang', title: 'Language', icon: 'language', value: 'English', iconColor: '#374151' },
    ],
  },
  {
    title: 'Help',
    items: [
      { id: 'help', title: 'Help Center', icon: 'help', iconColor: '#059669' },
    ],
  },
  {
    title: 'Others',
    items: [
      { id: 'logout', title: 'Log Out', icon: 'logout', iconColor: '#dc2626' },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const handlePress = (id: string) => {
    if (id === 'logout') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
      return;
    }
    console.log('Navigating to:', id);
  };

  return (
    <View style={styles.container}>
      {/* HEADER BAR (Menyatu dengan Status Bar, sedikit lebih tinggi, title turun) */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* IDENTITY CARD (Surface terpisah) */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKG1SeJPJhMiDhdaooqIPg-sdAWEYfJioTiPn3EHYzpTJgjSklPpU-774NqazN_R1V1t6vfv9BERP7ELXPBWZuUuCez-x3rzxMcC1BLUhwH5s5pO1-vAgU70SEApPZ_KuvpCuSzmoAiApSmc4P6XY2PjBU7C5CES9lLxtMpznjHnstRm4UkkEYFMBVLibgQ8QJeYA9Xmi4GG9Tdh6BwNCKeK3Tg0SALwmi-OhjRHf9c9siJQyUB8pvmA' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>dr. Winter Aespa</Text>
            <Text style={styles.userRole}>Dokter Umum</Text>
            <Text style={styles.userClinic}>Klinik Pratama UNIMUS</Text>
          </View>
        </View>

        {/* LIST MENU SETTINGS / PROFILE */}
        {SECTIONS.map((section, sectionIdx) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.groupCard}>
              {section.items.map((item, itemIdx) => {
                const isLogout = item.id === 'logout';
                const isLast = itemIdx === section.items.length - 1;

                return (
                  <React.Fragment key={item.id}>
                    <TouchableOpacity 
                      style={styles.rowItem} 
                      activeOpacity={0.6}
                      onPress={() => handlePress(item.id)}
                    >
                      <View style={styles.iconWrapper}>
                        <MedStaffIcon 
                          name={item.icon} 
                          size={22} 
                          color={item.iconColor || '#374151'} 
                          variant="filled" 
                        />
                      </View>
                      
                      <View style={styles.rowContent}>
                        <Text style={[styles.rowTitle, isLogout && styles.logoutTitle]}>
                          {item.title}
                        </Text>
                        {item.subtitle && (
                          <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                        )}
                      </View>

                      <View style={styles.rowRight}>
                        {item.value && (
                          <Text style={styles.rowValue}>{item.value}</Text>
                        )}
                        {!isLogout && (
                          <MedStaffIcon name="chevron-right" size={18} color="#9ca3af" />
                        )}
                      </View>
                    </TouchableOpacity>

                    {!isLast && <View style={styles.divider} />}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 20, // Ditambahkan agar area header terasa sedikit lebih tebal/tinggi
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24, 
    paddingBottom: 110,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1C',
    marginBottom: 3,
  },
  userRole: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3C4A42',
    marginBottom: 3,
  },
  userClinic: {
    fontSize: 12,
    color: '#3C4A42',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1C',
  },
  logoutTitle: {
    color: '#dc2626',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#3C4A42',
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C4A42',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
});