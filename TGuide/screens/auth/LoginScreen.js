import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';
import { useAuth } from '../../context/authContext';
import back from '../../services/back';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await back.post('/auth/login', {email, password});
      await signIn(response.data.user, response.data.token)
      goBack();
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const goBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Кнопка "назад" */}
      <TouchableOpacity  onPress={() => goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>Войдите в профиль</Text>
      </View>
      
      {/* Поля ввода */}
      <View style={styles.formWrapper}>
        <View style={styles.section}>
          <Text style={styles.sectionText}></Text>
          <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder= "Введите почту"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
            keyboardType='email-address'
            autoCorrect={false}/>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}></Text>
          <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder= "Введите пароль"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
            secureTextEntry={true}/>
          </View>
        </View>
      </View>

      <View style={styles.sectionRegister}>
        <TouchableOpacity style={styles.enterButton} onPress={() => handleLogin()}>
          <Text style={styles.enterText}>
            Войти
          </Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  justifyContent: 'flex-start',
  alignItems: 'center',
 },
 header: {
  height: '30%',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingBottom: 20,
  },
  headerText: {
  marginTop: 5,
  fontSize: 22,
  fontWeight: '500',
  color: 'black'
  },
 backButton: {
  position: 'absolute',
  top: 30,
  left: 20,
  zIndex: 10,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
 },
    
 formWrapper: {
  width: '100%',
  paddingHorizontal: 24
 },
  section: {
  marginTop: 18,
  width: '100%'
 },
  sectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  inputContainer: {
    height: 42,
    width: '100%',
    
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 20,
    
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  input: {
  height: '100%',
  width: '100%',
  fontSize: 16,
  padding: 0,
  },
 sectionRegister: {
  width: '100%',
  alignItems: 'center',
  marginTop: 28
 },
  enterButton: {
  width: '80%',
  height: 48,
  backgroundColor: '#007AFF',
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12
 },
 enterText: {
  fontSize: 18,
  fontWeight: '500',
  color: 'white'
 },
})