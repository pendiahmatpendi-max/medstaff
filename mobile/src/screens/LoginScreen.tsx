import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

type LoginScreenProps = { onBackPress: () => void }

const GOOGLE_ICON_URI = 'https://img.icons8.com/color/96/google-logo.png'
const APPLE_ICON_URI = 'https://img.icons8.com/ios-glyphs/90/000000/mac-os.png'

export default function LoginScreen({ onBackPress }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#0b8fac', '#00677d']} style={styles.header}>
        <View pointerEvents="none" style={styles.bubbleOne} />
        <View pointerEvents="none" style={styles.bubbleTwo} />
      </LinearGradient>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Kembali">
        <Text style={styles.backText}>{'\u2190'}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Masuk ke akun MedStaff Anda</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="Masukkan Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Masukkan Password" secureTextEntry value={password} onChangeText={setPassword} />
          </View>
          <TouchableOpacity style={styles.loginButton}><Text style={styles.loginButtonText}>Masuk</Text></TouchableOpacity>
          <View style={styles.dividerContainer}><View style={styles.divider} /><Text style={styles.dividerText}>Atau masuk dengan</Text><View style={styles.divider} /></View>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Masuk dengan Google"><Image source={{ uri: GOOGLE_ICON_URI }} style={styles.socialIcon} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Masuk dengan Apple"><Image source={{ uri: APPLE_ICON_URI }} style={styles.socialIcon} /></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { position: 'absolute', top: 0, right: 0, left: 0, height: 290, overflow: 'hidden' },
  bubbleOne: { position: 'absolute', width: 230, height: 230, top: -115, left: -80, borderRadius: 115, backgroundColor: 'rgba(255,255,255,0.15)' },
  bubbleTwo: { position: 'absolute', width: 145, height: 145, top: 44, right: -52, borderRadius: 73, backgroundColor: 'rgba(255,255,255,0.16)' },
  backButton: { position: 'absolute', top: 16, left: 20, zIndex: 2, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  scrollContent: { flexGrow: 1, paddingTop: 180, paddingBottom: 32 },
  card: { flex: 1, minHeight: 650, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 42, paddingBottom: 32 },
  title: { color: '#00677d', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#6f7977', fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 30 },
  inputGroup: { marginBottom: 16 },
  label: { color: '#3f4947', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderColor: '#bec9c6', borderRadius: 14, paddingHorizontal: 16, fontSize: 16 },
  loginButton: { height: 52, marginTop: 8, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7bc1b7' },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e2e2e2' },
  dividerText: { marginHorizontal: 12, color: '#6f7977', fontSize: 12 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialButton: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#e2e2e2', alignItems: 'center', justifyContent: 'center' },
  socialIcon: { width: 22, height: 22 },
})
