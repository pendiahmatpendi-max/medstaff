import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getEmployees, EmployeeProfile } from '../../api/api';

type EmployeeItem = EmployeeProfile & {
  user?: {
    isActive?: boolean;
  };
  isActive?: boolean;
};

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadEmployees = async () => {
      try {
        setLoading(true);

        const response = await getEmployees();

        if (!mounted) return;

        const data = Array.isArray(response?.data)
          ? response.data
          : response?.data?.items ?? response?.items ?? [];

        setEmployees(data);
      } catch (error) {
        console.error('Gagal mengambil daftar pegawai:', error);

        if (mounted) {
          setEmployees([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      mounted = false;
    };
  }, []);

  const getEmployeeName = (employee: EmployeeItem) =>
    employee.fullName || '-';

  const getEmployeeRole = (employee: EmployeeItem) =>
    employee.position || '-';

  const getEmployeePhoto = (employee: EmployeeItem) =>
    employee.profilePhoto || undefined;

  const isEmployeeActive = (employee: EmployeeItem) =>
    employee.isActive ?? employee.user?.isActive ?? true;

  const getStatusText = (employee: EmployeeItem) =>
    isEmployeeActive(employee) ? 'Active' : 'Inactive';

  const getStatusColor = (employee: EmployeeItem) =>
    isEmployeeActive(employee) ? '#10b981' : '#9ca3af';

  const getClinicName = (employee: EmployeeItem) =>
    employee.companyName || 'Klinik Pratama UNIMUS';

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();

    return (
      getEmployeeName(employee).toLowerCase().includes(query) ||
      String(employee.employeeId || '').toLowerCase().includes(query) ||
      getEmployeeRole(employee).toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: '#f3f6f8',
        }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#1f2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>StaffList</Text>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.searchWrapper}>
          <Feather
            name="search"
            size={20}
            color="#6c7a71"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search staff..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              <Feather name="x" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0b8fac" />
            <Text style={styles.loadingText}>Loading staff...</Text>
          </View>
        ) : filteredEmployees.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredEmployees.map((employee) => {
              const photo = getEmployeePhoto(employee);
              const statusColor = getStatusColor(employee);

              return (
                <TouchableOpacity
                  key={employee.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => setSelectedEmployee(employee)}
                >
                  <View style={styles.avatarWrapper}>
                    {photo ? (
                      <Image
                        source={{ uri: photo }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Feather
                          name="user"
                          size={24}
                          color="#9ca3af"
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.infoWrapper}>
                    <View style={styles.nameRow}>
                      <Text
                        style={styles.nameText}
                        numberOfLines={1}
                      >
                        {getEmployeeName(employee)}
                      </Text>

                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: statusColor },
                        ]}
                      />
                    </View>

                    <Text
                      style={styles.roleText}
                      numberOfLines={1}
                    >
                      {getEmployeeRole(employee)}
                    </Text>

                    <Text style={styles.idText}>
                      {employee.employeeId || '-'}
                    </Text>
                  </View>

                  <Feather
                    name="chevron-right"
                    size={20}
                    color="#bbcabf"
                    style={styles.chevron}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.illustrationWrapper}>
              <View style={styles.illustrationCircleLarge}>
                <View style={styles.illustrationCircleSmall}>
                  <Feather
                    name="user-x"
                    size={48}
                    color="#0b8fac"
                  />
                </View>
              </View>

              <View style={styles.errorBadge}>
                <Feather name="x" size={14} color="#fff" />
              </View>
            </View>

            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Staff not found' : 'No staff available'}
            </Text>

            <Text style={styles.emptyDesc}>
              {searchQuery
                ? "Sorry, we couldn't find any results for your search. Please try another keyword."
                : 'There are no staff records available from the clinic.'}
            </Text>

            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.resetBtn}
                activeOpacity={0.8}
                onPress={() => setSearchQuery('')}
              >
                <MaterialIcons
                  name="refresh"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.resetBtnText}>
                  Reset Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <Modal
        visible={!!selectedEmployee}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEmployee(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedEmployee(null)}
        >
          <View
            style={styles.modalCard}
            onStartShouldSetResponder={() => true}
          >
            {selectedEmployee?.profilePhoto ? (
              <Image
                source={{ uri: selectedEmployee.profilePhoto }}
                style={styles.modalImage}
              />
            ) : (
              <View style={styles.modalImagePlaceholder}>
                <Feather
                  name="user"
                  size={64}
                  color="#d1d5db"
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedEmployee(null)}
            >
              <Feather name="x" size={20} color="#ffffff" />
            </TouchableOpacity>

            <LinearGradient
              colors={[
                'transparent',
                'rgba(0,0,0,0.6)',
                'rgba(0,0,0,0.9)',
              ]}
              locations={[0, 0.4, 1]}
              style={styles.modalGradient}
            />

            <View style={styles.modalContent}>
              <View style={styles.modalNameRow}>
                <Text
                  style={styles.modalName}
                  numberOfLines={1}
                >
                  {selectedEmployee?.fullName || '-'}
                </Text>

                <MaterialIcons
                  name="verified"
                  size={18}
                  color="#ffffff"
                  style={{ marginLeft: 6 }}
                />
              </View>

              <Text style={styles.modalRole}>
                {selectedEmployee?.position || '-'}
              </Text>

              <View style={styles.modalClinicRow}>
                <MaterialIcons
                  name="my-location"
                  size={14}
                  color="rgba(255,255,255,0.8)"
                />

                <Text style={styles.modalClinic}>
                  {selectedEmployee
                    ? getClinicName(selectedEmployee)
                    : '-'}
                </Text>
              </View>

              <View style={styles.modalBadgeRow}>
                <View style={styles.badgePill}>
                  <Feather
                    name="hash"
                    size={12}
                    color="#ffffff"
                  />

                  <Text style={styles.badgeText}>
                    {selectedEmployee?.employeeId || '-'}
                  </Text>
                </View>

                <View style={styles.badgePill}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: selectedEmployee
                          ? getStatusColor(selectedEmployee)
                          : '#9ca3af',
                        marginRight: 6,
                      },
                    ]}
                  />

                  <Text style={styles.badgeText}>
                    {selectedEmployee
                      ? getStatusText(selectedEmployee)
                      : '-'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f8',
  },

  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  backBtn: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },

  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1f2937',
  },

  clearBtn: {
    padding: 4,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6c7a71',
  },

  scrollContent: {
    paddingBottom: 110,
    gap: 8,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 202, 191, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: 'rgba(187, 202, 191, 0.2)',
    overflow: 'hidden',
    marginRight: 14,
  },

  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  avatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },

  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  roleText: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 2,
  },

  idText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },

  chevron: {
    marginLeft: 10,
    opacity: 0.5,
  },

  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
    paddingHorizontal: 20,
  },

  illustrationWrapper: {
    position: 'relative',
    marginBottom: 24,
  },

  illustrationCircleLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  illustrationCircleSmall: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f3f6f8',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f3131',
    marginBottom: 12,
    textAlign: 'center',
  },

  emptyDesc: {
    fontSize: 14,
    color: '#6c7a71',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },

  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  resetBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    aspectRatio: 3 / 4,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },

  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  modalImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },

  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },

  modalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  modalName: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  modalRole: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
  },

  modalClinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalClinic: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 6,
    fontWeight: '500',
  },

  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
