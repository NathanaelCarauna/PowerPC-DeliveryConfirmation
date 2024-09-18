import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';


// Tipos
export type RetornoFilialDto = {
  id: number;
  nome: string;
};

export type User = {
  username: string;
  authenticated: boolean;
  email: string;
  token: string;
  filiais: RetornoFilialDto[];
};

export type Pedido = {
  ID_PEDIDO: number;
  NM_CLIENTE: string;
  DT_PEDIDO: string;
  ID_PROCESSO_VENDA: number;
  DOC_CLIENTE: string;
  Itens: Array<{
    ID_ITEM_PROCESSO_VENDA_PRODUTO: number;
    ID_PROCESSO_VENDA: number;
    ID_PRODUTO: number;
    NM_PRODUTO: string;
    QN_PRODUTO: number;
  }>;
};

export type PedidoEntregue = {
  ID_PEDIDO: number; // BYTE[]
  Documento: string; // ID_PEDIDO
  STATUS: string;
  DT_PEDIDO: string;
  DT_ENTREGA: string;
};

type FotoTipo = 'produto' | 'documento' | 'canhoto';

type Fotos = {
  produto?: string;
  documento?: string;
  canhoto?: string;
};

type AppState = {
  user: User | null;
  pedidos: Pedido[];
  pedidosEntregues: PedidoEntregue[];
  assinaturas: Record<number, string>;
  fotos: Record<number, Fotos>;
  selectedFilial: RetornoFilialDto | null;
};

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PEDIDOS'; payload: Pedido[] }
  | { type: 'ADD_PEDIDO'; payload: Pedido }
  | { type: 'REMOVE_PEDIDO'; payload: number } // Novo tipo de ação
  | { type: 'ADD_ASSINATURA'; payload: string }
  | { type: 'SET_SELECTED_FILIAL'; payload: RetornoFilialDto | null }
  | { type: 'ADD_FOTO'; payload: { pedidoId: number; tipo: FotoTipo; foto: string } }
  | { type: 'GENERATE_PDF'; payload: number };

// Crie o contexto
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (username: string, password: string) => Promise<void>;
  fetchPedido: (idPedido: number) => Promise<void>;
  removePedido: (idPedido: number) => void;
  getPedidos: () => Pedido[];
  getPedidosEntregues: () => PedidoEntregue[];
  addFoto: (pedidoId: number, tipo: FotoTipo, foto: string) => void;
  addAssinatura: (assinatura: string) => void;
  generatePDF: (pedidoId: number) => Promise<string>;
} | undefined>(undefined);

// Crie o reducer
function appReducer(state: AppState, action: Action): AppState {
  console.log("AppContext - Reducer - Ação recebida:", action.type);
  switch (action.type) {
    case 'SET_USER':
      console.log("AppContext - Reducer - Atualizando usuário:", action.payload);
      return { ...state, user: action.payload };
    case 'SET_PEDIDOS':
      console.log("AppContext - Reducer - Atualizando pedidos. Quantidade:", action.payload.length);
      return { ...state, pedidos: action.payload };
    case 'ADD_PEDIDO':
      console.log("AppContext - Reducer - Adicionando novo pedido:", action.payload.ID_PEDIDO);
      return {
        ...state,
        pedidos: [...state.pedidos, action.payload]
      };
    case 'REMOVE_PEDIDO':
      console.log("AppContext - Reducer - Removendo pedido:", action.payload);
      return {
        ...state,
        pedidos: state.pedidos.filter(pedido => pedido.ID_PEDIDO !== action.payload)
      };
    case 'ADD_ASSINATURA':
      console.log("AppContext - Reducer - Adicionando assinatura para todos os pedidos");
      const newAssinaturas = state.pedidos.reduce((acc, pedido) => {
        acc[pedido.ID_PEDIDO] = action.payload;
        return acc;
      }, {} as Record<number, string>);
      return {
        ...state,
        assinaturas: newAssinaturas,
      };
    case 'SET_SELECTED_FILIAL':
      console.log("AppContext - Reducer - Atualizando filial selecionada:", action.payload);
      return { ...state, selectedFilial: action.payload };
    case 'ADD_FOTO':
      console.log(`AppContext - Reducer - Adicionando foto ${action.payload.tipo} para o pedido:`, action.payload.pedidoId);
      return {
        ...state,
        fotos: {
          ...state.fotos,
          [action.payload.pedidoId]: {
            ...(state.fotos[action.payload.pedidoId] || {}),
            [action.payload.tipo]: action.payload.foto,
          },
        },
      };
    case 'GENERATE_PDF':
      console.log("AppContext - Reducer - Gerando PDF para o pedido:", action.payload);
      // Aqui você pode adicionar lógica adicional se necessário
      return state;
    default:
      console.log("AppContext - Reducer - Ação desconhecida:", action);
      return state;
  }
}

// Mock de pedidos entregues
const mockPedidosEntregues: PedidoEntregue[] = [
  {
    ID_PEDIDO: 123, // Exemplo de BYTE[]
    Documento: 'ID_PEDIDO_1',
    STATUS: 'Entregue',
    DT_PEDIDO: '2023-10-01',
    DT_ENTREGA: '2023-10-02',
  },
  {
    ID_PEDIDO: 342, // Exemplo de BYTE[]
    Documento: 'ID_PEDIDO_2',
    STATUS: 'Pendente',
    DT_PEDIDO: '2023-10-03',
    DT_ENTREGA: '2023-10-04',
  },
];

// Crie o provedor do contexto
export function AppProvider({ children }: { children: ReactNode }) {
  console.log("AppContext - Inicializando AppProvider");
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    pedidos: [],
    pedidosEntregues: mockPedidosEntregues, // Usando a lista mockada
    assinaturas: {},
    fotos: {},
    selectedFilial: null,
  });

  // Função de login
  const login = async (username: string, password: string) => {
    console.log("AppContext - Iniciando processo de login para o usuário:", username);
    try {
      // Aqui você faria a chamada à API para autenticar o usuário
      // Este é um exemplo simulado
      const response = await simulateApiCall(username, password);

      if (response.success) {
        console.log("AppContext - Login bem-sucedido. Atualizando estado do usuário.");
        dispatch({
          type: 'SET_USER',
          payload: {
            username: response.username,
            authenticated: true,
            email: response.email,
            token: response.token,
            filiais: response.filiais,
          },
        });
      } else {
        console.log("AppContext - Falha na autenticação");
        throw new Error('Falha na autenticação');
      }
    } catch (error) {
      console.error('AppContext - Erro no login:', error);
      // Aqui você pode disparar uma ação para mostrar uma mensagem de erro
    }
  };

  // Função para buscar um pedido pelo ID_PEDIDO
  const fetchPedido = async (idPedido: number) => {
    console.log("AppContext - Iniciando busca do pedido:", idPedido);
    try {
      // Aqui você faria a chamada à API para buscar o pedido
      // Este é um exemplo simulado
      const pedido = await simulateFetchPedido(idPedido);

      console.log("AppContext - Pedido encontrado:", pedido);
      dispatch({
        type: 'ADD_PEDIDO',
        payload: pedido,
      });
    } catch (error) {
      console.error('AppContext - Erro ao buscar pedido:', error);
      // Aqui você pode disparar uma ação para mostrar uma mensagem de erro
    }
  };

  // Função para remover um pedido
  const removePedido = (idPedido: number) => {
    console.log("AppContext - Iniciando remoção do pedido:", idPedido);
    dispatch({
      type: 'REMOVE_PEDIDO',
      payload: idPedido,
    });
  };

  // Função para recuperar os pedidos
  const getPedidos = () => {
    console.log("AppContext - Recuperando pedidos");
    return state.pedidos;
  };

  // Função para recuperar os pedidos entregues
  const getPedidosEntregues = () => {
    console.log("AppContext - Recuperando pedidos entregues");
    return state.pedidosEntregues;
  };

  const addFoto = (pedidoId: number, tipo: FotoTipo, foto: string) => {
    console.log(`AppContext - Adicionando foto ${tipo} ao pedido:`, pedidoId);
    dispatch({
      type: 'ADD_FOTO',
      payload: { pedidoId, tipo, foto },
    });
  };

  const addAssinatura = (assinatura: string) => {
    console.log("AppContext - Adicionando assinatura a todos os pedidos");
    dispatch({
      type: 'ADD_ASSINATURA',
      payload: assinatura,
    });
  };



  const generatePDF = async (pedidoId: number): Promise<string> => {
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


  console.log("AppContext - Estado atual:", state);

  return (
    <AppContext.Provider value={{ state, dispatch, login, fetchPedido, removePedido, getPedidos, addFoto, addAssinatura, generatePDF, getPedidosEntregues }}>
      {children}
    </AppContext.Provider>
  );
}

// Crie um hook personalizado para usar o contexto
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    console.error("AppContext - useAppContext foi chamado fora de um AppProvider");
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
}

// Função auxiliar para simular uma chamada de API
async function simulateApiCall(username: string, password: string) {
  console.log("AppContext - Simulando chamada de API para login");
  // Simula uma chamada de API com um atraso de 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simula uma resposta bem-sucedida
  const response = {
    success: true,
    username: username,
    email: `${username}@example.com`,
    token: 'fake_token_123',
    filiais: [
      { id: 1, nome: 'Filial A' },
      { id: 2, nome: 'Filial B' },
      { id: 3, nome: 'Filial C' },
    ],
  };
  console.log("AppContext - Resposta simulada da API:", response);
  return response;
}

// Função auxiliar para simular uma chamada de API para buscar um pedido
async function simulateFetchPedido(idPedido: number): Promise<Pedido> {
  console.log("AppContext - Simulando chamada de API para buscar pedido:", idPedido);
  // Simula uma chamada de API com um atraso de 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simula uma resposta bem-sucedida
  const pedido: Pedido = {
    ID_PEDIDO: idPedido,
    NM_CLIENTE: `Cliente ${idPedido}`,
    DT_PEDIDO: new Date().toISOString(),
    ID_PROCESSO_VENDA: idPedido * 100,
    DOC_CLIENTE: `DOC${idPedido}`,
    Itens: [
      {
        ID_ITEM_PROCESSO_VENDA_PRODUTO: idPedido * 1000,
        ID_PROCESSO_VENDA: idPedido * 100,
        ID_PRODUTO: idPedido * 10,
        NM_PRODUTO: `Produto ${idPedido}`,
        QN_PRODUTO: Math.floor(Math.random() * 10) + 1,
      }
    ],
  };
  console.log("AppContext - Resposta simulada da API para busca de pedido:", pedido);
  return pedido;
}

// Função auxiliar para simular a geração de PDF
async function simulateGeneratePDF(pedido: Pedido, assinatura: string, fotos: Fotos) {
  console.log("AppContext - Simulando geração de PDF");
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("AppContext - PDF gerado com sucesso para o pedido:", pedido.ID_PEDIDO);
  console.log("AppContext - Fotos incluídas:", Object.keys(fotos));
  console.log("AppContext - Assinatura incluída:", assinatura ? "Sim" : "Não");
}