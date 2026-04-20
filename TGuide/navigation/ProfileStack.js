import {createStackNavigator} from '@react-navigation/stack';
import AutorizatedProfileScreen from '../screens/Profile/AutorizatedProfileScreen';

import SettingsScreen from '../screens/Profile/ProfileInside/SettingsScreen';
import FavoriteScreen from '../screens/Profile/ProfileInside/FavoriteScreen';
import HistoryScreen from '../screens/Profile/ProfileInside/HistoryScreen';

import OfferScreen from '../screens/Profile/ProfileInside/OfferScreen';
import AboutUsScreen from '../screens/Profile/ProfileInside/AboutUsScreen';
import FeedBackScreen from '../screens/Profile/ProfileInside/FeedBackScreen';

import EmailChange from '../screens/Profile/SettingsScreens/EmailChange';
import PasswordChange from '../screens/Profile/SettingsScreens/PasswordChange';
const Stack = createStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileMain" component={AutorizatedProfileScreen} options={{ headerShown: false }}></Stack.Screen>

            {/* Основное меню */}
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerShown: false }}></Stack.Screen>

            {/* Нижнее меню (профиля) */}
            <Stack.Screen name="OfferScreen" component={OfferScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="FeedBackScreen" component={FeedBackScreen} options={{ headerShown: false }}></Stack.Screen>
            
            {/* Смена данных аккаунта */}
            <Stack.Screen name="EmailChange" component={EmailChange} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="PasswordChange" component={PasswordChange} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    );
}