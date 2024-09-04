import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// Exemplos de dados de pedidos atualizados
const samplePedidos = [
  {
    ID_PEDIDO: 12345,
    NM_CLIENTE: 'João Silva',
    DT_PEDIDO: '2024-08-01T10:00:00',
    ID_PROCESSO_VENDA: 9876,
    DOC_CLIENTE: '123.456.789-00',
    Itens: [
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 1, ID_PROCESSO_VENDA: 9876, ID_PRODUTO: 10001, NM_PRODUTO: 'Smartphone Galaxy S21', QN_PRODUTO: 1 },
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 2, ID_PROCESSO_VENDA: 9876, ID_PRODUTO: 10002, NM_PRODUTO: 'Capa protetora', QN_PRODUTO: 2 },
    ],
  },
  {
    ID_PEDIDO: 12346,
    NM_CLIENTE: 'Maria Santos',
    DT_PEDIDO: '2024-08-02T11:30:00',
    ID_PROCESSO_VENDA: 9877,
    DOC_CLIENTE: '987.654.321-00',
    Itens: [
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 3, ID_PROCESSO_VENDA: 9877, ID_PRODUTO: 20001, NM_PRODUTO: 'Notebook Dell Inspiron', QN_PRODUTO: 1 },
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 4, ID_PROCESSO_VENDA: 9877, ID_PRODUTO: 20002, NM_PRODUTO: 'Mouse sem fio', QN_PRODUTO: 1 },
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 5, ID_PROCESSO_VENDA: 9877, ID_PRODUTO: 20003, NM_PRODUTO: 'Mochila para notebook', QN_PRODUTO: 1 },
    ],
  },
  {
    ID_PEDIDO: 12347,
    NM_CLIENTE: 'Carlos Ferreira',
    DT_PEDIDO: '2024-08-03T14:15:00',
    ID_PROCESSO_VENDA: 9878,
    DOC_CLIENTE: '456.789.123-00',
    Itens: [
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 6, ID_PROCESSO_VENDA: 9878, ID_PRODUTO: 30001, NM_PRODUTO: 'Smart TV 55"', QN_PRODUTO: 1 },
      { ID_ITEM_PROCESSO_VENDA_PRODUTO: 7, ID_PROCESSO_VENDA: 9878, ID_PRODUTO: 30002, NM_PRODUTO: 'Soundbar', QN_PRODUTO: 1 },
    ],
  },
];

export default function DocumentPreview() {
  const router = useRouter();

  function handlePress() {
    console.log("Assinar button pressed");
    router.push('/signatureScreen');
  }

  return (
    <ThemedView style={styles.container}>
      <LogoBackground showLabel={false}/>
      <ThemedText style={styles.title}>Confirmação de Recebimento</ThemedText>

      <ScrollView style={styles.scrollContainer}>
        {samplePedidos.map((pedido, pedidoIndex) => (
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
});
