package com.powerpc.PowerPCDelivery.dto;

import java.util.Date;
import java.util.List;

public record PedidoDTO(Integer id, Date dataPedido, String status, String documento_cliente, String nome_cliente, Integer id_processo_venda, List<Integer> itens_id) {

}
