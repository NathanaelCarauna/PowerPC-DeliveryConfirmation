import { useState, useEffect } from 'react';
import { TouchableOpacity, Image, Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// Adicione estas interfaces
interface ItensDto {
  ID_ITEM_PROCESSO_VENDA_PRODUTO: number;
  ID_PROCESSO_VENDA: number;
  ID_PRODUTO: number;
  NM_PRODUTO: string;
  QN_PRODUTO: number;
}

interface RetornoPedidoDto {
  ID_PEDIDO: number;
  NM_CLIENTE: string;
  DT_PEDIDO: Date;
  ID_PROCESSO_VENDA: number;
  DOC_CLIENTE: string;
  ITENS: ItensDto[];
}

export default function DeliveryEvidencies() {
  const router = useRouter();

  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [canhotoPhoto, setCanhotoPhoto] = useState<string | null>(null);
  const [productPhoto, setProductPhoto] = useState<string | null>(null);

  const [pedidos, setPedidos] = useState<RetornoPedidoDto[]>([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados de exemplo com múltiplos pedidos e IDs de produtos de 5 dígitos
      const pedidosExemplo: RetornoPedidoDto[] = [
        {
          ID_PEDIDO: 1,
          NM_CLIENTE: "João Silva",
          DT_PEDIDO: new Date(2023, 4, 15),
          ID_PROCESSO_VENDA: 123,
          DOC_CLIENTE: "123.456.789-00",
          ITENS: [
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 1, ID_PROCESSO_VENDA: 123, ID_PRODUTO: 10001, NM_PRODUTO: "Smartphone Galaxy S21", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 2, ID_PROCESSO_VENDA: 123, ID_PRODUTO: 10002, NM_PRODUTO: "Capa protetora", QN_PRODUTO: 2 },
          ]
        },
        {
          ID_PEDIDO: 2,
          NM_CLIENTE: "Maria Santos",
          DT_PEDIDO: new Date(2023, 4, 16),
          ID_PROCESSO_VENDA: 124,
          DOC_CLIENTE: "987.654.321-00",
          ITENS: [
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 3, ID_PROCESSO_VENDA: 124, ID_PRODUTO: 20001, NM_PRODUTO: "Notebook Dell Inspiron", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 4, ID_PROCESSO_VENDA: 124, ID_PRODUTO: 20002, NM_PRODUTO: "Mouse sem fio", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 5, ID_PROCESSO_VENDA: 124, ID_PRODUTO: 20003, NM_PRODUTO: "Mochila para notebook", QN_PRODUTO: 1 },
          ]
        },
        {
          ID_PEDIDO: 3,
          NM_CLIENTE: "Carlos Ferreira",
          DT_PEDIDO: new Date(2023, 4, 17),
          ID_PROCESSO_VENDA: 125,
          DOC_CLIENTE: "456.789.123-00",
          ITENS: [
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 6, ID_PROCESSO_VENDA: 125, ID_PRODUTO: 30001, NM_PRODUTO: "Smart TV 55\"", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 7, ID_PROCESSO_VENDA: 125, ID_PRODUTO: 30002, NM_PRODUTO: "Soundbar", QN_PRODUTO: 1 },
          ]
        },
        {
          ID_PEDIDO: 4,
          NM_CLIENTE: "Ana Oliveira",
          DT_PEDIDO: new Date(2023, 4, 18),
          ID_PROCESSO_VENDA: 126,
          DOC_CLIENTE: "789.123.456-00",
          ITENS: [
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 8, ID_PROCESSO_VENDA: 126, ID_PRODUTO: 40001, NM_PRODUTO: "Câmera DSLR", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 9, ID_PROCESSO_VENDA: 126, ID_PRODUTO: 40002, NM_PRODUTO: "Lente 50mm", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 10, ID_PROCESSO_VENDA: 126, ID_PRODUTO: 40003, NM_PRODUTO: "Tripé", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 11, ID_PROCESSO_VENDA: 126, ID_PRODUTO: 40004, NM_PRODUTO: "Cartão de memória 64GB", QN_PRODUTO: 2 },
          ]
        },
        {
          ID_PEDIDO: 5,
          NM_CLIENTE: "Roberto Almeida",
          DT_PEDIDO: new Date(2023, 4, 19),
          ID_PROCESSO_VENDA: 127,
          DOC_CLIENTE: "321.654.987-00",
          ITENS: [
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 12, ID_PROCESSO_VENDA: 127, ID_PRODUTO: 50001, NM_PRODUTO: "Console PlayStation 5", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 13, ID_PROCESSO_VENDA: 127, ID_PRODUTO: 50002, NM_PRODUTO: "Controle extra", QN_PRODUTO: 1 },
            { ID_ITEM_PROCESSO_VENDA_PRODUTO: 14, ID_PROCESSO_VENDA: 127, ID_PRODUTO: 50003, NM_PRODUTO: "Jogo FIFA 23", QN_PRODUTO: 1 },
          ]
        },
      ];
      
      setPedidos(pedidosExemplo);
    };

    carregarPedidos();
  }, []);

  async function openCamera(setPhoto: React.Dispatch<React.SetStateAction<string | null>>) {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    } else {
      Alert.alert('Aviso', 'A captura de imagem foi cancelada.');
    }
  }

  function handleSignPress() {
    if (docPhoto && canhotoPhoto && productPhoto) {
      console.log("Assinatura permitida");
      router.push('/documentPreview');
    } else {
      Alert.alert('Aviso', 'Todas as fotos são obrigatórias.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <LogoBackground showLabel={false} />
      <ThemedText style={styles.title}>Comprovação de entrega</ThemedText>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.pedidosContainer}>
          {pedidos.map((pedido, index) => (
            <View key={pedido.ID_PEDIDO} style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <ThemedText style={styles.clienteName}>{pedido.NM_CLIENTE}</ThemedText>
                <ThemedText style={styles.pedidoId}>Pedido #{pedido.ID_PEDIDO}</ThemedText>
              </View>
              <View style={styles.pedidoInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <ThemedText style={styles.infoText}>{pedido.DT_PEDIDO.toLocaleDateString()}</ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="document-text-outline" size={16} color="#666" />
                  <ThemedText style={styles.infoText}>{pedido.DOC_CLIENTE}</ThemedText>
                </View>
              </View>
              <View style={styles.itensList}>
                {pedido.ITENS.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.itemRow}>
                    <View style={styles.itemNameContainer}>
                      <ThemedText style={styles.itemCode}>{item.ID_PRODUTO} - </ThemedText>
                      <ThemedText style={styles.itemName}>{item.NM_PRODUTO}</ThemedText>
                    </View>
                    <ThemedText style={styles.itemQuantity}>{item.QN_PRODUTO}x</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.photoButtonsContainer}>
        <TouchableOpacity onPress={() => openCamera(setDocPhoto)} style={styles.photoButton}>
          <Ionicons name={docPhoto ? "checkmark-circle" : "document-text-outline"} size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Documento</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera(setCanhotoPhoto)} style={styles.photoButton}>
          <Ionicons name={canhotoPhoto ? "checkmark-circle" : "receipt-outline"} size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Canhoto</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera(setProductPhoto)} style={styles.photoButton}>
          <Ionicons name={productPhoto ? "checkmark-circle" : "cube-outline"} size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Produto</ThemedText>
        </TouchableOpacity>
      </View>

      <CustomButton 
        title="Assinar e Finalizar" 
        onPress={handleSignPress}
        style={styles.signButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  pedidosContainer: {
    paddingBottom: 20,
  },
  pedidoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clienteName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pedidoId: {
    fontSize: 14,
    color: '#666',
  },
  pedidoInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  itensList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemNameContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  itemCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 5,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'right',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#0f3a6d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  signButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
  },
});
