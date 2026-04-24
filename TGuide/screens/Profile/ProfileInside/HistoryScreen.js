import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/authContext';
import back from '../../../services/back';

export default function HistoryScreen() {
    const navigation = useNavigation();
    const [historyPlaces, setHistoryPlaces] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const USER_ID = user?.id ?? user?.user_id ?? null;
    if (!USER_ID) {
        console.log("USER_ID отсутствует:", user);
    }
    
    const goBack = () => {
        navigation.goBack();
    };

    const clearOld = async () => {
        try {
            await back.delete('/history', {params: { userId: USER_ID } });
            await loadHistory();
        }
        catch (err) { console.error('Ошибка при удалении мест:', err.response?.status, err.response?.data || err.message); }
    };

    const loadHistory = async () => {
        if (!USER_ID) return;
        try {
            const { data } = await back.get('/history', { params: { userId: USER_ID } });
            setHistoryPlaces(Array.isArray(data) ? data : []);
        } catch (err) { console.error('Ошибка загрузки Истории: ', err); setHistoryPlaces([])}
    };

    const loadFavorites = async () => {
        if (!USER_ID) return;
        try {
            const { data } = await back.get('/favorites', { params: { userId: USER_ID } });
            setFavorites(Array.isArray(data) ? data.map(f => String(f.place_id)) : []);
        } catch (err) { console.error('Ошибка загрузки избранного:', err); }
    };

    useFocusEffect(
        useCallback(() => {
            if (!USER_ID) return;
            
            loadHistory();
            loadFavorites();
        }, [USER_ID])
    );

    const openPlaceDetail = (place) => navigation.navigate('PlaceDetail', { place });

    const isFavorite = (placeId) => favorites.includes(String(placeId));

    const toggleFavorite = async (placeId) => {
        const id = String(placeId);
        try {
            if (isFavorite(id)) {
                await back.delete(`/favorites/${id}?userId=${USER_ID}`);
                setFavorites(prev => prev.filter(p => p !== id));
            } else {
                await back.post('/favorites', { placeId: id, userId: USER_ID });
                setFavorites(prev => [...prev, id]);
            }
        } catch (err) {
            console.error('Ошибка toggleFavorite:', err);
        }};

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>История просмотров</Text>
            </View>

            {historyPlaces.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>История просмотров пуста</Text>
                </View>)}

            <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
                { historyPlaces.map(place => 
                    <View key={`${place.place_id}-${place.viewed_at || 'na'}`} style={styles.placeCard}>
                
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
                        
                            {/* <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, styles.openStatus]}>
                                    🕒 {place.place_status}
                                </Text>
                            </View> */}
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
        backgroundColor: 'white',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },

    //кнопка выхода
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
    contentContainer: {
        flexGrow: 1,
        paddingTop: 100,
        paddingBottom: 90,
        paddingHorizontal: 16
    },

    //Название экрана
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

    //Стили карточки
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

    //footer
    footer: {
        marginTop: 'auto',
        marginBottom: 70,
        bottom: 0,
        height: 80,
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    clearButtonContainer: {
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        width: '60%',
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 25
    },
});