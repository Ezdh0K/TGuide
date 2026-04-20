import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InfoCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export default function AboutUsScreen() {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>О приложении</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InfoCard title="TGuide">
          <Text style={styles.description}>
            TGuide — это удобный городской гид, который помогает быстро находить интересные места рядом
            с вами: кафе, парки, культурные пространства и другие полезные локации. Приложение создано, 
            чтобы упростить выбор, когда хочется провести время с пользой и без долгих поисков. Вы можете 
            просматривать карточки мест, добавлять понравившиеся в избранное и возвращаться к уже 
            просмотренным вариантам через историю. Мы делаем упор на понятный интерфейс, аккуратную подачу 
            информации и комфортную навигацию, чтобы поиск нового места занимал минимум времени. Наша цель — 
            сделать знакомство с городом проще, приятнее и доступнее для каждого пользователя.
          </Text>
        </InfoCard>

        <InfoCard title="Контакты">
          <InfoRow label="Email" value="c0nterdash@gmail.com" />
          <InfoRow label="Telegram" value="@Medvedev006" />
        </InfoCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  cardBody: {
    gap: 10,
  },
  description: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLabel: {
    color: '#374151',
    fontSize: 14,
  },
  rowValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});