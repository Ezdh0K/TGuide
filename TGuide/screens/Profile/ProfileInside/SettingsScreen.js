import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import back from '../../../services/back';
import { useAuth } from '../../../context/authContext';
import EmailChange from '../SettingsScreens/EmailChange';
import PasswordChange from '../SettingsScreens/PasswordChange';

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const Row = ({ title, subtitle, danger = false, onPress, right }) => (
  <TouchableOpacity
    style={[styles.row, danger && styles.rowDanger]}
    activeOpacity={0.75}
    onPress={onPress}
  >
    <View style={styles.rowTextWrap}>
      <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    {right || <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
  </TouchableOpacity>
);

  

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const [isClearing, setIsClearing] = useState(false)

  const goBack = () => {
    navigation.goBack();
  };

  const handleClearOld = () => {
    Alert.alert(
      'Очистка истории', 'Вы уверены что хотите удалить историю?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await back.delete('/history');
              Alert.alert('История очищена');
            } catch (err) {
              console.error(err);
              Alert.alert('Ошибка удаления истории');
            } finally { setIsClearing(false) }
          }
        }
      ]);
  };

  const handleDeleteUser = async () => {
    Alert.alert(
      'Удаление аккаунта', 'Вы уверены что хотите удалить свой аккаунт?', [
        { text: 'Отмена', style: 'cancel' }, 
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await back.delete('/users',)
              Alert.alert('Вы удалили свой аккаунт');
              await signOut(); 
              goBack();
              Alert.alert('Аккаунт удалён', 'Вы будете перенаправлены на главную');
            } catch (err) {
              console.error(err);
              Alert.alert('Ошибка удаления аккаунта');
            }
          }
        }
      ]);
  };

  const openScreen = (Screen) => {
    navigation.navigate(Screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Настройки</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Аккаунт">
          <Row title="Сменить почту" subtitle="Изменить привязанную почту" onPress={() => openScreen('EmailChange')} />
          <Row title="Сменить пароль" subtitle="Обновить пароль аккаунта" onPress={() => openScreen('PasswordChange')} />
        </Section>


        <Section title="История и данные">
          <Row
            title="Очистить историю просмотров"
            subtitle="Удалить старые записи истории"
            danger
            onPress={handleClearOld}
            right={<Ionicons name="trash-outline" size={18} color="#EF4444" />}
          />
        </Section>

        <Section title="Опасная зона">
          <Row
            title="Удалить аккаунт"
            subtitle="Действие нельзя отменить"
            danger
            onPress={handleDeleteUser}
            right={<Ionicons name="alert-circle-outline" size={18} color="#EF4444" />}
          />
        </Section>
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
    paddingBottom: 32,
    gap: 12,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  sectionBody: {
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowDanger: {
    backgroundColor: '#FFF5F5',
  },
  rowTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  rowTitleDanger: {
    color: '#B91C1C',
  },
  rowSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },
});