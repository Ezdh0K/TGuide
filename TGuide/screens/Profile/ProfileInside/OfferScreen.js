import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import back from '../../../services/back';

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

const DescriptionInput = ({ placeholder, value, setValue }) => (
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


export default function OfferScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [shortDescription, setShortDesc] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('category', category);
            formData.append('address',address);
            formData.append('price', price);
            formData.append('rating', rating);
            formData.append('shortDescription', shortDescription);
            formData.append('phone', phone);
            formData.append('email', email);

            if (imageUri) {
                formData.append('image', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: 'upload.jpg'
                });
            }

            await back.post('/places', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Alert.alert('Успех', 'Место успешно добавлено');JSON
            navigation.goBack();
        } catch (err) {
            console.error('Ошибка при добавлении места: ', err);
            Alert.alert('Ошибка', err.response?.data?.error || 'Не удалось добавить место');
        }
    };

    const pickImage = async () => {
        console.log('pickImage вызвана')
        const { status } = await ImagePicker.requestMediaLibraryPermissionAsync();
        console.log('status', status)
        if (status !== 'granted') {
            Alert.alert('Нужны разрешения', 'Пожалуйста, разрешите доступ к галерее в настройках телефона.')
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
            base64: false,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    const openScreen = (Screen) => {
        navigation.navigate(Screen);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Кнопка выхода назад */}
            <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Шапка с названием экрана */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Добавьте новое место</Text>
            </View>

            {/*  */}
            <ScrollView style={styles.main}>
                {/* Название */}
                <Section title="Введите название места">
                    <InputBlock
                    placeholder="Название места"
                    value={name}
                    setValue={setName}
                    keyboardType="default"/>
                </Section>
                
                {/* Адрес */}
                <Section title="Введите Адрес места">
                    <InputBlock
                    placeholder="Адрес места"
                    value={address}
                    setValue={setAddress}
                    keyboardType="default"/>
                </Section>
                
                {/* Категория */}
                <Section title="Введите категорию места">
                    <InputBlock
                    placeholder="Категория места"
                    value={category}
                    setValue={setCategory}
                    keyboardType="default"/>
                </Section>
                
                {/* Средняя цена посещения */}
                <Section title="Введите средний чек заведения (если есть)">
                    <InputBlock
                    placeholder="Средний чек"
                    value={price}
                    setValue={setPrice}
                    keyboardType="decimal-pad"/>
                </Section>
                
                {/* Рейтинг */}
                <Section title="Рейтинг места">
                    <InputBlock
                    placeholder="Рейтинг"
                    value={rating}
                    setValue={setRating}
                    keyboardType="decimal-pad"/>
                </Section>

                {/* Короткое описание */}
                <Section title="Введите короткое описание места">
                    <DescriptionInput
                    placeholder="Короткое описание места"
                    value={shortDescription}
                    setValue={setShortDesc}/>
                </Section>

                {/* Контакты */}
                <Section title="Введите контакты компании">
                    {/* Телефон */}
                    <InputBlock
                    placeholder="Телефон компании"
                    value={phone}
                    setValue={setPhone}
                    keyboardType="phone-pad"/>
                    {/* Почта */}
                    <InputBlock
                    placeholder="Почта компании"
                    value={email}
                    setValue={setEmail}
                    keyboardType="email-address"/>
                </Section>

                {/* Изображение */}
                <Section title="Добавьте изображение места">
                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                        <Text style={styles.imagePickerText}>Выбрать изображение</Text>
                    </TouchableOpacity>
                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        )}
                </Section>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Предложить место</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

                

                

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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

    imagePickerButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    imagePickerText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginTop: 12,
        resizeMode: 'cover',
    },

    //footer
    footer: {
        marginTop: '2%',
        marginBottom: 30,
        height: 100,
        width: '100%'
    },
    button: {
        height: '60%',

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