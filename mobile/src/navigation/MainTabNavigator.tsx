import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MainTabParamList } from '../types/navigation';

import HomeScreen from '../screens/HomeScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import SubmissionScreen from '../screens/SubmissionScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// KITA BUAT CUSTOM TAB BAR SENDIRI (Bebas dari aturan kaku React Navigation)
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        // Menentukan Icon & Text per menu
        let iconName: keyof typeof Feather.glyphMap = 'home';
        let labelText = '';
        if (route.name === 'Home') { iconName = 'home'; labelText = 'Home'; }
        else if (route.name === 'Employees') { iconName = 'users'; labelText = 'Staff'; }
        else if (route.name === 'Submission') { iconName = 'file-text'; labelText = 'Form'; }
        else if (route.name === 'Inbox') { iconName = 'bell'; labelText = 'Inbox'; }
        else if (route.name === 'Profile') { iconName = 'user'; labelText = 'Profil'; }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            {isFocused ? (
              // BUBBLE AKTIF (Sekarang bisa memanjang bebas tanpa tergencet)
              <LinearGradient
                colors={['#4ba3a3', '#1b7d85']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activePill}
              >
                <Feather name={iconName} size={18} color="#ffffff" />
                <Text style={styles.activeText}>{labelText}</Text>
              </LinearGradient>
            ) : (
              // IKON NON-AKTIF
              <View style={styles.inactiveIcon}>
                <Feather name={iconName} size={22} color="#9ca3af" />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      // MEMASANG CUSTOM TAB BAR YANG KITA BUAT DI ATAS KE NAVIGATOR
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Employees" component={EmployeesScreen} />
      <Tab.Screen name="Submission" component={SubmissionScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 20 : 30,
    alignSelf: 'center',
    width: '92%',
    height: 65,
    backgroundColor: '#ffffff',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, // Jarak menu dengan ujung card putih
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  activeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  inactiveIcon: {
    padding: 10,
  }
});