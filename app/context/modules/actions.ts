import { Dispatch, useState } from 'react';
import { Action, User, Pedido, FotoTipo, RetornoFilialDto, PedidoEntregue, AppState } from './types';
import { simulateApiCall, simulateFetchPedido, simulateSendPedidoEntregue } from './utils';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = 'http://mail.gpj.com.br:9093/api/'
import {Alert} from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

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

export const addAssinatura = (dispatch: Dispatch<Action>) => async (assinatura: string) => {
    console.log("AppContext - Adicionando assinatura e obtendo localização");
    try {
        // Obter permissão de localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permissão de localização necessária');
        }

        // Obter coordenadas atuais
        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        // Obter endereço
        Geocoder.init('AIzaSyAG0RaoU3DHxW_rcEpTzxcZHwQ5KYsjTBg');
        const response = await Geocoder.from(latitude, longitude);
        const address = response.results[0].formatted_address;

        // Dispatch das ações
        dispatch({
            type: 'ADD_ASSINATURA',
            payload: assinatura,
        });
        
        dispatch({
            type: 'SET_LOCALIZACAO',
            payload: { latitude, longitude }
        });

        dispatch({
            type: 'SET_ENDERECO_ENTREGA',
            payload: address
        });

    } catch (error) {
        console.error('Erro ao obter localização:', error);
        throw new Error('Não foi possível obter a localização');
    }
};

export const generatePDF = (state: { pedidos: Pedido[], assinaturas: Record<number, string>, fotos: Record<number, { produto?: string, documento?: string, canhoto?: string }> }) => async (pedidoId: number): Promise<string> => {
    console.log("1. Iniciando processo de geração do PDF");
    const pedido = state.pedidos.find(p => p.ID_PEDIDO === pedidoId);
    const assinatura = state.assinaturas[pedidoId];
    const fotos = state.fotos[pedidoId] || {};
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (!pedido || !assinatura || !fotos.produto || !fotos.documento || !fotos.canhoto || status !== 'granted') {
        console.error("Dados insuficientes para gerar o PDF");
        throw new Error('Dados insuficientes para gerar o PDF');
    }
    
    console.log("2. Iniciando coleta da localização");

    const currentLocation = await Location.getCurrentPositionAsync({});
    const latitude = currentLocation.coords.latitude;
    const longitude = currentLocation.coords.longitude;
    
    if(!latitude || !longitude){
      console.error("AppContext - Latitude e longitude indisponíveis");
      throw new Error('Dados insuficientes para gerar o PDF');
    }

    console.log("3. Iniciando a conversão da localização para endereço");

    /*Geocoder.init('Chave da API Google Maps');
    let address: string;
    try {
      const response = await Geocoder.from(latitude, longitude);
      address = response.results[0].formatted_address;
      console.log('Endereço:', address);
    } catch (error) {
      console.error(error);
      throw new Error('Dados insuficientes para gerar o PDF');
    }*/
    const apiKey = "8xXTiyNPDO54MwjsVl3HglaLro11N0yIv47xdq68228";
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&lang=pt-BR&apiKey=${apiKey}`;
    let address: string;
    try {
      const responseAPI = await fetch(url);
      const dataAPI = await responseAPI.json();
      if (dataAPI.items.length > 0) {
        address = dataAPI.items[0].address.label;
        console.log('Endereço:', address);
      } else {
        console.error('Nenhum endereço encontrado');
        throw new Error('Nenhum endereço encontrado');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Dados insuficientes para gerar o PDF');
    }

    console.log("4. Iniciando conversão das imagens");
    try {
        // Pré-processamento dos dados
        const dataPedido = new Date(pedido.DT_PEDIDO).toLocaleDateString();
        const dataAtual = new Date().toLocaleDateString();
        const documentoInfo = formatarDocumento(pedido.DOC_CLIENTE);

        // Processando uma imagem por vez
        console.log("4.1 Processando documento");
        const documentoBase64 = await FileSystem.readAsStringAsync(fotos.documento, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        console.log("4.2 Processando canhoto");
        const canhotoBase64 = await FileSystem.readAsStringAsync(fotos.canhoto, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        console.log("4.3 Processando produto");
        const produtoBase64 = await FileSystem.readAsStringAsync(fotos.produto, { 
            encoding: FileSystem.EncodingType.Base64 
        });

        console.log("5. Gerando HTML");
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
              .produtos-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .produtos-table th, .produtos-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .produtos-table th {
                background-color: #f5f5f5;
              }
              .produtos-table tr:nth-child(even) {
                background-color: #fafafa;
              }
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
                <h3>Produtos do Pedido</h3>
                <table class="produtos-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Produto</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pedido.Itens.map(item => `
                      <tr>
                        <td>${item.ID_PRODUTO}</td>
                        <td>${item.NM_PRODUTO}</td>
                        <td>${item.QN_PRODUTO}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
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

              <div class="section">
                <h3>Endereço da entrega</h3>
                <p>Data e Hora: ${new Date().toLocaleString()}</p>
                <p>Endereço: ${address}</p>
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

        console.log("6. Iniciando geração do PDF");
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });
        
        console.log("7. PDF gerado com sucesso:", uri);
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

export const sendPedidoEntregue = (dispatch: Dispatch<Action>, getState: () => AppState) => async (pedidoEntregue: PedidoEntregue) => {
    console.log("AppContext - Enviando pedido entregue para o servidor:", pedidoEntregue.ID_PEDIDO);
    const token = await AsyncStorage.getItem('userToken');
    console.log("AppContext - Token:", token);
    const state = getState();
    
    try {
      const fileBase64 = await FileSystem.readAsStringAsync(pedidoEntregue.Documento, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = {
        id_usuario: pedidoEntregue.ID_USUARIO,
        id_pedido: pedidoEntregue.ID_PEDIDO,
        documento: fileBase64,
        tx_endereco_entrega: state.enderecoEntrega,
      };

      console.log("AppContext - Enviando request para o servidor:", payload);

      const response = await fetch(API_BASE_URL+'Entrega/CriarDocumento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload),
      });

      console.log("AppContext - Resposta recebida do servidor:", response);

      if (response.status === 200) {
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
        await sendPedidoEntregue(dispatch, getState)(pedido);
    }
};