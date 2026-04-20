import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_HOST =
  Platform.OS === 'web'
    ? 'http://localhost:3001'
    : 'http://192.168.1.2:3001';

const back = axios.create({
  baseURL: `${API_HOST}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

back.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default back;