import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CustomButton } from "@/components/CustomButtom";
import { useRouter } from "expo-router";
import { useAppContext } from './context/appContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as ScreenOrientation from 'expo-screen-orientation';
import { PedidoEntregue } from './context/modules/types';

type PDFItem = {
  pedidoId: number;
  path: string;
};

export default function DeliveryCompleted() {
  const router = useRouter();
  const { state, generatePDF, sendPedidoEntregue } = useAppContext();
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pdfItems, setPdfItems] = useState<PDFItem[]>([]);

  useEffect(() => {
    const setPortrait = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
    setPortrait();
    generatePDFsForAllPedidos();
  }, []);

  const generatePDFsForAllPedidos = async () => {
    setIsGeneratingPDFs(true);
    const items: PDFItem[] = [];
    try {
      for (const pedido of state.pedidos) {
        const pdfPath = await generatePDF(pedido.ID_PEDIDO);
        items.push({ pedidoId: pedido.ID_PEDIDO, path: pdfPath });
      }
      setPdfItems(items);
    } catch (error) {
      console.error("Erro ao gerar PDFs:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao gerar os PDFs. Por favor, tente novamente.');
    } finally {
      setIsGeneratingPDFs(false);
    }
  };

  const handleOpenPDF = async (path: string) => {
    try {
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(path);
      } else if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(path);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        });
      } else {
        // Para web ou outras plataformas
        console.log('Abrir PDF não suportado nesta plataforma');
      }
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao abrir o PDF.');
    }
  };

  const handleFinish = async () => {
    try {
      setIsSending(true);
      for (const pedido of state.pedidos) {
        const pdfItem = pdfItems.find(item => item.pedidoId === pedido.ID_PEDIDO);
        if (!pdfItem) {
          throw new Error(`PDF não encontrado para o pedido ${pedido.ID_PEDIDO}`);
        }
        const pedidoEntregue: PedidoEntregue = {
          ID_USUARIO: state.user?.id || 0,
          ID_PEDIDO: pedido.ID_PEDIDO,
          Documento: pdfItem.path,
          STATUS: 'PENDENTE',
          DT_PEDIDO: pedido.DT_PEDIDO,
          DT_ENTREGA: new Date().toISOString(),
        };
        await sendPedidoEntregue(pedidoEntregue);
      }
      
      Alert.alert('Sucesso', 'Todos os pedidos foram finalizados.');
      router.replace('/home');
    } catch (error) {
      console.error("Erro ao finalizar pedidos:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao finalizar os pedidos.');
    } finally {
      setIsSending(false);
    }
  };

  const renderPDFItem = ({ item }: { item: PDFItem }) => (
    <TouchableOpacity
      style={styles.pdfItem}
      onPress={() => handleOpenPDF(item.path)}
    >
      <ThemedText style={styles.pdfItemText}>
        PDF do Pedido #{item.pedidoId}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Entrega Concluída</ThemedText>
      <ThemedText style={styles.message}>
        Todos os pedidos foram processados com sucesso.
      </ThemedText>
      
      {isGeneratingPDFs ? (
        <ThemedText style={styles.loadingText}>Gerando PDFs...</ThemedText>
      ) : isSending ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <ThemedText style={styles.loadingText}>Enviando pedidos...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={pdfItems}
          renderItem={renderPDFItem}
          keyExtractor={(item) => item.pedidoId.toString()}
          style={styles.pdfList}
        />
      )}
      
      <CustomButton
        title={isSending ? "Processando..." : "Finalizar"}
        onPress={handleFinish}
        style={styles.button}
        disabled={isGeneratingPDFs || isSending}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Cor de fundo semelhante ao DocumentPreview
    padding: 15, // Adiciona padding
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 30,
    textAlign: 'center', // Centraliza o título
    color: '#333',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#555',
  },
  pdfList: {
    width: '100%',
    marginBottom: 20,
  },
  pdfItem: {
    backgroundColor: '#ffffff', // Fundo branco para os itens
    padding: 15,
    marginBottom: 15,
    borderRadius: 10, // Bordas arredondadas
    elevation: 5, // Sombra para dar profundidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pdfItemText: {
    fontSize: 16,
    color: '#333', // Cor do texto
  },
  button: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',    
  },
});