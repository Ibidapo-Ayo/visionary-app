import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '@store/authStore';

const AppLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Check-In',
          tabBarLabel: 'Check-In',
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
          tabBarLabel: 'AI',
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarLabel: 'Members',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1f3a',
    borderTopColor: '#2d3a5a',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 10,
    marginTop: -4,
  },
});

export default AppLayout;
