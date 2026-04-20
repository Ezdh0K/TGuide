import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';
import { useAuth } from '../../context/authContext';
import back from '../../services/back';
import { Ionicons } from '@expo/vector-icons';

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

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Ошибка', 'Все поля должны быть заполнены');
            return;
        }
        try {
            const response = await back.post('/auth/register', {name, email, password});
            await signIn( response.data.user, response.data.token )
            goBack();
        }
        catch(error){
            console.error("Register error: ", error)
        }
    }
    
    const goBack = () => {
        navigation.goBack();
    }

  return (
      <SafeAreaView style={styles.container}>
        {/* Кнопка "назад" */}
        <TouchableOpacity  onPress={() => goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
  
        <View style={styles.header}>
            <Text style={styles.headerText}>Создайте аккаунт</Text>
        </View>
        
        {/* Поля ввода */}
        <View style={styles.formWrapper}>
            <Section title="Почта">
                <InputBlock
                placeholder="Введите вашу почту"
                value={email}
                setValue={setEmail}
                keyboardType="email-address"/>
            </Section>

            <Section title="Имя">
                <InputBlock
                placeholder="Введите ваше имя"
                value={name}
                setValue={setName}
                keyboardType="default"/>
            </Section>

            <Section title="Пароль">
                <InputBlock
                placeholder="Введите ваш пароль"
                value={password}
                setValue={setPassword}
                keyboardType="default"/>
            </Section>
        </View>
  
        <View style={styles.sectionRegister}>
          <TouchableOpacity style={styles.enterButton} onPress={() => {handleRegister()}}>
              <Text style={styles.enterText}>
                  Зарегистрироваться
              </Text>
          </TouchableOpacity>
        </View>
          
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        height: '30%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
        },
        headerText: {
        marginTop: 5,
        fontSize: 22,
        fontWeight: '500',
        color: 'black'
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
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
    formWrapper: {
        width: '100%',
        paddingHorizontal: 24
    },
    sectionRegister: {
        width: '100%',
        alignItems: 'center',
        marginTop: 28
    },
    enterButton: {
        width: '80%',
        height: 48,
        backgroundColor: '#007AFF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    enterText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white'
    },
})