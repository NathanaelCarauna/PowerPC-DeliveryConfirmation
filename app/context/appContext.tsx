import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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

type FotoTipo = 'produto' | 'documento' | 'canhoto';

type Fotos = {
  produto?: string;
  documento?: string;
  canhoto?: string;
};

type AppState = {
  user: User | null;
  pedidos: Pedido[];
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
  getPedidos: () => Pedido[]; // Nova função
  addFoto: (pedidoId: number, tipo: FotoTipo, foto: string) => void;
  addAssinatura: (assinatura: string) => void;
  generatePDF: (pedidoId: number) => Promise<void>;
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

// Crie o provedor do contexto
export function AppProvider({ children }: { children: ReactNode }) {
  console.log("AppContext - Inicializando AppProvider");
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    pedidos: [],
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

  const generatePDF = async (pedidoId: number) => {
    console.log("AppContext - Gerando PDF para o pedido:", pedidoId);
    dispatch({
      type: 'GENERATE_PDF',
      payload: pedidoId,
    });
    
    const pedido = state.pedidos.find(p => p.ID_PEDIDO === pedidoId);
    const assinatura = state.assinaturas[pedidoId];
    const fotos = state.fotos[pedidoId] || {};

    if (!pedido || !assinatura || !fotos.produto || !fotos.documento || !fotos.canhoto) {
      console.error("AppContext - Dados insuficientes para gerar o PDF");
      throw new Error('Dados insuficientes para gerar o PDF');
    }

    // Aqui você implementaria a lógica para gerar o PDF
    // Por exemplo, usando uma biblioteca como jsPDF ou react-pdf
    // Esta é uma implementação simulada
    await simulateGeneratePDF(pedido, assinatura, fotos);
  };

  console.log("AppContext - Estado atual:", state);

  return (
    <AppContext.Provider value={{ state, dispatch, login, fetchPedido, removePedido, getPedidos, addFoto, addAssinatura, generatePDF }}>
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