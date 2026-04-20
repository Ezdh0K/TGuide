import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authCheck();
    }, []);

    const authCheck = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('userData');
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Auth check error: ', error);
        } finally { setIsLoading(false); }
    };

    const signIn = async (userData, token) => {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData)
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, signIn, signOut }}>
            { children }
        </AuthContext.Provider>
    );

};