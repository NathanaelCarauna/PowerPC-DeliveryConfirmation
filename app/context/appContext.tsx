import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos
type RetornoFilialDto = {
  id: number;
  nome: string;
};

type User = {
  username: string;
  authenticated: boolean;
  email: string;
  token: string;
  filiais: RetornoFilialDto[];
};

type Pedido = {
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

type AppState = {
  user: User | null;
  pedidos: Pedido[];
  assinaturas: Record<number, string>;
  selectedFilial: RetornoFilialDto | null;
};

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PEDIDOS'; payload: Pedido[] }
  | { type: 'ADD_ASSINATURA'; payload: { pedidoId: number; assinatura: string } }
  | { type: 'SET_SELECTED_FILIAL'; payload: RetornoFilialDto | null };

// Crie o contexto
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (username: string, password: string) => Promise<void>;
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
    case 'ADD_ASSINATURA':
      console.log("AppContext - Reducer - Adicionando assinatura para o pedido:", action.payload.pedidoId);
      return {
        ...state,
        assinaturas: {
          ...state.assinaturas,
          [action.payload.pedidoId]: action.payload.assinatura,
        },
      };
    case 'SET_SELECTED_FILIAL':
      console.log("AppContext - Reducer - Atualizando filial selecionada:", action.payload);
      return { ...state, selectedFilial: action.payload };
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

  console.log("AppContext - Estado atual:", state);

  return (
    <AppContext.Provider value={{ state, dispatch, login }}>
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