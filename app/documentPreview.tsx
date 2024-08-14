import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { GestureResponderEvent } from "react-native";

// Exemplo de dados do pedido (RetornoPedidoDto e ItensDto)
const samplePedido = {
  ID_PEDIDO: 12345,
  NM_CLIENTE: 'João Silva',
  DT_PEDIDO: '2024-08-01T10:00:00',
  ID_PROCESSO_VENDA: 9876,
  DOC_CLIENTE: '123.456.789-00',
  Itens: [
    {
      ID_ITEM_PROCESSO_VENDA_PRODUTO: 1,
      ID_PROCESSO_VENDA: 9876,
      ID_PRODUTO: 101,
      NM_PRODUTO: 'Produto A',
      QN_PRODUTO: 2,
    },
    {
      ID_ITEM_PROCESSO_VENDA_PRODUTO: 2,
      ID_PROCESSO_VENDA: 9876,
      ID_PRODUTO: 102,
      NM_PRODUTO: 'Produto B',
      QN_PRODUTO: 1,
    },
  ],
};

export default function DocumentPreview() {
  const router = useRouter();

  function handlePress(event: GestureResponderEvent): void {
    console.log("Assinar button pressed");
    router.push('/filialSelection');
  }

  return (
    <ThemedView style={styles.container}>
      <LogoBackground showLabel={false}/>
      <ThemedText type="subtitle" style={styles.title}>
        Confirmação de Recebimento de Pedido
      </ThemedText>

      <ScrollView contentContainerStyle={styles.previewContainer}>
        <ThemedView style={styles.documentContainer}>
          <ThemedText style={styles.heading}>Detalhes do Pedido</ThemedText>

          <ThemedText style={styles.text}>
            <ThemedText style={styles.label}>Pedido ID: </ThemedText>
            {samplePedido.ID_PEDIDO}
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.label}>Cliente: </ThemedText>
            {samplePedido.NM_CLIENTE}
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.label}>Data do Pedido: </ThemedText>
            {new Date(samplePedido.DT_PEDIDO).toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.label}>Documento do Cliente: </ThemedText>
            {samplePedido.DOC_CLIENTE}
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.label}>Processo de Venda ID: </ThemedText>
            {samplePedido.ID_PROCESSO_VENDA}
          </ThemedText>

          <ThemedText style={styles.subheading}>Itens do Pedido:</ThemedText>
          {samplePedido.Itens.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <ThemedText style={styles.text}>
                <ThemedText style={styles.label}>Produto: </ThemedText>
                {item.NM_PRODUTO}
              </ThemedText>
              <ThemedText style={styles.text}>
                <ThemedText style={styles.label}>Quantidade: </ThemedText>
                {item.QN_PRODUTO}
              </ThemedText>
            </View>
          ))}

          <ThemedText style={styles.confirmationText}>
            Confirmo que recebi todos os itens listados acima em perfeito estado.
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.buttonContainer}>
        <CustomButton title="Assinar" onPress={handlePress} />
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
  title: {
    marginTop: '10%',
    fontWeight: '900',
    fontSize: 20,
  },
  previewContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 }, // Adiciona sombra nas laterais
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ddd', // Adiciona uma borda leve para destacar o documento
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  confirmationText: {
    marginTop: 30,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
});
