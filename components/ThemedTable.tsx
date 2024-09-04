import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Pedido } from '@/app/context/appContext';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from "@/components/ThemedText";
import { useAppContext } from '@/app/context/appContext';

type ThemedTableProps = {
  data: Pedido[];
  onRemoveItem: (id: number) => void;
};

export function ThemedTable({ data, onRemoveItem }: ThemedTableProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const { addFoto, state } = useAppContext();

  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [canhotoPhoto, setCanhotoPhoto] = useState<string | null>(null);
  const [productPhoto, setProductPhoto] = useState<string | null>(null);

  const openCamera = async (setPhoto: React.Dispatch<React.SetStateAction<string | null>>, tipo: 'documento' | 'canhoto' | 'produto') => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
      if (selectedPedidoId !== null) {
        addFoto(selectedPedidoId, tipo, result.assets[0].uri);
      }
    } else {
      Alert.alert('Aviso', 'A captura de imagem foi cancelada.');
    }
  };

  const handlePhotoPress = (pedidoId: number) => {
    setSelectedPedidoId(pedidoId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDocPhoto(null);
    setCanhotoPhoto(null);
    setProductPhoto(null);
    setSelectedPedidoId(null);
  };

  const hasAllPhotos = (pedidoId: number) => {
    const fotos = state.fotos[pedidoId];
    return fotos && fotos.documento && fotos.canhoto && fotos.produto;
  };

  useEffect(() => {
    if (selectedPedidoId) {
      const fotos = state.fotos[selectedPedidoId];
      if (fotos) {
        setDocPhoto(fotos.documento || null);
        setCanhotoPhoto(fotos.canhoto || null);
        setProductPhoto(fotos.produto || null);
      }
    }
  }, [selectedPedidoId, state.fotos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.idColumn]}>Pedido</Text>
        <Text style={[styles.headerText, styles.clientColumn]}>Cliente</Text>
        <Text style={[styles.headerText, styles.dateColumn]}>Data</Text>
        <Text style={[styles.headerText, styles.operationsColumn]}>Operações</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.ID_PEDIDO.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.idColumn}>
              <Text style={styles.cell}>{item.ID_PEDIDO}</Text>
            </View>
            <View style={styles.clientColumn}>
              <Text style={styles.cell} numberOfLines={2} ellipsizeMode="tail">{item.NM_CLIENTE}</Text>
            </View>
            <View style={styles.dateColumn}>
              <Text style={styles.cell}>{new Date(item.DT_PEDIDO).toLocaleDateString()}</Text>
            </View>
            <View style={styles.operationsColumn}>
              <TouchableOpacity onPress={() => handlePhotoPress(item.ID_PEDIDO)}>
                {hasAllPhotos(item.ID_PEDIDO) ? (
                  <MaterialIcons name="check-circle" size={20} color="green" />
                ) : (
                  <MaterialIcons name="photo-camera" size={20} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemoveItem(item.ID_PEDIDO)}>
                <MaterialIcons name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Capturar Fotos</ThemedText>
            <View style={styles.photoButtonsContainer}>
              <TouchableOpacity onPress={() => openCamera(setDocPhoto, 'documento')} style={styles.photoButton}>
                <Ionicons name={docPhoto ? "checkmark-circle" : "document-text-outline"} size={24} color="#fff" />
                <ThemedText style={styles.buttonText}>Documento</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openCamera(setCanhotoPhoto, 'canhoto')} style={styles.photoButton}>
                <Ionicons name={canhotoPhoto ? "checkmark-circle" : "receipt-outline"} size={24} color="#fff" />
                <ThemedText style={styles.buttonText}>Canhoto</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openCamera(setProductPhoto, 'produto')} style={styles.photoButton}>
                <Ionicons name={productPhoto ? "checkmark-circle" : "cube-outline"} size={24} color="#fff" />
                <ThemedText style={styles.buttonText}>Produto</ThemedText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Fechar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    alignItems: 'center',
  },
  cell: {
    color: '#333',
  },
  idColumn: {
    width: '20%',
    alignItems: 'center',
  },
  clientColumn: {
    width: '30%',
    alignItems: 'center',
  },
  dateColumn: {
    width: '25%',
    alignItems: 'center',
  },
  operationsColumn: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  closeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
