import React, { useState, useEffect } from 'react';
import { GestureResponderEvent, StyleSheet, View, Keyboard, Button, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedTable } from "@/components/ThemedTable";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useAppContext } from '../context/appContext';
import { ThemedTableDeliveries } from '@/components/ThemedTableDeliveries';

export default function Deliveries() {
  const router = useRouter();  
  const { state, fetchPedido, removePedido } = useAppContext();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    console.log("Home - Iniciando busca de pedido:", searchQuery);
    const pedidoId = parseInt(searchQuery, 10);
    if (isNaN(pedidoId)) {
      console.log("Home - ID de pedido inválido");
      Alert.alert("Erro", "Por favor, insira um ID de pedido válido.");
      return;
    }

    // Verifica se o pedido já existe na lista
    const pedidoExistente = state.pedidos.find(p => p.ID_PEDIDO === pedidoId);
    if (pedidoExistente) {
      console.log("Home - Pedido já existe na lista:", pedidoId);
      Alert.alert("Aviso", "Este pedido já está na lista.");
      setSearchQuery('');
      Keyboard.dismiss();
      return;
    }

    setIsLoading(true);
    try {
      await fetchPedido(pedidoId);
      console.log("Home - Pedido buscado com sucesso");
      setSearchQuery('');
      Keyboard.dismiss();
    } catch (error) {
      console.error("Home - Erro ao buscar pedido:", error);
      Alert.alert("Erro", "Não foi possível buscar o pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LogoBackground />
      <ThemedView style={styles.searchContainer}>        
        <ThemedInputText
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filtrar pedidos"
          onSubmitEditing={e => handleSearch(e.nativeEvent.text)}
          editable={!isLoading}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" style={styles.searchIcon} />
        ) : (
          <MaterialIcons
            name="search"
            size={20}
            color="black"
            onPress={() => handleSearch(searchQuery)}
            style={styles.searchIcon}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedTableDeliveries data={state.pedidos} />
        {/* Removido: botão de entrega */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  searchContainer: {
    marginTop: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 4,
    backgroundColor: 'white',
  },
  input: {
    flexGrow: 1,
    borderBottomWidth: 0,
    paddingVertical: 0,
    marginBottom: -1,
  },
  searchIcon: {
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
