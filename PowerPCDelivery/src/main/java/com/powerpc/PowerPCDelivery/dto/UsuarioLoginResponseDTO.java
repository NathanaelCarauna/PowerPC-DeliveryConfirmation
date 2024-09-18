package com.powerpc.PowerPCDelivery.dto;

import java.util.List;

public record UsuarioLoginResponseDTO(Integer id, String name, String email, List<Integer> filiais, String token) {

}
