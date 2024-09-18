package com.powerpc.PowerPCDelivery.dto;

import java.util.List;

public record UsuarioDTO(Integer id, String name, String email, String senha, List<Integer> filiais) {

}
