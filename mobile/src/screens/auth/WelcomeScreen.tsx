import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

type WelcomeScreenProps = {
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
};

const MEDSTAFF_LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDeC6-dKNBejn7I72o-upghMn3Vv-nGJD9-ijJqToWMAQ3lmrn-Kw9m9ZMrctniFJOa5kwphTliEBH6cRnFnXU1SqK6wjNBfrRSLnMbhOlpDQxplKCRmAeDkf92RTA2MpgbMVoiLOdbfdU2ApvVpJEzRggbKoZk0xurEEyVl3LKJH5vnPdR2GTgQCcqGXkXtZEPeVr6XGQOYmcRqPiZBBzliHM8-Wvz5P8_F7d0Rg8gzbol6BSV5lLr9Hm4YF6bS5me0yo';

export default function WelcomeScreen({
  onLoginPress,
  onRegisterPress,
}: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={['#0B8FAC', '#7BC1B7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar style="light" />

      <View pointerEvents="none" style={styles.bubbleTopLeft} />
      <View pointerEvents="none" style={styles.bubbleTopRight} />
      <View pointerEvents="none" style={styles.bubbleBottomLeft} />
      <View pointerEvents="none" style={styles.bubbleMiddleRight} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            accessibilityLabel="Logo MedStaff"
            source={{ uri: MEDSTAFF_LOGO_URI }}
            style={styles.logo}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Selamat Datang!</Text>
          <Text style={styles.subtitle}>
            Masuk ke akun kepegawaian MedStaff Anda
          </Text>
        </View>

        <View style={styles.actionBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Masuk"
            onPress={onLoginPress}
            style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}
          >
            <Text style={styles.loginText}>Masuk</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Daftar"
            onPress={onRegisterPress}
            style={({ pressed }) => [styles.registerButton, pressed && styles.pressed]}
          >
            <Text style={styles.registerText}>Daftar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  bubbleTopLeft: {
    position: 'absolute',
    width: 256,
    height: 256,
    top: -80,
    left: -80,
    borderRadius: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bubbleTopRight: {
    position: 'absolute',
    width: 160,
    height: 160,
    top: 160,
    right: -40,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bubbleBottomLeft: {
    position: 'absolute',
    width: 320,
    height: 320,
    bottom: -128,
    left: -128,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bubbleMiddleRight: {
    position: 'absolute',
    width: 96,
    height: 96,
    top: '50%',
    right: 80,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 200,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 16,
    shadowColor: '#075A6C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 7,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 72, 87, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    maxWidth: 300,
    marginTop: 8,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 72, 87, 0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionBar: {
    height: 96,
    flexDirection: 'row',
  },
  loginButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  registerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 60,
    backgroundColor: '#FFFFFF',
    shadowColor: '#075A6C',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  registerText: {
    color: '#0B8FAC',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
  },
});
