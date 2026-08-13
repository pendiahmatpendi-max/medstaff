import { useState } from 'react'
import WelcomeScreen from './src/screens/WelcomeScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import LoginScreen from './src/screens/LoginScreen'

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'login' | 'register'>('welcome')

  if (screen === 'register') {
    return <RegisterScreen onBackPress={() => setScreen('welcome')} />
  }

  if (screen === 'login') {
    return <LoginScreen onBackPress={() => setScreen('welcome')} />
  }

  return (
    <WelcomeScreen
      onLoginPress={() => setScreen('login')}
      onRegisterPress={() => setScreen('register')}
    />
  )
}
