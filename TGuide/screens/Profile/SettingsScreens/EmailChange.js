import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import back from '../../../services/back';
import { useAuth } from '../../../context/authContext';

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBody}>{children}</View>
    </View>
);

const InputBlock = ({ placeholder, value, setValue, keyboardType }) => (
    <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        />
    </View>
);

export default function EmailChange() {
    const navigation = useNavigation();
    const { user, setUser } = useAuth();
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const goBack = () => {
        navigation.goBack();
    };

    const handleChangeEmail = async () => {
        if (!newEmail) {
            Alert.alert('Ошибка', 'Заполните поле почты');
            return;
        }

        Alert.alert(
            'Подтверждение смены email',
            `Вы уверены, что хотите сменить email на ${newEmail}?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Сменить',
                    style: 'default',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await back.put('/users/email', { newEmail, password });
                            Alert.alert('Успех', 'Почта обновлена');
                            setUser(prev => ({ ...prev, email: newEmail }));
                            navigation.goBack();
                        } catch (err) {
                            const msg = err.response?.data?.error || 'Ошибка смены почты';
                            Alert.alert('Ошибка', msg);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Кнопка выхода */}
            <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Шапка с названием экрана */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Смена почты</Text>
            </View>

            {/* Поля ввода */}
            <View style={styles.main}>
                <Section title="Новая почта">
                    <InputBlock
                    placeholder="Введите новую почтув"
                    value={newEmail}
                    setValue={setNewEmail}
                    keyboardType="email-address"/>
                </Section>
                
                <Section title="Пароль">
                    <InputBlock
                    placeholder="Введите пароль"
                    value={password}
                    setValue={setPassword}
                    keyboardType="default"/>
                </Section>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleChangeEmail} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Отправка...' : 'Сменить почту'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
                
        </SafeAreaView>
    );
        
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    //Кнопка выхода
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

    //Заголовок
    header: {
        height: 80,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerText: {
        fontWeight: '600',
        fontSize: 18,
    },

    //Контент
    main: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: '7%',
        marginBottom: 60,
    },
    section: {
        width: '100%',
        borderColor: '#F0F0F0',
        borderWidth: 1,
        borderRadius: 15,
        padding: 12,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 16,
        color: '#333',
        flexWrap: 'wrap',
        wordBreak: 'break-all'
    },
    sectionBody: {},

    inputContainer: {
        borderRadius: 15,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 5,
        height: 42,
        width: '85%',
        paddingHorizontal: 15,
        justifyContent: "center",

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        height: '100%',
        width: '100%',
        fontSize: 16,
        paddingVertical: 0,
        margin: 0,
        textAlignVertical: 'center',
        includeFontPadding: false,
    },

    //footer
    footer: {
        marginTop: '2%',
        marginBottom: 30,
        height: 100,
        width: '100%'
    },
    button: {
        height: '45%',

        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 10,

        alignItems: 'center',
        justifyContent: 'center',
        
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
});