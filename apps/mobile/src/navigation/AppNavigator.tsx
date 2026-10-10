import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from './contexts/AuthContext';

// Auth Screens
import LoginScreen from './screens/LoginScreen';

// Customer Screens
import CustomerDashboardScreen from './screens/customer/DashboardScreen';

// Technician Screens
import TechnicianDashboardScreen from './screens/technician/DashboardScreen';
import JobDetailScreen from './screens/technician/JobDetailScreen';
import AttendanceScreen from './screens/AttendanceScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="SpeedTest"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Speed Test',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚡</Text>,
        }}
      />
      <Tab.Screen
        name="Invoices"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Tagihan',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="Referral"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Referral',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Support"
        component={CustomerDashboardScreen}
        options={{
          tabBarLabel: 'Support',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function TechnicianTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="TechDashboard"
        component={TechnicianDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          tabBarLabel: 'Absensi',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⏰</Text>,
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={TechnicianDashboardScreen}
        options={{
          tabBarLabel: 'Pekerjaan',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="History"
        component={TechnicianDashboardScreen}
        options={{
          tabBarLabel: 'Riwayat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📜</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={LoginScreen} />
          </>
        ) : user.role === 'technician' ? (
          // Technician Stack
          <>
            <Stack.Screen name="Main" component={TechnicianTabs} />
            <Stack.Screen
              name="JobDetail"
              component={JobDetailScreen}
              options={{ headerShown: true, title: 'Detail Pekerjaan' }}
            />
          </>
        ) : (
          // Customer Stack
          <Stack.Screen name="Main" component={CustomerTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
