import React, { useState, useEffect } from 'react';
import { GestureResponderEvent, StyleSheet, View, Keyboard, Button, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedTable } from "@/components/ThemedTable";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useAppContext } from './context/appContext';

export default function Home() {
  const router = useRouter();  
  const { state, fetchPedido, removePedido } = useAppContext();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');

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

    try {
      await fetchPedido(pedidoId);
      console.log("Home - Pedido buscado com sucesso");
      setSearchQuery('');
      Keyboard.dismiss();
    } catch (error) {
      console.error("Home - Erro ao buscar pedido:", error);
      Alert.alert("Erro", "Não foi possível buscar o pedido. Tente novamente.");
    }
  };

  const handleDelivery = (event: GestureResponderEvent): void => {
    console.log("Home - Botão de entrega pressionado");
    router.push('/deliveryEvidencies');
  };

  const handleBarcodeScan = () => {
    if (hasPermission) {
      console.log("Home - Iniciando escaneamento de código de barras");
      setScanning(true);
    } else {
      console.log("Home - Permissão de câmera não concedida");
      Alert.alert("Erro", "É necessária permissão para a câmera para escanear códigos de barras");
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    console.log("Home - Código de barras detectado:", data);
    setScanning(false);    
    handleSearch(data);
  };

  const handleRemoveItem = (id: number) => {
    console.log("Home - Removendo item:", id);
    Alert.alert(
      "Remover Pedido",
      "Tem certeza que deseja remover este pedido?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            removePedido(id);
            console.log("Home - Pedido removido:", id);
          }
        }
      ]
    );
  };

  if (scanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", 'code128', 'code39','code93'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.cameraOverlay}>
            <Button title="Cancelar" onPress={() => setScanning(false)} />
          </View>
        </CameraView>
      </View>
    );
  }

  const hasPedidos = state.pedidos.length > 0;

  return (
    <ThemedView style={styles.container}>
      <LogoBackground />
      <ThemedView style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="barcode-scan"
          size={20}
          color="black"
          onPress={handleBarcodeScan}
          style={styles.icon}
        />
        <ThemedInputText
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar pedido"
          onSubmitEditing={e => handleSearch(e.nativeEvent.text)}
        />
        <MaterialIcons
          name="search"
          size={20}
          color="black"
          onPress={() => handleSearch(searchQuery)}
          style={styles.searchIcon}
        />
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedTable data={state.pedidos} onRemoveItem={handleRemoveItem} />
        <CustomButton 
          title="Entregar" 
          onPress={handleDelivery}
          disabled={!hasPedidos}
          style={!hasPedidos ? styles.disabledButton : {}}
        />
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
});
