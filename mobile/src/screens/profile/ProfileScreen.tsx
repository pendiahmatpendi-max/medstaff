import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MedStaffIcon, { MedStaffIconName } from '../../components/MedStaffIcon';
import { getMyProfile, logout, EmployeeProfile } from '../../api/api';

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

  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMyProfile();
      const data = response?.data ?? response;

      setProfile(data);
    } catch (error) {
      console.error('Gagal mengambil profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handlePress = async (id: string) => {
    if (id === 'personal') {
      navigation.navigate('PersonalInformation');
      return;
    }

    if (id === 'job') {
      navigation.navigate('WorkInformation');
      return;
    }

    if (id === 'emergency') {
      navigation.navigate('EmergencyContact');
      return;
    }

    if (id === 'education') {
      navigation.navigate('EducationExperience');
      return;
    }

    if (id === 'password') {
      navigation.navigate('ChangePassword');
      return;
    }

    if (id === 'pin') {
      navigation.navigate('PIN');
      return;
    }

    if (id === 'lang') {
      navigation.navigate('Language');
      return;
    }

    if (id === 'help') {
      navigation.navigate('HelpCenter');
      return;
    }

    if (id === 'logout') {
      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });

      return;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 24,
          },
        ]}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.profileHeader}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ProfileDetail')}
        >
          {profile?.profilePhoto ? (
            <Image
              source={{ uri: profile.profilePhoto }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MedStaffIcon
                name="profile"
                size={30}
                color="#0b8fac"
              />
            </View>
          )}

          <View style={styles.profileInfo}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#0b8fac"
                style={styles.loadingIndicator}
              />
            ) : (
              <>
                <Text style={styles.userName} numberOfLines={1}>
                  {profile?.fullName || 'Nama belum tersedia'}
                </Text>

                <Text style={styles.userRole} numberOfLines={1}>
                  {profile?.position || 'Posisi belum tersedia'}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {SECTIONS.map((section) => (
          <View
            key={section.title}
            style={styles.sectionContainer}
          >
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>

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
                        <Text
                          style={[
                            styles.rowTitle,
                            isLogout && styles.logoutTitle,
                          ]}
                        >
                          {item.title}
                        </Text>

                        {item.subtitle && (
                          <Text style={styles.rowSubtitle}>
                            {item.subtitle}
                          </Text>
                        )}
                      </View>

                      <View style={styles.rowRight}>
                        {item.value && (
                          <Text style={styles.rowValue}>
                            {item.value}
                          </Text>
                        )}

                        {!isLogout && (
                          <MedStaffIcon
                            name="chevron-right"
                            size={18}
                            color="#9ca3af"
                          />
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
    paddingBottom: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,

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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2F4F1',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInfo: {
    flex: 1,
  },

  loadingIndicator: {
    alignSelf: 'flex-start',
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
