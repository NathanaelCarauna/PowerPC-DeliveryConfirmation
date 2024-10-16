import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppContextType, Pedido, PedidoEntregue } from './types';
import { appReducer } from './reducer';
import { login, fetchPedido, removePedido, addFoto, addAssinatura, generatePDF, setSelectedFilial, sendPedidoEntregue, retryPendingPedidos } from './actions';
import { useRouter } from 'expo-router'; // Importe o hook useRouter

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: null,
  pedidos: [],
  pedidosEntregues: [], 
  assinaturas: {},
  fotos: {},
  selectedFilial: null,
};

export function AppProvider({ children }: { children: ReactNode }) {
  console.log("AppContext - Inicializando AppProvider");
  const [state, dispatch] = useReducer(appReducer, initialState);
  const router = useRouter(); // Use o hook useRouter

  const logout = () => {
    // Limpa o estado do usuário
    dispatch({ type: 'LOGOUT' });
    // Redireciona para a tela de login
    router.replace('/');
  };

  const contextValue: AppContextType = {
    logout,
    retryPendingPedidos: retryPendingPedidos(dispatch, () => state),
    state,
    dispatch,
    login: login(dispatch),
    fetchPedido: fetchPedido(dispatch),
    removePedido: removePedido(dispatch),
    getPedidos: () => state.pedidos,
    getPedidosEntregues: () => state.pedidosEntregues,
    addFoto: addFoto(dispatch),
    addAssinatura: addAssinatura(dispatch),
    generatePDF: generatePDF(state),
    setSelectedFilial: setSelectedFilial(dispatch),
    sendPedidoEntregue: sendPedidoEntregue(dispatch),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    console.error("AppContext - useAppContext foi chamado fora de um AppProvider");
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
}