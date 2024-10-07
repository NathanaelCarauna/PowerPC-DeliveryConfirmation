import { Dispatch } from 'react';

export type RetornoFilialDto = {
    id: number;
    nome: string;
};

export type User = {
    id: number;
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

export type DocumentoPedidoDto = {
    ID_USUARIO: number;
    ID_PEDIDO: number;
    documento: Uint8Array;
};

export type PedidoEntregue = {
    ID_USUARIO: number;
    ID_PEDIDO: number;
    Documento: string;
    STATUS: 'PENDENTE' | 'ENTREGUE';
    DT_PEDIDO: string;
    DT_ENTREGA: string;
    tentativas?: number;
};

export type FotoTipo = 'produto' | 'documento' | 'canhoto';

export type Fotos = {
    produto?: string;
    documento?: string;
    canhoto?: string;
};

export type AppState = {
    user: User | null;
    pedidos: Pedido[];
    pedidosEntregues: PedidoEntregue[];
    assinaturas: Record<number, string>;
    fotos: Record<number, Fotos>;
    selectedFilial: RetornoFilialDto | null;
};

export type Action =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_PEDIDOS'; payload: Pedido[] }
    | { type: 'ADD_PEDIDO'; payload: Pedido }
    | { type: 'REMOVE_PEDIDO'; payload: number }
    | { type: 'ADD_ASSINATURA'; payload: string }
    | { type: 'SET_SELECTED_FILIAL'; payload: RetornoFilialDto | null }
    | { type: 'ADD_FOTO'; payload: { pedidoId: number; tipo: FotoTipo; foto: string } }
    | { type: 'GENERATE_PDF'; payload: number }
    | { type: 'SEND_PEDIDO_ENTREGUE'; payload: PedidoEntregue }
    | { type: 'UPDATE_PEDIDO_ENTREGUE'; payload: PedidoEntregue };

export type AppContextType = {
    state: AppState;
    dispatch: Dispatch<Action>;
    login: (username: string, password: string) => Promise<void>;
    fetchPedido: (idPedido: number) => Promise<void>;
    removePedido: (idPedido: number) => void;
    getPedidos: () => Pedido[];
    getPedidosEntregues: () => PedidoEntregue[];
    addFoto: (pedidoId: number, tipo: FotoTipo, foto: string) => void;
    addAssinatura: (assinatura: string) => void;
    generatePDF: (pedidoId: number) => Promise<string>;
    setSelectedFilial: (filial: RetornoFilialDto | null) => void;
    sendPedidoEntregue: (pedidoEntregue: PedidoEntregue) => Promise<void>;
    retryPendingPedidos: () => Promise<void>;
};