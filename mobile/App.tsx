import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens (Existing)
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import AttendanceCameraScreen from './src/screens/home/AttendanceCameraScreen';
import AttendanceConfirmationScreen from './src/screens/home/AttendanceConfirmationScreen';
import RiwayatScreen from './src/screens/home/RiwayatScreen';

// Import Navigator & Detail Screens
import MainTabNavigator from './src/navigation/MainTabNavigator';
import AttendanceScreen from './src/screens/home/AttendanceScreen';
import EmployeeDetailScreen from './src/screens/employees/EmployeeDetailScreen';
import NotificationDetailScreen from './src/screens/notification/NotificationDetailScreen';

// Import Screens Cuti & Shift
import LeaveRequestScreen from './src/screens/submission/LeaveRequestScreen';
import LeaveDetailScreen from './src/screens/submission/LeaveDetailScreen';
import ShiftScreen from './src/screens/submission/ShiftScreen';

// --- TAMBAHKAN IMPORT SHIFT REQUEST DI SINI ---
import ShiftRequestScreen from './src/screens/submission/ShiftRequestScreen';
import OvertimeScreen from './src/screens/submission/OvertimeScreen';
import RequestOvertimeScreen from './src/screens/submission/RequestOvertimeScreen';
import PersonalInformationScreen from './src/screens/profile/PersonalInformationScreen';
import WorkInformationScreen from './src/screens/profile/WorkInformationScreen';
import EmergencyContactScreen from './src/screens/profile/EmergencyContactScreen';
import EducationExperienceScreen from './src/screens/profile/EducationExperienceScreen';
import ChangePasswordScreen from './src/screens/profile/ChangePasswordScreen';
import PINScreen from './src/screens/profile/PINScreen';
import LanguageScreen from './src/screens/profile/LanguageScreen';
import HelpCenterScreen from './src/screens/profile/HelpCenterScreen';
import ActivityScreen from './src/screens/home/ActivityScreen';
import ActivityDetailScreen from './src/screens/home/ActivityDetailScreen';
import ProfileDetailScreen from './src/screens/profile/ProfileDetailScreen';
import AdjustmentScreen from './src/screens/submission/AdjustmentScreen';
import AdminHomeScreen from './Admin';
import { getStoredUser } from './src/api/api';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Admin: undefined;
  Attendance: undefined;
  AttendanceCamera: { type: 'in' | 'out' };
  AttendanceConfirmation: {
    photoUri: string;
    type: 'in' | 'out';
    latitude: number;
    longitude: number;
  };
  Riwayat: undefined;
  EmployeeDetail: { employee: any };
  NotificationDetail: { notification: any };
  LeaveRequest: undefined;
  LeaveDetail: undefined;
  Shift: undefined;
  ShiftRequest: undefined;
  Overtime: undefined;
  RequestOvertime: undefined;
  PersonalInformation: undefined;
  WorkInformation: undefined;
  EmergencyContact: undefined;
  EducationExperience: undefined;
  ChangePassword: undefined;
  PIN: undefined;
  Language: undefined;
  HelpCenter: undefined;
  Activity: undefined;
  ActivityDetail: { id: string };
  ProfileDetail: undefined;
  Adjustment: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
                onRegisterSuccess={() => navigation.replace('MainTabs')}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Login">
            {({ navigation }) => (
              <LoginScreen
                onBackPress={() => navigation.goBack()}
                onLoginSuccess={async () => { const user = await getStoredUser(); navigation.replace(user?.role === 'ADMIN' ? 'Admin' : 'MainTabs'); }} 
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Admin" component={AdminHomeScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="AttendanceCamera" component={AttendanceCameraScreen} />
          <Stack.Screen name="AttendanceConfirmation" component={AttendanceConfirmationScreen} />
          <Stack.Screen name="Riwayat" component={RiwayatScreen} />
          <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
          <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
          
          {/* Cuti & Shift Screens */}
          <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
          <Stack.Screen name="LeaveDetail" component={LeaveDetailScreen} />
          <Stack.Screen name="Shift" component={ShiftScreen} />
          
          {/* --- DAFTARKAN SCREEN SHIFT REQUEST DI SINI --- */}
          <Stack.Screen name="ShiftRequest" component={ShiftRequestScreen} />
          <Stack.Screen name="Overtime" component={OvertimeScreen} />
          <Stack.Screen name="RequestOvertime" component={RequestOvertimeScreen} />
          <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
          <Stack.Screen name="WorkInformation" component={WorkInformationScreen} />
          <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} />
          <Stack.Screen name="EducationExperience" component={EducationExperienceScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="PIN" component={PINScreen} />
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
          <Stack.Screen name="Adjustment" component={AdjustmentScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}











