import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import back from '../services/back';

const categories = 
[
  {id: 1, name: "Всё"},
  {id: 2, name: "Еда"},
  {id: 3, name: "Парки и природа"},
  {id: 4, name: "История"},
  {id: 5, name: "Искусство"},
  {id: 6, name: "Спорт и активность"},
  {id: 7, name: "Здоровье"},
];

export default function HomeScreen() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Всё');
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();
  const USER_ID = user?.id || user?.user_id;
  const [isToggling, setIsToggling] = useState(false);
  
  const navigation = useNavigation();

  {/* Выкачка с сервера избранных мест */}

  const toId = (value) => String(value);

  const isFavorite = (placeId) => favorites.includes(toId(placeId));

  const loadFavorites = async () => {
    try {
      const { data } = await back.get('/favorites', { params: { userId: USER_ID } });
      setFavorites((data || []).map((f) => toId(f.place_id)));
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err.response?.status, err.response?.data || err.message);
      setFavorites([]);
    }
  };

  {/* Переключение избранное/не */}
  const toggleFavorite = async (placeId) => {
    const id = toId(placeId);
    if (isToggling) return;
    setIsToggling(true);

    try {
      if (isFavorite(id)) {
        await back.delete(`/favorites/${id}`, { params: { userId: USER_ID } });
        setFavorites((prev) => prev.filter((x) => x !== id));
        return;
      }

      await back.post('/favorites', { userId: USER_ID, placeId: id });
      setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));

      await loadFavorites();
    } catch (err) {
      if (err.response?.status === 409) {
        setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
        return;
      }

      console.error('Ошибка toggleFavorite:', err.response?.status, err.response?.data || err.message);
    } finally {
        setIsToggling(false);
      }
  };


  const openPlaceDetail = (place) => {
    navigation.navigate('PlaceDetail', {place});
  };
  
  const openFilters = () => {
    navigation.navigate('FilterScreen', {
      currentFilters: filters,
      onApplyFilters: (newFilters) => {
        setFilters(newFilters);
      }
    });
  };
  
  {/* Функция преобразования времени */}
  const isOpenPlace = (place) => {
    if (typeof place.place_status === 'string') {
      return place.place_status.toLowerCase().includes('открыт');
    }
    if (!place.openTime || !place.closeTime) {
      return true;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [openHour, openMinute] = place.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = place.closeTime.split(':').map(Number);

    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const openTotalMinutes = openHour * 60 + openMinute;
    const closeTotalMinutes = closeHour * 60 + closeMinute;

    return currentTotalMinutes >= openTotalMinutes &&
          currentTotalMinutes < closeTotalMinutes;
  };

  {/* Начальные фильтры, их состояние и их изменение */}
  const [filters, setFilters] = useState({
    category: "Всё",
    minRating: 0,
    maxPrice: null,
    openTime: null,
    closeTime: null,
    onlyFavorites: false,
    onlyOpen: false
  });

  {/* Функция фильтрации */}
  const filterPlaces = (placesList) => {
    return placesList.filter(place => {
      if (filters.category !== 'Всё') {
        const placeCategory = place.place_category?.toLowerCase() || '';
        if (!placeCategory.includes(filters.category.toLowerCase())) {
          return false;
        }
      }

      if (filters.minRating > 0 && place.place_rating < filters.minRating) {
        return false
      }

      if (filters.maxPrice !== null && place.place_price > filters.maxPrice) {
        return false;
      }

      if (filters.onlyFavorites && !favorite(place.place_id)) {
        return false;
      }

      if (filters.onlyOpen && !isOpenPlace(place)) {
        return false;
      }

      return true;
    })
  };



  {/* Фильтрация мест !под вопросом, надо будет менять! */}
  useEffect(() => {
    let filtered = places;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(place =>
        place.place_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory !== 'Всё') {
      filtered = filtered.filter(place => {
        const placeCategory = place.place_category?.toLowerCase() || '';
        const placeCat = activeCategory.toLowerCase();
        return placeCategory === placeCat;
      }
      );
    }
    filtered = filterPlaces(filtered);

    setFilteredPlaces(filtered);
  }, [searchQuery, activeCategory, places, filters, favorites]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPlaces();
      loadFavorites();
    }, [])
  );

  const fetchPlaces = async () => {
    try {
      const { data } = await back.get('/places');
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки мест:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container1}>
        <Text>Загрузка мест...</Text>
      </View>
    );
  }


  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="auto" />
      {/*// Строка поиска по местам*/}
      <View style={styles.search}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder=  "Поиск..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
        style={styles.filters}
        onPress={() => {openFilters()}}>
          <Image
            style={styles.filtersIcon}
            source={require('../assets/images/FilterIcon.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Категории */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
        horizontal={true} showsHorizontalScrollIndicator={false}
        contentContainerStyle ={styles.categoriesContainer}
        >
          {
            categories.map(category => (
              <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.name && styles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(category.name)}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === category.name && styles.activeCategoryText
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>

      {/* Основной контент с карточками объектов */}
      
      <View style={styles.contentContainer}>

        {/* Заголовок раздела */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{activeCategory}</Text>
          <Text style={styles.sectionCount}>{filteredPlaces.length} мест</Text>
        </View>

        <ScrollView
        style={styles.objectCards}
        showsVerticalScrollIndicator={false}
        >
          {
            filteredPlaces.map(place =>
              <View key={place.place_id} style={styles.placeCard}>
                {/* Изображение */}
                <Image
                style={[
                  styles.placeImage
                ]}
                source={ 
                  place.place_image ? { uri: place.place_image } : require('../assets/images/placeHolder.png')
                }
                resizeMode="cover"
                />

                {/* Контент карточки */}
                <View style={styles.placeContent}>
                  <View style={styles.placeHeader} >
                    <TouchableOpacity style={styles.placeTitleContainer} onPress={() => {openPlaceDetail(place)}}>
                      <Text style={styles.placeTitle}>{place.place_name}</Text>

                      <Image source={require('../assets/images/ArrowIcon.png')} style={styles.placeDetailIndicator}/>
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
            )
          }
        </ScrollView>
      </View>

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
// Стили для строки поиска
   search:
  {
    height: 78,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 0.6,
  },
  filters:
  {
    height: 42,
    width: 42,
    overflow: 'hidden',
  },
  filtersIcon:
  {
    height: '100%',
    width: '100%',
  },
  searchInputContainer:
  {
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    height: 42,
    width: 300,
    paddingHorizontal: 15,
    justifyContent: "center",

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput:
  {
    height: '100%',
    width: '100%',
    fontSize: 16,
    paddingVertical: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

// Категории мест
  categoriesWrapper:
  {
    height: 60,
  },
  categoriesContainer:
  {
    height: '100%',
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: '#e0e0e0',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButton:
  {
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
  categoryText: 
  {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeCategoryButton: {
  backgroundColor: '#007AFF',
  borderColor: '#007AFF',
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: '600',
  },

//Стили для карточки объекта
  contentContainer:
  {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  sectionHeader:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle:
  {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',  
  },
  sectionCount:
  {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
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