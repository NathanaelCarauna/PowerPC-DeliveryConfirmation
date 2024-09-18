package com.powerpc.PowerPCDelivery.dto;

import java.util.Date;

public record EntregaResponseDTO(Integer id, Date dataEntrega, byte[] documento, Integer pedido_id, Integer entregador_id) {

}
