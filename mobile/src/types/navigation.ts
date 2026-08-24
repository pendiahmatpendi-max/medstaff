import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Employees: undefined;
  Submission: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined; // Membungkus Welcome, Login, Register (existing)
  Main: NavigatorScreenParams<MainTabParamList>;
};