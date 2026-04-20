import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import back from '../../../services/back';


const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBody}>{children}</View>
    </View>
);

const InputBlock = ({ placeholder, value, setValue }) => (
    <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={setValue}
        />
    </View>
);

const TextArea = ({ placeholder, value, setValue }) => (
    <TextInput
    style={styles.textArea}
    multiline={true}
    numberOfLines={3}
    textAlignVertical="top"
    placeholder={placeholder}
    placeholderTextColor="#999"
    value={value}
    onChangeText={setValue}
    />
);


export default function FeedBackScreen() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [letter, setLetter] = useState('');

    const navigation = useNavigation();
    
    const goBack = () => {
        navigation.goBack();
    };

    const handleSend = async () => {
        if (!email || !name || !letter) {
            Alert.alert('Ошибка', 'Почта, имя и письмо обязательны для заполнения!');
            return;
        }
        try {
            console.log('📤 Отправка на /support с данными:', { email, name, letter });
            await back.post('/support', { email, name, letter });
            Alert.alert('Успех', 'Письмо отправлено');
            setName(''); setEmail(''); setLetter('');
        } catch (err) {
            console.error('❌ Ошибка при отправке:', err);
            const errorMsg = err.response?.data?.error || err.message;
            Alert.alert('Ошибка', errorMsg);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Шапка с названием экрана */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Обратная связь</Text>
            </View>

            <View style={styles.main}>
                <Section title='Почта'>
                    <InputBlock
                    placeholder="Укажите вашу почту"
                    value={email}
                    setValue={setEmail}/>
                </Section>
                
                <Section title='Имя'>
                    <InputBlock
                    placeholder="Укажите ваше имя"
                    value={name}
                    setValue={setName}/>
                </Section>
                
                <Section title='Письмо'>
                    <TextArea
                    placeholder="Опишите ваш вопрос"
                    value={letter}
                    setValue={setLetter}/>
                </Section>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleSend}>
                        <Text style={styles.buttonText}>Отправить письмо</Text>
                    </TouchableOpacity>
                </View>
            </View>

                
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingHorizontal: '3%',
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
    textArea: {
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 100,
        width: '90%',
        textAlignVertical: 'top',
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    //footer
    footer: {
        marginTop: '2%',
        marginBottom: 30,
        height: 100,
        width: '100%'
    },
    button: {
        width: '65%',
        height: '60%',

        backgroundColor: 'white',
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