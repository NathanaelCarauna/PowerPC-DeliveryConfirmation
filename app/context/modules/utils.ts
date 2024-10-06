import { Pedido, Fotos } from './types';

export async function simulateApiCall(username: string, password: string) {
  console.log("AppContext - Simulando chamada de API para login");
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
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
}

export async function simulateFetchPedido(idPedido: number): Promise<Response> {
  console.log("AppContext - Simulando chamada de API para buscar pedido:", idPedido);

  await new Promise(resolve => setTimeout(resolve, 1000));

  if (idPedido < 1) {
    return new Response(null, { status: 404, statusText: 'Not Found' });
  }

  const pedido = {
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

  const responseBody = JSON.stringify(pedido);
  return new Response(responseBody, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}