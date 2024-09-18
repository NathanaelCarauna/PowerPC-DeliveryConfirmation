package com.powerpc.PowerPCDelivery.dto;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

public record EntregaDTO(Integer id, Date dataEntrega, Integer id_pedido, MultipartFile documento) {

}
