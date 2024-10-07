import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useAppContext } from '../context/appContext';
import { ThemedTableDeliveries } from '@/components/ThemedTableDeliveries';
import { PedidoEntregue } from '../context/modules/types';

export default function Deliveries() {
  const router = useRouter();  
  const { state, fetchPedido, removePedido, getPedidosEntregues, retryPendingPedidos } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pedidosEntregues, setPedidosEntregues] = useState<PedidoEntregue[]>([]); 

  useEffect(() => {
    const pedidos = getPedidosEntregues();
    setPedidosEntregues(pedidos);
  }, [state.pedidosEntregues]);

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

  const handleRetryPendingPedidos = async () => {
    setIsLoading(true);
    try {
      await retryPendingPedidos();
      Alert.alert('Sucesso', 'Tentativa de reenvio dos pedidos pendentes iniciada.');
    } catch (error) {
      console.error("Erro ao reenviar pedidos pendentes:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar reenviar os pedidos pendentes.');
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
        <ThemedTableDeliveries data={pedidosEntregues} />         
      </ThemedView>

      <CustomButton 
        title="Reenviar Pedidos Pendentes"
        onPress={handleRetryPendingPedidos}
        disabled={isLoading}
        style={styles.retryButton}
      />
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
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  retryButton: {
    marginTop: 10,
    width: '80%',
  },
});