import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // <-- IMPORT INI

// Import Screens (Existing)
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import AttendanceCameraScreen from './src/screens/AttendanceCameraScreen';
import AttendanceConfirmationScreen from './src/screens/AttendanceConfirmationScreen';
import RiwayatScreen from './src/screens/RiwayatScreen';

// Import Navigator Baru
import MainTabNavigator from './src/navigation/MainTabNavigator';
import AttendanceScreen from './src/screens/AttendanceScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Attendance: undefined;
  AttendanceCamera: { type: 'in' | 'out' }; 
  AttendanceConfirmation: { photoUri: string; type: 'in' | 'out'; latitude: number; longitude: number }; 
  Riwayat: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // BUNGKUS DENGAN SAFE AREA PROVIDER
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
          
          <Stack.Screen name="Welcome">
            {({ navigation }) => (
              <WelcomeScreen
                onLoginPress={() => navigation.navigate('Login')}
                onRegisterPress={() => navigation.navigate('Register')}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Register">
            {({ navigation }) => (
              <RegisterScreen
                onBackPress={() => navigation.goBack()}
                onRegisterSuccess={() => navigation.navigate('Login')}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Login">
            {({ navigation }) => (
              <LoginScreen
                onBackPress={() => navigation.goBack()}
                onLoginSuccess={() => navigation.replace('MainTabs')} 
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="AttendanceCamera" component={AttendanceCameraScreen} />
          <Stack.Screen name="AttendanceConfirmation" component={AttendanceConfirmationScreen} />
          <Stack.Screen name="Riwayat" component={RiwayatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}