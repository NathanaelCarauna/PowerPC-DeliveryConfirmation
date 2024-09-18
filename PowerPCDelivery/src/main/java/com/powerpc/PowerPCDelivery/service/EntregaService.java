package com.powerpc.PowerPCDelivery.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.powerpc.PowerPCDelivery.dto.EntregaDTO;
import com.powerpc.PowerPCDelivery.dto.EntregaResponseDTO;
import com.powerpc.PowerPCDelivery.model.Entrega;
import com.powerpc.PowerPCDelivery.model.Pedido;
import com.powerpc.PowerPCDelivery.model.Usuario;
import com.powerpc.PowerPCDelivery.repository.EntregaRepository;
import com.powerpc.PowerPCDelivery.repository.PedidoRepository;

@Service
public class EntregaService {

	@Autowired
	EntregaRepository entregaRepository;

	@Autowired
	PedidoRepository pedidoRepository;

	public EntregaResponseDTO create(EntregaDTO entrega) {
		Entrega entregaTemp = new Entrega();
		Pedido pedidoEntrega = this.pedidoRepository.getById(entrega.id_pedido());
		Usuario usuarioLogado = new Usuario(); // Pegar usuário logado aqui
		if (pedidoEntrega != null) {
			try {
				entregaTemp.setDocumento(entrega.documento().getBytes());
			} catch (IOException e) {
				return null;
			}
			entregaTemp.setPedido(pedidoEntrega);
			entregaTemp.setEntregador(usuarioLogado);
			this.entregaRepository.save(entregaTemp);
			return entregaToDTO(entregaTemp);
		}
		return null;
	}

	public List<EntregaResponseDTO> listAllEntrega() {
		List<Entrega> entregas = this.entregaRepository.findAll();
		List<EntregaResponseDTO> entregasResponseDTO = new ArrayList<EntregaResponseDTO>();
		for (Entrega e : entregas) {
			entregasResponseDTO.add(entregaToDTO(e));
		}
 		return entregasResponseDTO;
	}
	
	public List<EntregaResponseDTO> listAllByUser(){
		Usuario usuarioLogado = new Usuario();//Pegar usuário logado aqui
		List<Entrega> entregas = this.entregaRepository.listByUser(usuarioLogado.getId());
		List<EntregaResponseDTO> entregasResponseDTO = new ArrayList<EntregaResponseDTO>();
		for (Entrega e : entregas) {
			entregasResponseDTO.add(entregaToDTO(e));
		}
		return entregasResponseDTO;
	}
	
	private EntregaResponseDTO entregaToDTO(Entrega entrega) {
		return new EntregaResponseDTO(entrega.getId(), entrega.getDataEntrega(), entrega.getDocumento(), entrega.getPedido().getId(), entrega.getEntregador().getId());
	}
}
