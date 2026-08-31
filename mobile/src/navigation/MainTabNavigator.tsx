import React, { useEffect } from 'react';
import { View, Text, Platform, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedStaffIcon, { MedStaffIconName } from '../components/MedStaffIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolation, 
  runOnJS 
} from 'react-native-reanimated';

import { MainTabParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import SubmissionScreen from '../screens/SubmissionScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// --- KONFIGURASI UKURAN ---
const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.92;
const OPTIMAL_PADDING = (560 - TAB_BAR_WIDTH) / 8;
const TAB_PADDING = Math.max(12, OPTIMAL_PADDING);
const TAB_WIDTH = (TAB_BAR_WIDTH - (TAB_PADDING * 2)) / 5; 
const BUBBLE_WIDTH = 100; // Dibuat 100 agar pas dan elegan
const BUBBLE_HEIGHT = 46; 

function CustomTabBar({ state, navigation }: any) {
  const translateX = useSharedValue(TAB_PADDING + state.index * TAB_WIDTH);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    // Animasi dibuat lebih smooth, tidak terlalu memantul
    translateX.value = withSpring(TAB_PADDING + state.index * TAB_WIDTH, { damping: 24, stiffness: 100, mass: 1 });
  }, [state.index]);

  const navigateTo = (index: number) => {
    const route = state.routes[index];
    if (state.index !== index) {
      navigation.navigate(route.name);
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => { isDragging.value = true; })
    .onUpdate((e) => {
      const newX = (TAB_PADDING + state.index * TAB_WIDTH) + e.translationX;
      translateX.value = Math.max(TAB_PADDING, Math.min(newX, TAB_PADDING + TAB_WIDTH * 4));
    })
    .onEnd(() => {
      isDragging.value = false;
      const nearestIndex = Math.round((translateX.value - TAB_PADDING) / TAB_WIDTH);
      // Animasi dibuat lebih smooth, tidak terlalu memantul
      translateX.value = withSpring(TAB_PADDING + nearestIndex * TAB_WIDTH, { damping: 24, stiffness: 100, mass: 1 });
      runOnJS(navigateTo)(nearestIndex);
    });

  const tapGesture = Gesture.Tap()
    .onEnd((e) => {
      let tappedIndex = Math.floor((e.x - TAB_PADDING) / TAB_WIDTH);
      tappedIndex = Math.max(0, Math.min(tappedIndex, 4));
      // Animasi dibuat lebih smooth, tidak terlalu memantul
      translateX.value = withSpring(TAB_PADDING + tappedIndex * TAB_WIDTH, { damping: 24, stiffness: 100, mass: 1 });
      runOnJS(navigateTo)(tappedIndex);
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  // STYLE BUBBLE YANG BERGERAK
  const animatedBubbleStyle = useAnimatedStyle(() => {
    const normalX = translateX.value + (TAB_WIDTH - BUBBLE_WIDTH) / 2;
    // Edge Bounding agar aman di dalam Card putih
    const MIN_X = 6;
    const MAX_X = TAB_BAR_WIDTH - BUBBLE_WIDTH - 6;
    const clampedX = Math.max(MIN_X, Math.min(normalX, MAX_X));

    return {
      transform: [
        { translateX: clampedX },
        // Efek "kenyal" (scale) dikurangi agar sangat subtle & tidak terasa melar
        { scaleX: withSpring(isDragging.value ? 1.02 : 1, { damping: 24, stiffness: 100, mass: 1 }) },
        { scaleY: withSpring(isDragging.value ? 0.99 : 1, { damping: 24, stiffness: 100, mass: 1 }) }
      ]
    };
  });

  const getRouteInfo = (routeName: string): { icon: MedStaffIconName; label: string } => {
    if (routeName === 'Home') return { icon: 'home', label: 'Home' };
    if (routeName === 'Employees') return { icon: 'employee', label: 'Staff' };
    if (routeName === 'Submission') return { icon: 'request', label: 'Form' };
    if (routeName === 'Inbox') return { icon: 'notification', label: 'Inbox' };
    return { icon: 'profile', label: 'Profil' };
  };

  return (
    <View style={styles.outerWrapper}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={composedGesture}>
          <View style={styles.tabBarContainer}>
            
            {/* LAYER 1: IKON ABU-ABU (TIDAK AKTIF) */}
            {state.routes.map((route: any, index: number) => {
              const { icon } = getRouteInfo(route.name);
              
              const inactiveStyle = useAnimatedStyle(() => {
                const base = TAB_PADDING + index * TAB_WIDTH;
                // 1. Ikon menghilang saat bubble di atasnya
                const opacity = interpolate(translateX.value, [base - 0.7 * TAB_WIDTH, base, base + 0.7 * TAB_WIDTH], [1, 0, 1], Extrapolation.CLAMP);
                const scale = interpolate(translateX.value, [base - TAB_WIDTH, base, base + TAB_WIDTH], [1, 0.5, 1], Extrapolation.CLAMP);
                
                // 2. THE MAGIC: Ikon menghindar/bergeser untuk memberi ruang pada kapsul panjang
                const shiftX = interpolate(
                  translateX.value,
                  [
                    base - 2 * TAB_WIDTH, // Bubble jauh di kiri
                    base - TAB_WIDTH,     // Bubble tepat di sebelah kiri
                    base,                 // Bubble pas di atas ikon
                    base + TAB_WIDTH,     // Bubble tepat di sebelah kanan
                    base + 2 * TAB_WIDTH  // Bubble jauh di kanan
                  ],
                  [0, 22, 0, -22, 0], // Geser 22px menjauh dari bubble
                  Extrapolation.CLAMP
                );

                return {
                  opacity,
                  transform: [{ scale }, { translateX: shiftX }]
                };
              });

              return (
                <View key={`inactive-${index}`} style={styles.iconContainer} pointerEvents="none">
                  <Animated.View style={inactiveStyle}>
                    <MedStaffIcon name={icon} variant="outline" size={24} color="#9ca3af" />
                  </Animated.View>
                </View>
              );
            })}

            {/* LAYER 2: BUBBLE HIJAU + IKON & TEKS PUTIH DI DALAMNYA */}
            <Animated.View style={[styles.slidingBubble, animatedBubbleStyle]}>
              {/* GRADIENT RESMI MEDSTAFF (Horizontal Murni) */}
              <LinearGradient 
                colors={['#7BC1B7', '#0B8FAC']} 
                start={{ x: 0, y: 0.5 }} 
                end={{ x: 1, y: 0.5 }} 
                style={StyleSheet.absoluteFill} 
              />
              
              {state.routes.map((route: any, index: number) => {
                const { icon, label } = getRouteInfo(route.name);
                
                const activeStyle = useAnimatedStyle(() => {
                  const base = TAB_PADDING + index * TAB_WIDTH;
                  return {
                    opacity: interpolate(translateX.value, [base - 0.4 * TAB_WIDTH, base, base + 0.4 * TAB_WIDTH], [0, 1, 0], Extrapolation.CLAMP),
                    transform: [{ scale: interpolate(translateX.value, [base - TAB_WIDTH, base, base + TAB_WIDTH], [0.5, 1, 0.5], Extrapolation.CLAMP) }]
                  };
                });

                return (
                  <Animated.View key={`active-${index}`} style={[StyleSheet.absoluteFill, styles.activeContent, activeStyle]} pointerEvents="none">
                    <MedStaffIcon name={icon} variant="filled" size={20} color="#ffffff" />
                    <Text style={styles.activeText} numberOfLines={1}>{label}</Text>
                  </Animated.View>
                );
              })}
            </Animated.View>

          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Employees" component={EmployeesScreen} />
      <Tab.Screen name="Submission" component={SubmissionScreen} />
      <Tab.Screen name="Inbox" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 15 : 25,
    alignSelf: 'center',
    width: TAB_BAR_WIDTH,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  tabBarContainer: { flex: 1, flexDirection: 'row', paddingHorizontal: TAB_PADDING },
  iconContainer: { width: TAB_WIDTH, height: 65, justifyContent: 'center', alignItems: 'center' },
  slidingBubble: {
    position: 'absolute',
    top: (65 - BUBBLE_HEIGHT) / 2, 
    left: 0,
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
    borderRadius: 25,
    overflow: 'hidden',
    zIndex: 10,
  },
  activeContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  activeText: { color: '#ffffff', fontSize: 13, fontWeight: '700', marginLeft: 6 }
});