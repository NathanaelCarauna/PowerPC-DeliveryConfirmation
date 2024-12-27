import { Dispatch, useState } from 'react';
import { Action, User, Pedido, FotoTipo, RetornoFilialDto, PedidoEntregue, AppState } from './types';
import { simulateApiCall, simulateFetchPedido, simulateSendPedidoEntregue } from './utils';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = 'http://mail.gpj.com.br:9093/api/'
import {Alert} from 'react-native';
import * as Location from 'expo-location';

const formatarDocumento = (doc: string): { tipo: string, valor: string } => {
    // Remove espaços e caracteres especiais
    const documento = doc.replace(/[^\d]/g, '');
    
    if (documento.length === 11) {
        return {
            tipo: 'CPF',
            valor: documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        };
    } else if (documento.length === 14) {
        return {
            tipo: 'CNPJ',
            valor: documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        };
    }
    
    return {
        tipo: 'Documento',
        valor: doc.trim()
    };
};

export const login = (dispatch: Dispatch<Action>) => async (username: string, password: string) => {
    console.log("AppContext - Iniciando processo de login para o usuário:", username);
    try {
        //Chamada à API para autenticar o usuário
        const response = await fetch(API_BASE_URL+'Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tx_Login: username,
            senha: password,
          }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("AppContext - Login bem-sucedido. Atualizando estado do usuário.");
            await AsyncStorage.setItem('userToken', data.token);
            dispatch({
                type: 'SET_USER',
                payload: {
                    id: data.id,
                    username: data.name,
                    authenticated: true,
                    email: data.email,
                    token: data.token,
                    filiais: data.filiais,
                },
            });
        } else if(response.status == 404){
            console.log("AppContext - Falha na autenticação");
            throw new Error('Falha na autenticação');
        } else{
            console.log("AppContext - Falha de comunicação");
            throw new Error('Falha de comunicação');
        }
    } catch (error: any) {
        if(error.message === 'Falha na autenticação'){
            console.error('AppContext - Erro no login:', error);
            throw new Error('Falha na autenticação');
        }else{
          throw new Error('Falha de comunicação');
        }
    }
};

export const fetchPedido = (dispatch: Dispatch<Action>) => async (idPedido: number, idFilial: number) => {
    console.log("AppContext - Iniciando busca do pedido:", idPedido);
    try {
        //Chamada à API para buscar o pedido
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(API_BASE_URL+'Pedido/CarregarPedidoPorId?idFilial=' + idFilial + '&idPedido=' + idPedido, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        });
        if(response.ok){
          const data = await response.json();
          console.log("AppContext - Pedido encontrado:", idPedido);
          console.log("---------------------", data);
          const pedido: Pedido = {
            ID_PEDIDO: data.id,
            NM_CLIENTE: data.nome_cliente,
            DT_PEDIDO: data.datapedido,
            ID_PROCESSO_VENDA: data.id_processo_venda,
            DOC_CLIENTE: data.documento_cliente,
            Itens: data.itens_Id.map((item: any) => ({
                ID_ITEM_PROCESSO_VENDA_PRODUTO: item.id_item_processo_venda_produto,
                ID_PROCESSO_VENDA: item.id_processo_venda,
                ID_PRODUTO: item.id_produto,
                NM_PRODUTO: item.nm_produto,
                QN_PRODUTO: item.qn_produto,
            })),
        };
          dispatch({
            type: 'ADD_PEDIDO',
            payload: pedido
          });
        }else if(response.status == 404){
          console.log("AppContext - Pedido não encontrado:", idPedido);
          throw new Error('Pedido não encontrado');
        }
    } catch (error: any) {
        console.error('AppContext - Erro ao buscar pedido:', error);
        if (error.message === 'Pedido não encontrado') {
            throw new Error('Pedido não encontrado');
        } else {
            throw new Error('Erro ao buscar pedido');
        }
    }
};

export const removePedido = (dispatch: Dispatch<Action>) => (idPedido: number) => {
    console.log("AppContext - Iniciando remoção do pedido:", idPedido);
    dispatch({
        type: 'REMOVE_PEDIDO',
        payload: idPedido,
    });
};

export const addFoto = (dispatch: Dispatch<Action>) => (pedidoId: number, tipo: FotoTipo, foto: string) => {
    console.log(`AppContext - Adicionando foto ${tipo} ao pedido:`, pedidoId);
    dispatch({
        type: 'ADD_FOTO',
        payload: { pedidoId, tipo, foto },
    });
};

export const addAssinatura = (dispatch: Dispatch<Action>) => (assinatura: string) => {
    console.log("AppContext - Adicionando assinatura a todos os pedidos");
    dispatch({
        type: 'ADD_ASSINATURA',
        payload: assinatura,
    });
};

export const generatePDF = (state: { pedidos: Pedido[], assinaturas: Record<number, string>, fotos: Record<number, { produto?: string, documento?: string, canhoto?: string }> }) => async (pedidoId: number): Promise<string> => {
    console.log("1. Iniciando processo de geração do PDF");
    const pedido = state.pedidos.find(p => p.ID_PEDIDO === pedidoId);
    const assinatura = state.assinaturas[pedidoId];
    const fotos = state.fotos[pedidoId] || {};

    if (!pedido || !assinatura || !fotos.produto || !fotos.documento || !fotos.canhoto) {
        console.error("Dados insuficientes para gerar o PDF");
        throw new Error('Dados insuficientes para gerar o PDF');
    }

    console.log("2. Iniciando conversão das imagens");
    try {
        // Pré-processamento dos dados
        const dataPedido = new Date(pedido.DT_PEDIDO).toLocaleDateString();
        const dataAtual = new Date().toLocaleDateString();
        const documentoInfo = formatarDocumento(pedido.DOC_CLIENTE);

        // Processando uma imagem por vez
        console.log("2.1 Processando documento");
        const documentoBase64 = await FileSystem.readAsStringAsync(fotos.documento, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        console.log("2.2 Processando canhoto");
        const canhotoBase64 = await FileSystem.readAsStringAsync(fotos.canhoto, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        console.log("2.3 Processando produto");
        const produtoBase64 = await FileSystem.readAsStringAsync(fotos.produto, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        console.log("3. Gerando HTML");
        const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial; padding: 20px; }
              .page { page-break-after: always; }
              .header { text-align: center; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .photo { max-width: 200px; height: auto; }
              .anexo { max-width: 90%; height: auto; }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="header">
                <h1>Comprovante de Entrega</h1>
                <h2>Pedido #${pedido.ID_PEDIDO}</h2>
              </div>

              <div class="section">
                <h3>Dados do Cliente</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Nome:</span>
                    <span>${pedido.NM_CLIENTE}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">${documentoInfo.tipo}:</span>
                    <span>${documentoInfo.valor}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Data do Pedido:</span>
                    <span>${dataPedido}</span>
                  </div>
                </div>
              </div>

              <div class="section">
                <p>Prezados(as) ${pedido.NM_CLIENTE},</p>
                <p>A entrega da mercadoria foi realizada com sucesso na data de ${dataPedido}, no endereço especificado na Nota Fiscal.</p>
                <p>Para validar a conferência e o recebimento dos itens entregues, solicitamos que fosse feita a assinatura eletrônica no aplicativo, confirmando que tudo estava conforme o pedido.</p>
                <p>A assinatura eletrônica serviu como comprovação de que a mercadoria foi conferida junto ao nosso motorista no momento da entrega. Foi necessário, também, que nos enviassem uma cópia de um documento com foto.</p>
                <p>A coleta dos dados pessoais foi realizada de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>
              </div>

              <div class="section">
                <h3>Fotos</h3>
                <img src="data:image/jpeg;base64,${documentoBase64}" class="photo" alt="Documento" />
                <img src="data:image/jpeg;base64,${canhotoBase64}" class="photo" alt="Canhoto" />
                <img src="data:image/jpeg;base64,${produtoBase64}" class="photo" alt="Produto" />
              </div>

              <div class="section">
                <h3>Assinatura</h3>
                <img src="${assinatura}" style="width: 200px;" alt="Assinatura" />
              </div>
            </div>

            <div class="page">
              <h2>Anexo - Documento</h2>
              <img src="data:image/jpeg;base64,${documentoBase64}" class="anexo" />
            </div>

            <div class="page">
              <h2>Anexo - Canhoto</h2>
              <img src="data:image/jpeg;base64,${canhotoBase64}" class="anexo" />
            </div>

            <div class="page">
              <h2>Anexo - Produto</h2>
              <img src="data:image/jpeg;base64,${produtoBase64}" class="anexo" />
            </div>
          </body>
        </html>`;

        console.log("4. Iniciando geração do PDF");
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });
        
        console.log("5. PDF gerado com sucesso:", uri);
        return uri;
    } catch (error) {
        console.error("Erro detalhado na geração do PDF:", error);
        throw error;
    }
};

export const setSelectedFilial = (dispatch: Dispatch<Action>) => (filial: RetornoFilialDto | null) => {
    console.log("AppContext - Atualizando filial selecionada:", filial);
    dispatch({
        type: 'SET_SELECTED_FILIAL',
        payload: filial,
    });
};

export const getFileNameFromUri = (uri: String) => {
  const uriParts = uri.split('/');
  const fileName = uriParts[uriParts.length - 1];
  return fileName;
};

export const sendPedidoEntregue = (dispatch: Dispatch<Action>) => async (pedidoEntregue: PedidoEntregue) => {
    console.log("AppContext - Enviando pedido entregue para o servidor:", pedidoEntregue.ID_PEDIDO);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const fileBase64 = await FileSystem.readAsStringAsync(pedidoEntregue.Documento, {
        encoding: FileSystem.EncodingType.Base64,
      });
      //const fileBase64 = await RNFS.readFile(pedidoEntregue.Documento, 'base64');
      const payload = {
        id_usuario: 1,
        id_pedido: pedidoEntregue.ID_PEDIDO,
        documento: fileBase64,
      };

      const response = await fetch(API_BASE_URL+'Entrega/CriarDocumento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload),
      });

      const textResponse = await response.text();
      const responseData = textResponse ? JSON.parse(textResponse) : null;
      console.log("Json resposta: ", responseData);

      if (!responseData || responseData.success) {
        dispatch({
            type: 'SEND_PEDIDO_ENTREGUE',
            payload: { ...pedidoEntregue, STATUS: 'ENTREGUE' },
        });
        console.log("AppContext - Pedido entregue enviado com sucesso");
      } else {
          throw new Error('Falha ao processar pedido entregue no servidor');
      }
    } catch (error) {
        console.error("AppContext - Erro ao enviar pedido entregue:", error);
        dispatch({
            type: 'UPDATE_PEDIDO_ENTREGUE',
            payload: { 
                ...pedidoEntregue, 
                STATUS: 'PENDENTE', 
                tentativas: (pedidoEntregue.tentativas || 0) + 1 
            },
        });
    }
};

export const retryPendingPedidos = (dispatch: Dispatch<Action>, getState: () => AppState) => async () => {
    const pendingPedidos = getState().pedidosEntregues.filter(p => p.STATUS === 'PENDENTE');
    for (const pedido of pendingPedidos) {
        await sendPedidoEntregue(dispatch)(pedido);
    }
};