import { AppState, Action } from './types';

export function appReducer(state: AppState, action: Action): AppState {
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
      return state;
    case 'SEND_PEDIDO_ENTREGUE':
    case 'UPDATE_PEDIDO_ENTREGUE':
      const updatedPedidosEntregues = state.pedidosEntregues.filter(p => p.ID_PEDIDO !== action.payload.ID_PEDIDO);
      return {
        ...state,
        pedidosEntregues: [...updatedPedidosEntregues, action.payload],
        pedidos: state.pedidos.filter(pedido => pedido.ID_PEDIDO !== action.payload.ID_PEDIDO)
      };
    default:
      console.log("AppContext - Reducer - Ação desconhecida:", action);
      return state;
  }
}