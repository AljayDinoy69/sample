import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ReportScreen from '../screens/ReportScreen';
import UserDashboard from '../screens/UserDashboard';
import ResponderDashboard from '../screens/ResponderDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import AdminCreateUsers from '../components/AdminCreateUsers';
import DebugStorageScreen from '../screens/DebugStorageScreen';
import { useTheme } from '../components/ThemeProvider';
import { useEffect } from 'react';
import { Platform, ToastAndroid, Vibration } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Report: { anonymous?: boolean } | undefined;
  UserDashboard: undefined;
  ResponderDashboard: undefined;
  AdminDashboard: undefined;
  AdminCreateUsers: undefined;
  DebugStorage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { colors } = useTheme();

  // Add a development menu that can be triggered by shaking the device
  useEffect(() => {
    if (__DEV__) {
      const subscription = {
        addListener: () => {},
        remove: () => {}
      } as any;

      if (Platform.OS === 'android') {
        // For Android, we'll use a different approach since React Native's DevMenu is not available
        let lastShake = 0;
        const onShake = () => {
          const now = Date.now();
          if (now - lastShake < 1000) return; // Prevent multiple triggers
          lastShake = now;
          
          ToastAndroid.show(
            'Opening debug menu...',
            ToastAndroid.SHORT
          );
          // @ts-ignore - We'll handle navigation in the component
          navigation.navigate('DebugStorage');
        };

        // Listen for back button press (double press to open debug menu)
        let backButtonPressCount = 0;
        const backHandler = () => {
          if (backButtonPressCount === 0) {
            backButtonPressCount++;
            setTimeout(() => { backButtonPressCount = 0; }, 500);
            return true;
          }
          
          if (backButtonPressCount === 1) {
            onShake();
            backButtonPressCount = 0;
            return true;
          }
          
          return false;
        };
        
        // @ts-ignore
        BackHandler.addEventListener('hardwareBackPress', backHandler);
        
        return () => {
          // @ts-ignore
          BackHandler.removeEventListener('hardwareBackPress', backHandler);
        };
      }
      
      return () => subscription.remove();
    }
  }, []);
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Report Incident' }} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ResponderDashboard" component={ResponderDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="AdminCreateUsers" component={AdminCreateUsers} options={{ title: 'Create Users' }} />
        <Stack.Screen 
          name="DebugStorage" 
          component={DebugStorageScreen} 
          options={{ 
            title: 'Debug Storage',
            headerShown: false
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
