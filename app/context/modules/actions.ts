import { Dispatch } from 'react';
import { Action, User, Pedido, FotoTipo, RetornoFilialDto, PedidoEntregue, AppState } from './types';
import { simulateApiCall, simulateFetchPedido, simulateSendPedidoEntregue } from './utils';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = 'https://b9e6-2804-954-ff12-cb00-ccbd-bf6f-798f-812.ngrok-free.app/api/'
import {Alert} from 'react-native';

export const login = (dispatch: Dispatch<Action>) => async (username: string, password: string) => {
    console.log("AppContext - Iniciando processo de login para o usuário:", username);
    try {
        //Chamada à API para autenticar o usuário
        const response = await fetch(API_BASE_URL+'authentication/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
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

export const fetchPedido = (dispatch: Dispatch<Action>) => async (idPedido: number) => {
    console.log("AppContext - Iniciando busca do pedido:", idPedido);
    try {
        //Chamada à API para buscar o pedido
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(API_BASE_URL+'pedido/pedidoById/' + idPedido, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        });
        if(response.ok){
          const data = await response.json();
          console.log("AppContext - Pedido encontrado:", idPedido);
          const pedido: Pedido = {
            ID_PEDIDO: data.id,
            NM_CLIENTE: data.nome_cliente,
            DT_PEDIDO: data.dataPedido,
            ID_PROCESSO_VENDA: data.id_processo_venda,
            DOC_CLIENTE: data.documento_cliente,
            Itens: [
              {
                ID_ITEM_PROCESSO_VENDA_PRODUTO: data.itens.id_processo_venda_produto,
                ID_PROCESSO_VENDA: data.itens.id_processo_venda,
                ID_PRODUTO: data.itens.id,
                NM_PRODUTO: data.itens.nome,
                QN_PRODUTO: data.itens.quantidade,
              }
            ],
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
    console.log("AppContext - Gerando PDF para o pedido:", pedidoId);

    const pedido = state.pedidos.find(p => p.ID_PEDIDO === pedidoId);
    const assinatura = state.assinaturas[pedidoId];
    const fotos = state.fotos[pedidoId] || {};

    if (!pedido || !assinatura || !fotos.produto || !fotos.documento || !fotos.canhoto) {
        console.error("AppContext - Dados insuficientes para gerar o PDF");
        throw new Error('Dados insuficientes para gerar o PDF');
    }

    // Função para converter imagem em Base64
    const convertImageToBase64 = async (uri: string) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            console.error("Erro ao converter imagem para base64:", error);
            return '';
        }
    };

    // Converta as imagens para base64
    const documentoBase64 = await convertImageToBase64(fotos.documento);
    const canhotoBase64 = await convertImageToBase64(fotos.canhoto);
    const produtoBase64 = await convertImageToBase64(fotos.produto);

    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f9f9f9; }
          .container { max-width: 800px; margin: auto; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; margin-bottom: 10px; border-bottom: 2px solid #007BFF; padding-bottom: 5px; }
          .section { margin-bottom: 10px; padding: 5px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f2f2f2; }
          .photo-container { display: flex; justify-content: space-between; }
          .photo { width: 30%; height: auto; margin-bottom: 5px; border: 1px solid #e0e0e0; border-radius: 5px; }
          .signature { display: block; margin: 10px auto; width: 150px; height: auto; border: 1px solid #e0e0e0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #555; }
          .legal { font-size: 10px; color: gray; margin-top: 10px; }
          h1 { color: #007BFF; margin: 0; font-size: 24px; }
          h2 { color: #333; font-size: 18px; }
          p { line-height: 1.4; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Comprovante de Entrega</h1>
            <h2>Pedido #${pedido.ID_PEDIDO}</h2>
          </div>
          
          <div class="section">
            <h2>Dados do Cliente</h2>
            <p><strong>Nome:</strong> ${pedido.NM_CLIENTE}</p>
            <p><strong>Documento:</strong> ${pedido.DOC_CLIENTE}</p>
            <p><strong>Data do Pedido:</strong> ${new Date(pedido.DT_PEDIDO).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <p>Prezados(as) ${pedido.NM_CLIENTE},</p>
            <p>A entrega da mercadoria foi realizada com sucesso na data de ${new Date().toLocaleDateString()}, no endereço especificado na Nota Fiscal.</p>
            <p>Para validar a conferência e o recebimento dos itens entregues, solicitamos que fosse feita a assinatura eletrônica no aplicativo, confirmando que tudo estava conforme o pedido.</p>
            <p>A assinatura eletrônica serviu como comprovação de que a mercadoria foi conferida junto ao nosso motorista no momento da entrega. Foi necessário, também, que nos enviassem uma cópia de um documento com foto.</p>
            <p>A coleta dos dados pessoais foi realizada de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>
          </div>
          
          <div class="section">
            <h2>Itens do Pedido</h2>
            <ul style="padding-left: 20px;">
              ${pedido.Itens.map(item => `
                <li>${item.NM_PRODUTO} - Qtd: ${item.QN_PRODUTO}</li>
              `).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h2>Declaração</h2>
            <p>Eu, ${pedido.NM_CLIENTE}, declaro que recebi todos os itens listados acima em perfeito estado.</p>
          </div>
          
          <div class="section">
            <h2>Fotos</h2>
            <div class="photo-container">
              <div>
                <p><strong>Documento:</strong></p>
                <img src="${documentoBase64}" class="photo" alt="Documento" />
              </div>
              <div>
                <p><strong>Canhoto:</strong></p>
                <img src="${canhotoBase64}" class="photo" alt="Canhoto" />
              </div>
              <div>
                <p><strong>Produto:</strong></p>
                <img src="${produtoBase64}" class="photo" alt="Produto" />
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Assinatura</h2>
            <img src="${assinatura}" class="signature" alt="Assinatura" />
          </div>

          <div class="footer">
            <p>Data e Hora: ${new Date().toLocaleString()}</p>
            <p>Geolocalização: [Latitude, Longitude]</p>
          </div>

          <div class="legal">
            <p>Este documento é um comprovante de entrega e deve ser guardado para fins de registro.</p>
          </div>
        </div>
      </body>
    </html>
  `;

    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        console.log("AppContext - PDF gerado com sucesso:", uri);
        return uri;

    } catch (error) {
        console.error("AppContext - Erro ao gerar PDF:", error);
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

export const sendPedidoEntregue = (dispatch: Dispatch<Action>) => async (pedidoEntregue: PedidoEntregue) => {
    console.log("AppContext - Enviando pedido entregue para o servidor:", pedidoEntregue.ID_PEDIDO);
    try {
        const response = await simulateSendPedidoEntregue(pedidoEntregue);
        
        if (!response.ok) {
            throw new Error('Erro ao enviar pedido entregue');
        }

        const responseData = await response.json();

        if (responseData.success) {
            dispatch({
                type: 'SEND_PEDIDO_ENTREGUE',
                payload: { ...pedidoEntregue, STATUS: 'ENTREGUE' },
            });
            console.log("AppContext - Pedido entregue enviado com sucesso (Aqui o pedido é enviado)");
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