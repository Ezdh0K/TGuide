
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Platform, View, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/authContext';

import HomeScreen from '../screens/HomeScreen';
import EventBoard from '../screens/EventBoard';
import AuthStack from './AuthStack';
import NotAutorizatedProfileScreen from '../screens/Profile/NotAutorizatedProfileScreen';
import AutorizatedProfileScreen from '../screens/Profile/AutorizatedProfileScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import FilterScreen from '../screens/FilterScreen';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          
          backgroundColor: 'white',
          borderTopColor: 'grey',
          borderTopWidth: 0.6,
          height: 60 + insets.bottom,
          
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
          
          paddingBottom: insets.bottom,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/images/home1.png')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Events" 
        component={EventBoard}
        options={{
          tabBarLabel: 'События',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/images/EventIcon.png')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ user ? ProfileStack : NotAutorizatedProfileScreen }
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/images/User.png')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
        
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12 }}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
      name="MainTabs"
      component={MainTabs}
      options={{ headerShown: false }}
      />
      <Stack.Screen
      name="PlaceDetail"
      component={PlaceDetailScreen}
      options={{
        title: "О месте",
        headerShown: false
      }}
      />
      <Stack.Screen
      name="FilterScreen"
      component={FilterScreen}
      options={{headerShown: false}}/>
      
      <Stack.Screen name="Auth" component={AuthStack} options={{headerShown: false}} />
      

    </Stack.Navigator>
  );
}