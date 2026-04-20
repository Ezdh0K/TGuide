// screens/CardScreen.js
import { useNavigation } from '@react-navigation/native';
import { View, Linking, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import back from '../services/back';

// ОБЯЗАТЕЛЬНО export default function
export default function PlaceDetailScreen({ route }) {
  const { place } = route.params;
  const { user } = useAuth();
  const navigation = useNavigation();
  const hasContacts = place.business_phone || place.business_email || place.place_website;

  const goBack = () => {
    navigation.goBack();
  };

  const recordView = async () => {
    const userId = user?.id || user?.user_id;
    if (!userId || !place?.place_id) return;

    try {
      await back.post('/history', {
        userId: userId,
        placeId: place.place_id,
      });
      console.log('Просмотр записан в историю');
    } catch (err) {
      console.error('Ошибка записи в историю:', err);
    }
  };

  useEffect(() => {
    recordView();
  }, [place, user]);

  const makePhoneCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`
    Linking.openURL(url).catch(err => console.error('Ошибка', err));
  };

  return (
    <SafeAreaView  style={styles.container}>
      {/* Кнопка "назад" */}
      <TouchableOpacity  onPress={() => goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Изображение места */}
      <View style={styles.header}>
        <Image
        source={ place.place_image ? {uri: place.place_image} : require('../assets/images/placeHolder.png')}
        style={styles.headerImage}
        />
      </View>
      {/* Информация о месте и взаимодействие с организацией */}
      <View style={styles.body}>
        <ScrollView
        showsVerticalScrollIndicator={false}>
              
          {/* Категория */}
          <Text style={styles.h6}>{place.place_category}</Text>
          {/* Название */}
          <Text style={styles.placeTitle}>{place.place_name}</Text>
          {/* Адрес */}
          <Text style={styles.h6}>{place.place_address}</Text>

          {/* Кнопка карты */}
          <View style={styles.mapButton}>
            <Text style={styles.mapButtonText}>На карте</Text>
          </View>
          
          {/* Разделитель */}
          <View style={styles.divider}/>

          {/* Описание */}
          <Text style={styles.place_description}>{place.place_description}</Text>

          {/* Контакты, закрепим к низу */}
          {hasContacts && (
            <View style={styles.contacts}>
              <Text style={styles.contactsTitle}>Контакты</Text>

              <View style={styles.contactsColumn}>
                {/* телефон */}
                {place.business_phone && (
                  <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => {makePhoneCall(place.business_phone)}}>
                    <Text style={styles.contactIcon}><Image style={styles.contactIconImg} source={ require('../assets/images/phone.png') }/></Text>
                    <Text style={styles.contactText}>{place.business_phone}</Text>
                  </TouchableOpacity>
                )}
                {/* почта */}
                {place.business_email && (
                  <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => {Linking.openURL(`mailto:${place.business_email}`)}}>
                    <Text style={styles.contactIcon}><Image style={styles.contactIconImg} source={ require('../assets/images/email.png') }/></Text>
                    <Text style={styles.contactText}>{place.business_email}</Text>
                  </TouchableOpacity>
                )}
                {/* веб сайт */}
                {place.business_site && (
                  <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => {Linking.openURL(place.business_site)}}>
                    <Text style={styles.contactIcon}><Image style={styles.contactIconImg} source={ require('../assets/images/web.png') }/></Text>
                    <Text style={styles.contactText}>{place.business_site}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //кнопка назад и изображение
  backButton: {
    position: 'absolute',
    top: 50, // подстрой под SafeArea
    left: 20,
    zIndex: 10, // поверх других элементов
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)', // полупрозрачный фон
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 300,
    width: '100%',
    top: 0
  },
  headerImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  // тело с информацией об объекте
  body: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    top: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: -30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  h6: {
    fontSize: 14,
    color: '#666',
  },
  placeTitle: {
    fontSize: 24,
    color: '#000',
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto'
  },
  mapButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginTop: 16,
  },
  mapButtonText: {
    fontSize: 14,
    color: '#0b5cb3',
    fontWeight: '500',
  },
  divider: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  place_description: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 24,
  },
  contacts: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    backgroundColor: '#fff',
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  contactsColumn: {
    // автоматически колонка
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#F0F0F0',
  },
  contactIcon: {
    height: 30,
    width: 30,
    marginRight: 12,
  },
  contactIconImg: {
    height: '100%',
    width: '100%'
  },
  contactText: {
    fontSize: 16,
    color: '#333'
  },
});