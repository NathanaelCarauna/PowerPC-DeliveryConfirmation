import { TouchableOpacity, Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from './context/appContext';

export default function DeliveryEvidencies() {
  const router = useRouter();
  const { state, addFoto } = useAppContext();
  const pedidos = state.pedidos;

  async function openCamera(tipo: 'documento' | 'canhoto' | 'produto') {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Aplicar a foto apenas aos pedidos que não possuem foto deste tipo
      pedidos.forEach(pedido => {
        const pedidoFotos = state.fotos[pedido.ID_PEDIDO];
        if (!pedidoFotos || !pedidoFotos[tipo]) {
          addFoto(pedido.ID_PEDIDO, tipo, result.assets[0].uri);
        }
      });
    } else {
      Alert.alert('Aviso', 'A captura de imagem foi cancelada.');
    }
  }

  function handleSignPress() {
    if (allPhotosPresent) {
      console.log("Assinatura permitida");
      router.push('/documentPreview');
    } else {
      Alert.alert('Aviso', 'Todas as fotos são obrigatórias para todos os pedidos.');
    }
  }

  const hasAllPhotos = (pedidoId: number) => {
    const fotos = state.fotos[pedidoId];
    return fotos && fotos.documento && fotos.canhoto && fotos.produto;
  };

  const allPhotosPresent = pedidos.every(pedido => hasAllPhotos(pedido.ID_PEDIDO));

  const anyPedidoMissingPhoto = (tipo: 'documento' | 'canhoto' | 'produto') => {
    return pedidos.some(pedido => {
      const fotos = state.fotos[pedido.ID_PEDIDO];
      return !fotos || !fotos[tipo];
    });
  };

  return (
    <ThemedView style={styles.container}>
      <LogoBackground showLabel={false} />
      <ThemedText style={styles.title}>Comprovação de entrega</ThemedText>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.pedidosContainer}>
          {pedidos.map((pedido) => (
            <View key={pedido.ID_PEDIDO} style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <ThemedText style={styles.clienteName}>{pedido.NM_CLIENTE}</ThemedText>
                <View style={styles.pedidoIdContainer}>
                  <ThemedText style={styles.pedidoId}>Pedido #{pedido.ID_PEDIDO}</ThemedText>
                  {hasAllPhotos(pedido.ID_PEDIDO) && (
                    <MaterialIcons name="check-circle" size={20} color="green" style={styles.checkIcon} />
                  )}
                </View>
              </View>
              <View style={styles.pedidoInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <ThemedText style={styles.infoText}>{new Date(pedido.DT_PEDIDO).toLocaleDateString()}</ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="document-text-outline" size={16} color="#666" />
                  <ThemedText style={styles.infoText}>{pedido.DOC_CLIENTE}</ThemedText>
                </View>
              </View>
              <View style={styles.itensList}>
                {pedido.Itens.map((item, itemIndex) => (
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
        <TouchableOpacity onPress={() => openCamera('documento')} style={styles.photoButton}>
          <Ionicons name={anyPedidoMissingPhoto('documento') ? "document-text-outline" : "checkmark-circle"} size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Documento</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera('canhoto')} style={styles.photoButton}>
          <Ionicons name={anyPedidoMissingPhoto('canhoto') ? "receipt-outline" : "checkmark-circle"} size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Canhoto</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera('produto')} style={styles.photoButton}>
          <Ionicons name={anyPedidoMissingPhoto('produto') ? "cube-outline" : "checkmark-circle"} size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Produto</ThemedText>
        </TouchableOpacity>
      </View>

      <CustomButton 
        title="Assinar e Finalizar" 
        onPress={handleSignPress}
        style={styles.signButton}
        disabled={!allPhotosPresent}
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
  pedidoIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
