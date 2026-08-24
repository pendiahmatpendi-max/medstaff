import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'

type RegisterScreenProps = {
  onBackPress: () => void,
   onRegisterSuccess?: () => void;
}

const GOOGLE_ICON_URI = 'https://img.icons8.com/color/96/google-logo.png'
const APPLE_ICON_URI = 'https://img.icons8.com/ios-filled/100/1a1a1a/apple-logo.png'

export default function RegisterScreen({ onBackPress }: RegisterScreenProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0b8fac', '#00677d']}
        style={styles.header}
      >
        <View pointerEvents="none" style={styles.bubbleTopLeft} />
        <View pointerEvents="none" style={styles.bubbleTopRight} />
        <View pointerEvents="none" style={styles.bubbleBottomRight} />
      </LinearGradient>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Kembali ke halaman sambutan"
        onPress={onBackPress}
        style={styles.backButton}
      >
        <Text style={styles.backText}>{'\u2190'}</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Mulai Daftar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Nama"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Daftar</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Atau daftar dengan</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Daftar dengan Google"
              style={styles.socialButton}
            >
              <Image source={{ uri: GOOGLE_ICON_URI }} style={styles.socialIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Daftar dengan Apple"
              style={styles.socialButton}
            >
              <Image source={{ uri: APPLE_ICON_URI }} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun?</Text>
            <TouchableOpacity>
              <Text style={styles.loginLink}> Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 290,
    overflow: 'hidden',
  },
  bubbleTopLeft: {
    position: 'absolute', width: 230, height: 230, top: -115, left: -80,
    borderRadius: 115, backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bubbleTopRight: {
    position: 'absolute', width: 145, height: 145, top: 44, right: -52,
    borderRadius: 73, backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bubbleBottomRight: {
    position: 'absolute', width: 96, height: 96, right: 48, bottom: -35,
    borderRadius: 48, backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: 180, paddingBottom: 32 },
  card: {
    flex: 1, minHeight: 720, backgroundColor: 'white', borderTopLeftRadius: 40,
    borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 42, paddingBottom: 32,
  },
  backButton: {
    position: 'absolute', top: 16, left: 20, zIndex: 2, width: 40, height: 40,
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  backText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: '700', color: '#00677d', textAlign: 'center', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#3f4947', marginBottom: 8 },
  input: {
    height: 52, borderWidth: 1, borderColor: '#bec9c6', borderRadius: 14,
    paddingHorizontal: 16, fontSize: 16, backgroundColor: '#fff',
  },
  registerButton: {
    height: 52, backgroundColor: '#7bc1b7', borderRadius: 14, justifyContent: 'center',
    alignItems: 'center', marginTop: 8,
  },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e2e2e2' },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: '#6f7977' },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  socialButton: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#e2e2e2',
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
  },
  socialIcon: { width: 22, height: 22 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#3f4947', fontSize: 14 },
  loginLink: { color: '#1d6961', fontSize: 14, fontWeight: '700' },
})
