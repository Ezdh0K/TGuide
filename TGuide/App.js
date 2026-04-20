
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LogBox } from 'react-native';
import AuthProvider from './context/authContext';
import AppNavigator from './navigation/AppNavigator';
LogBox.ignoreLogs(['Unsupported top level event']);

export default function App() {
  
  const [state, setState] = useState();
  useEffect(() => {});
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
    
  );
}
