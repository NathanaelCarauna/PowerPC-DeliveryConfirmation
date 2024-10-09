import React, { useEffect, useState } from 'react';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { ActivityIndicator, Alert } from "react-native";
import { useAppContext } from './context/appContext';

export default function Index() {
  const router = useRouter();
  const { login, state } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePress() {
    if (!username || !password) {
      Alert.alert("", "Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      // Aguardamos a atualização do estado via useEffect
    } catch (error: any) {
      console.error("Erro no login:", error);
      if(error.message === 'Falha na autenticação'){
        Alert.alert("Aviso", "Usuário ou senha inválidos");
      }else{
        Alert.alert("", "Ocorreu um erro durante o login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Monitora a mudança no estado do usuário
    if (state.user && state.user.authenticated) {
      console.log("Login bem-sucedido");
      router.push('/filialSelection');
    }
  }, [state.user]);

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 15,
      }}
    >
      <LogoBackground labelText="PowerPC - Login"/>

      <ThemedView
        style={{
          flex: 1,
          marginTop: 50,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: 'transparent'
        }}>
        <ThemedView style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          width: '100%'
        }}>
          <Entypo name="email" size={20} style={{ marginRight: 5 }} color="black" />
          <ThemedInputText 
            style={{ flexGrow: 1 }} 
            placeholder="Digite seu e-mail" 
            value={username}
            onChangeText={setUsername}
          />
        </ThemedView>
        <ThemedView style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          width: '100%'
        }}>          
          <MaterialCommunityIcons name="onepassword" size={20} style={{ marginRight: 5 }} color="black" />
          <ThemedInputText 
            style={{ flexGrow: 1 }} 
            placeholder="Digite sua senha" 
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </ThemedView>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <CustomButton title="Acessar" onPress={handlePress} />
        )}
      </ThemedView>
    </ThemedView>
  );
}
