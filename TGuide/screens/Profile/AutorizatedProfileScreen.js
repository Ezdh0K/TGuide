// screens/ProfileScreen.js
import { StyleSheet, Text, View, Button, Platform, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';
import { useNavigation } from '@react-navigation/native';
import SettingsScreen from './ProfileInside/SettingsScreen';
import FavoriteScreen from './ProfileInside/FavoriteScreen';
import HistoryScreen from './ProfileInside/HistoryScreen';
import OfferScreen from './ProfileInside/OfferScreen';

import FeedBackScreen from './ProfileInside/FeedBackScreen';
import AboutUsScreen from './ProfileInside/AboutUsScreen';

export default function AutorizatedProfileScreen() {
  const [places, setPlaces] = useState([]);
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const ADMIN = user?.role === 'admin';
  const textForName = String('Имя пользователя');
  console.log('user id:', user.id);

  const openScreen = (Screen) => {
    navigation.navigate(Screen);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Шапка с аватаром и краткой инфо о юзере  */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarConainer}>
            <Image
            source={require("../../assets/images/Profile1.png")}
            style={styles.avatar}/>
          </View>
          <Text style={styles.username}>{user?.name || textForName}</Text>
          <Text style={styles.email}>{user?.email || textForName}</Text>
        </View>
      </View>

      {/* Разделитель */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider}/>
      </View>


      {/* Основнй контент */}

      <View style={styles.body}>

        <View style={styles.mainMenu}>
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => openScreen(SettingsScreen)}>
              <Text style={styles.menuText}>Настройки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => openScreen(FavoriteScreen)}>
              <Text style={styles.menuText}>Избранное</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => openScreen(HistoryScreen)}>
              <Text style={styles.menuText}>История</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Разделитель */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider}/>
        </View>

        <View style={styles.bottomMenu}>
          { ADMIN &&
            <TouchableOpacity style={styles.menuItem} onPress={() => openScreen(OfferScreen)}>
              <Text style={styles.menuText}>Добавить место</Text>
            </TouchableOpacity>
          }
          
          <TouchableOpacity style={styles.menuItem} onPress={() => openScreen(AboutUsScreen)}>
            <Text style={styles.menuText}>О приложении</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => openScreen(FeedBackScreen)}>
            <Text style={styles.menuText}>Тех поддержка</Text>
          </TouchableOpacity>
        </View>
        
        {/* Разделитель */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider}/>
        </View>

        <View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
            <Text style={styles.logoutText}>Выйти</Text>
          </TouchableOpacity>
        </View>

      </View>


    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },

  // Шапка с аватаром и краткой инфо о юзере
  header: {
    height: '33%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,

  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarConainer: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderColor: 'transparent',
    marginBottom: 10
  },
  avatar: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },

  dividerContainer: {
    alignItems: 'center'
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },

  // Основной контент
  
  menuSection: {
    marginBottom: 8,
  },
  bottomMenu: {
    marginTop: 8,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#1A1A1A',
  },

  // Кнопка выхода
  logoutButton: {
    backgroundColor: '#ff3b30', // Красный
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});