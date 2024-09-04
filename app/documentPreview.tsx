import React from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from './context/appContext';

export default function DocumentPreview() {
  const router = useRouter();
  const { state } = useAppContext();
  const pedidos = state.pedidos;

  function handlePress() {
    console.log("Assinar button pressed");
    router.push('/signatureScreen');
  }

  return (
    <ThemedView style={styles.container}>
      <LogoBackground showLabel={false}/>
      <ThemedText style={styles.title}>Confirmação de Recebimento</ThemedText>

      <ScrollView style={styles.scrollContainer}>
        {pedidos.map((pedido) => (
          <View key={pedido.ID_PEDIDO} style={styles.documentContainer}>
            <View style={styles.pedidoHeader}>
              <ThemedText style={styles.clienteName}>{pedido.NM_CLIENTE}</ThemedText>
              <ThemedText style={styles.pedidoId}>Pedido #{pedido.ID_PEDIDO}</ThemedText>
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
              <View style={styles.infoRow}>
                <Ionicons name="briefcase-outline" size={16} color="#666" />
                <ThemedText style={styles.infoText}>Processo: {pedido.ID_PROCESSO_VENDA}</ThemedText>
              </View>
            </View>

            <ThemedText style={styles.subheading}>Itens do Pedido:</ThemedText>
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

            <ThemedText style={styles.subheading}>Fotos:</ThemedText>
            <View style={styles.photosContainer}>
              {state.fotos[pedido.ID_PEDIDO]?.documento && (
                <View style={styles.photoItem}>
                  <Image source={{ uri: state.fotos[pedido.ID_PEDIDO].documento }} style={styles.photoThumbnail} />
                  <ThemedText style={styles.photoLabel}>Documento</ThemedText>
                </View>
              )}
              {state.fotos[pedido.ID_PEDIDO]?.canhoto && (
                <View style={styles.photoItem}>
                  <Image source={{ uri: state.fotos[pedido.ID_PEDIDO].canhoto }} style={styles.photoThumbnail} />
                  <ThemedText style={styles.photoLabel}>Canhoto</ThemedText>
                </View>
              )}
              {state.fotos[pedido.ID_PEDIDO]?.produto && (
                <View style={styles.photoItem}>
                  <Image source={{ uri: state.fotos[pedido.ID_PEDIDO].produto }} style={styles.photoThumbnail} />
                  <ThemedText style={styles.photoLabel}>Produto</ThemedText>
                </View>
              )}
            </View>

            <ThemedText style={styles.confirmationText}>
              Confirmo que recebi todos os itens listados acima em perfeito estado.
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      <CustomButton 
        title="Assinar e Finalizar" 
        onPress={handlePress}        
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
  documentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 15,
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
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
  confirmationText: {
    marginTop: 30,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  photoItem: {
    alignItems: 'center',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  photoLabel: {
    fontSize: 12,
    color: '#666',
  },
});
