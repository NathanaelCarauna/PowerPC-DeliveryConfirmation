import React, { useEffect, useState } from "react";
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedSelectDropdown } from "@/components/ThemedSelectDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAppContext } from './context/appContext';

export default function FilialSelection() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [selectedFilial, setSelectedFilial] = useState<string>('');

  useEffect(() => {
    console.log("FilialSelection - Estado inicial:", state);
    if (!state.user) {
      console.log("FilialSelection - Usuário não logado, redirecionando para login");
      router.replace('/');
    } else {
      console.log("FilialSelection - Filiais disponíveis:", state.user.filiais);
    }
  }, [state.user]);

  function handlePress(): void {
    console.log("FilialSelection - Botão pressionado. Filial selecionada:", selectedFilial);
    if (!selectedFilial) {
      console.log("FilialSelection - Nenhuma filial selecionada");
      Alert.alert("Erro", "Por favor, selecione uma filial.");
      return;
    }

    const filial = state.user?.filiais.find(f => f.id.toString() === selectedFilial);
    if (filial) {
      console.log("FilialSelection - Filial encontrada:", filial);
      dispatch({ type: 'SET_SELECTED_FILIAL', payload: filial });
      router.push('/home');
    } else {
      console.log("FilialSelection - Filial não encontrada");
      Alert.alert("Erro", "Filial selecionada não encontrada.");
    }
  }

  if (!state.user) {
    console.log("FilialSelection - Renderização cancelada: usuário não logado");
    return null;
  }

  console.log("FilialSelection - Renderizando componente");
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 15,
      }}
    >
      <LogoBackground />
      <ThemedText
        type="subtitle" style={{
          marginTop: '50%',
          fontWeight: '900',
          fontSize: 20,
        }}>Qual a sua filial?</ThemedText>

      <ThemedView
        style={{
          flex: 1,
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
          <Entypo name="home" size={20} style={{ marginRight: 5 }} color="black" />
          <ThemedSelectDropdown
            selectedValue={selectedFilial}
            onValueChange={(itemValue) => {
              console.log("FilialSelection - Nova filial selecionada:", itemValue);
              setSelectedFilial(itemValue);
            }}
            items={state.user.filiais.map(filial => ({
              label: filial.nome,
              value: filial.id.toString()
            }))}
          />
        </ThemedView>
        <CustomButton title="Entrar" onPress={handlePress} />
      </ThemedView>
    </ThemedView>
  );
}
