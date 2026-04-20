import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/authContext';

export default function UnauthorizedProfile() {
  const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                    style={styles.profileImage}
                    source={require('../../assets/images/Profile1.png')}/>
                </View>
                <Text style={styles.headerText}>Войдите в профиль</Text>
              </View>
            </View>

            {/* Поля ввода */}
            <View style={styles.body}>
              <View style={styles.sectionRegister}>
                <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate('Auth', { screen: 'Login' })}>
                    <Text style={styles.enterText}>
                        Войти
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.autorizationButton}
                onPress={() => navigation.navigate('Auth', {screen: 'Register'})}>
                    <Text style={styles.autorizationText}>
                        Зарегистрироваться
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff'
 },
 header: {
  height: '30%',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingBottom: 20,
 },
 profileContainer: {
  flexDirection: "column",
  alignItems: 'center'
 },
 profileImageContainer: {
  height: 120,
  width: 120,
  backgroundColor: 'transparent',
  borderRadius: 100,
 },
 profileImage: {
  height: '100%',
  width: '100%', 
  resizeMode: 'cover',  
 },
 headerText: {
  marginTop: 5,
  fontSize: 22,
  fontWeight: '500',
  color: 'black'
 },
 body: {
  flex: 1,
  backgroundColor: '#fff',
  paddingBottom: 40,
  paddingTop: 20
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
 autorizationButton: {
  marginTop: 20,
  paddingVertical: 8,
 },
 autorizationText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#007AFF'
 },
});