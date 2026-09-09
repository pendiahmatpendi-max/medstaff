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
  Alert,
  ActivityIndicator,
} from 'react-native'
import { register } from '../../api/api'

type RegisterScreenProps = {
  onBackPress: () => void
  onRegisterSuccess?: () => void
}

const GOOGLE_ICON_URI = 'https://img.icons8.com/color/96/google-logo.png'
const APPLE_ICON_URI = 'https://img.icons8.com/ios-filled/100/1a1a1a/apple-logo.png'

export default function RegisterScreen({
  onBackPress,
  onRegisterSuccess,
}: RegisterScreenProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [position, setPosition] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    if (!employeeId.trim())
      return Alert.alert('Validation Error', 'Employee ID is required.')

    if (!fullName.trim())
      return Alert.alert('Validation Error', 'Full Name is required.')

    if (!phone.trim())
      return Alert.alert('Validation Error', 'Phone number is required.')

    if (!birthPlace.trim())
      return Alert.alert('Validation Error', 'Birth place is required.')

    if (!birthDate.trim())
      return Alert.alert('Validation Error', 'Birth date is required.')

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim()))
      return Alert.alert(
        'Validation Error',
        'Birth date must use YYYY-MM-DD format.',
      )

    if (!gender.trim())
      return Alert.alert('Validation Error', 'Gender is required.')

    if (!position.trim())
      return Alert.alert('Validation Error', 'Position is required.')

    if (!email.trim())
      return Alert.alert('Validation Error', 'Email is required.')

    if (password.length < 8)
      return Alert.alert(
        'Validation Error',
        'Password must be at least 8 characters long.',
      )

    setIsLoading(true)

    try {
      await register({
        employeeId: employeeId.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        birthPlace: birthPlace.trim(),
        birthDate: birthDate.trim(),
        gender: gender.trim(),
        position: position.trim(),
        identityNumber: identityNumber.trim() || undefined,
        address: address.trim() || undefined,
        email: email.trim().toLowerCase(),
        password,
      })

      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => onRegisterSuccess?.(),
          },
        ],
      )
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error?.message || 'An unexpected error occurred.',
      )
    } finally {
      setIsLoading(false)
    }
  }

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
        disabled={isLoading}
      >
        <Text style={styles.backText}>{'\u2190'}</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter employee ID"
              value={employeeId}
              onChangeText={setEmployeeId}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Place</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter birth place"
              value={birthPlace}
              onChangeText={setBirthPlace}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={birthDate}
              onChangeText={setBirthDate}
              maxLength={10}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Male / Female"
              value={gender}
              onChangeText={setGender}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Position</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter position"
              value={position}
              onChangeText={setPosition}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Identity Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Optional"
              value={identityNumber}
              onChangeText={setIdentityNumber}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Optional"
              value={address}
              onChangeText={setAddress}
              multiline
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              style={styles.socialButton}
            >
              <Image
                source={{ uri: GOOGLE_ICON_URI }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              style={styles.socialButton}
            >
              <Image
                source={{ uri: APPLE_ICON_URI }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={onBackPress}
              disabled={isLoading}
            >
              <Text style={styles.loginLink}> Log In</Text>
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
    position: 'absolute',
    width: 230,
    height: 230,
    top: -115,
    left: -80,
    borderRadius: 115,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bubbleTopRight: {
    position: 'absolute',
    width: 145,
    height: 145,
    top: 44,
    right: -52,
    borderRadius: 73,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bubbleBottomRight: {
    position: 'absolute',
    width: 96,
    height: 96,
    right: 48,
    bottom: -35,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 180,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
    minHeight: 720,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 32,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00677d',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3f4947',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#bec9c6',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 90,
    paddingTop: 14,
  },
  registerButton: {
    height: 52,
    backgroundColor: '#7bc1b7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e2e2',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#6f7977',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#3f4947',
    fontSize: 14,
  },
  loginLink: {
    color: '#1d6961',
    fontSize: 14,
    fontWeight: '700',
  },
})
