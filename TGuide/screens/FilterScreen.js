// screens/FilterScreen.js
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FilterScreen({navigation, route}) {
  const params = route?.params || {};
  const {currentFilters, onApplyFilters} = params;

  const goBack = () => {
    navigation.goBack();
  }


  const [filters, setFilters] = useState(currentFilters || {
    category: "Всё",
    minRating: 0,
    maxPrice: null,
    openTime: null,
    closeTime: null,
    onlyOpen: false,
    onlyFavorites: false
  })

  {/* функция применения фильтров */}
  const handleApply = () => {
    if (typeof onApplyFilters === 'function') {
      onApplyFilters(filters);
    }
    goBack();
  };

  {/* функция сброса */}
  const handleReset = () => {
    setFilters({
    category: "Всё",
    minRating: 0,
    maxPrice: null,
    openTime: null,
    closeTime: null,
    onlyOpen: false,
    onlyFavorites: false
    });
  };

  return (
    <SafeAreaView>
      {/* Кнопка "назад" */}
      <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View>
        <View style={styles.topBlock}>
          <View style={styles.header}>
            <Text style={styles.title}>Фильтры</Text>
          </View>

          {/* фильтрация по рейтингу */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Минимальный рейтинг</Text>
            <View style={styles.ratingContainer}>
              {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(rating => (
                <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  filters.minRating === rating && styles.ratingButtonActive
                ]}
                onPress={() => {setFilters({...filters, minRating: rating})}}>
                  <Text
                  style={[styles.ratingText, filters.minRating === rating && styles.ratingTextActive]} >{rating === 0 ? 'Любой' : rating}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* фильтрация по цене */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Максимальная цена</Text>
            <TextInput
            style={styles.priceTextInput}
            placeholder="Введите максимальную цену"
            placeholderTextColor="#999"
            value={filters.maxPrice == null ? '' : String(filters.maxPrice)}
            onChangeText={(text) => {
              const numbersOnly = text.replace(/[^0-9]/g ,'');

              setFilters({
                ...filters,
                maxPrice: numbersOnly === '' ? null : Number(numbersOnly)
              })
            }}
            keyboardType="number-pad"
            />
          </View>

          {/* Статус */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Статус</Text>
            
            <View style={styles.switchRow}>
              <Text>Открыто</Text>
              <Switch
              value={filters.onlyOpen}
              onValueChange={(value) => {setFilters({...filters, onlyOpen: value})}}
              />
            </View>
          </View>

          {/* Избранное */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Избранное</Text>

            <View style={styles.switchRow}>
              <Text>Только избранное</Text>
              <Switch
              value={filters.onlyFavorites}
              onValueChange={(value) => setFilters({...filters, onlyFavorites: value})}
              />
            </View>

            {/* <Text style={styles.sectionTitle}></Text>
            <Switch
            value={filters.onlyFavorites}
            onValueChange={(value) => setFilters({...filters, onlyFavorites: value})}
            /> */}
          </View>

        </View>

        {/* Кнопки снизу */}
        <View style={[styles.bottomBlock, styles.section]}>
          <View style={styles.switchRowContainer}>
            <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {handleReset()}}>
            <Text style={styles.resetText}>Сбросить</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {handleApply()}}>
            <Text style={styles.applyText}>Применить</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBlock: {height: 'auto'},
  bottomBlock: {height: 'auto'},
  
  backButton: {
    position: 'absolute',
    top: 30, // подстрой под SafeArea
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
    top: 0,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0' 
  },
  title: {
    fontSize: 28,
    color: 'black',
    fontWeight: 'bold',
    marginHorizontal: 16
  },
  section: {
    backgroundColor: '#fff', 
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#333' },
  ratingContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ratingButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  ratingButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  ratingText: { fontSize: 14, color: '#666' },
  ratingTextActive: { color: '#fff', fontWeight: '600' },
  priceTextInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  switchRowContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetButton: {
    height: 'auto',
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center'
  },
  resetText: { fontSize: 16, color: '#666', fontWeight: '600' },
  applyButton: {
    height: 'auto',
    flex: 1, 
    padding: 16, 
    backgroundColor: '#007AFF', 
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center'
  },
  applyText: { fontSize: 16, color: '#fff', fontWeight: '600' }
});