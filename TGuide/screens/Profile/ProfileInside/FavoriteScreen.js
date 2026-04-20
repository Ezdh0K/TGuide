import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/authContext';
import back from '../../../services/back';

export default function FavoriteScreen() {
    const [favoritePlaces, setFavoritePlaces] = useState([]);
    const navigation = useNavigation();
    const { user } = useAuth();
    const USER_ID = user?.id || user?.user_id;

    const loadFavorites = async () => {
        try {
            const { data } = await back.get('/favorites', { params: { userId: USER_ID } });
            setFavoritePlaces(data || []);
        } catch (err) { console.error('Ошибка загрузки избранного: ', err); setFavoritePlaces([])}
    };

    useEffect(() => {
        loadFavorites();
    }, [USER_ID]);
    
    const goBack = () => {
        navigation.goBack();
    };
    
    const openPlaceDetail = (place) => navigation.navigate('PlaceDetail', { place });
    const isFavorite = () => true;

    const toggleFavorite = async (placeId) => {
        const id = String(placeId);

        try {
            await back.delete(`/favorites/${id}?userId=${USER_ID}`);
            setFavoritePlaces(prev => prev.filter(p => String(p.place_id) !== String(placeId)));
        } catch (err) {
            console.error('Ошибка Удаления из избранного: :', err.response?.status, err.response?.data || err.message);
        } 
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            
            <View style={styles.header}>
              <Text style={styles.title}>Избранное</Text>
            </View>
            
            {/* Лента избранных мест */}
            <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
                { favoritePlaces.map(place =>
                    <View key={place.place_id} style={styles.placeCard}>

                        {/* Изображение места */}
                        <Image
                        style={styles.placeImage}
                        source={ place.place_image ? { uri: place.place_image } : require('../../../assets/images/placeHolder.png') }
                        resizeMode="cover"/>

                        {/* Контент карточки */}
                        <View style={styles.placeContent}>
                            <View style={styles.placeHeader} >
                              <TouchableOpacity style={styles.placeTitleContainer} onPress={() => {openPlaceDetail(place)}}>
                                <Text style={styles.placeTitle}>{place.place_name}</Text>
                        
                                <Image source={require('../../../assets/images/ArrowIcon.png')} style={styles.placeDetailIndicator}/>
                              </TouchableOpacity>
                        
                              {/* Кнопка избранного */}
                              <TouchableOpacity onPress={() => toggleFavorite(place.place_id)}>
                                <Text style={styles.favoriteIcon}>
                                  {isFavorite(place.place_id) ? '♥️' : '🤍'}
                                </Text>
                              </TouchableOpacity>
                              <Text style={styles.placeCategory}>{place.place_category}</Text>
                            </View>
                        
                            <Text style={styles.placeDescription}>{place.short_description}</Text>
                        
                            <View  style={styles.placeDetails}>
                              <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>⭐ {place.place_rating}</Text>
                              </View>
                              
                              <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>📍 {place.place_address}</Text>
                              </View>
                        
                              <View style={styles.detailItem}>
                                  <Text style={[styles.detailLabel, styles.openStatus]}>
                                    🕒 {place.place_status}
                                  </Text>
                              </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  contentContainer: {
    paddingTop: 100,
    paddingBottom: 90,
    paddingHorizontal: 16
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    top: 0,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0' 
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    marginHorizontal: 16
  },
  placeCard:
  {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 18,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  placeImage:
  {
    width: '100%',
    height: 180,
    resizeMode: 'stretch',
    backgroundColor: '#f0f0f0',
  },
  placeContent: {
    padding: 16,
  },
  placeHeader: {
    marginBottom: 8,
  },
  placeTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  placeDetailIndicator: {
    height: 14,
    width: 14,
  },
  placeCategory: {
    fontSize: 14,
    color: '#666',
  },
  placeDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  openStatus: {
    color: '#2ecc71',
    fontWeight: '500',
  },
});