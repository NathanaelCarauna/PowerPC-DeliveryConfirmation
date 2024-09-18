package com.powerpc.PowerPCDelivery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.powerpc.PowerPCDelivery.dto.PedidoDTO;
import com.powerpc.PowerPCDelivery.model.Pedido;
import com.powerpc.PowerPCDelivery.model.Produto;
import com.powerpc.PowerPCDelivery.repository.PedidoRepository;
import com.powerpc.PowerPCDelivery.repository.ProdutoRepository;

@Service
public class PedidoService {

	@Autowired
	PedidoRepository pedidoRepository;

	@Autowired
	ProdutoRepository produtoRepository;

	public PedidoDTO create(PedidoDTO pedidoDTO) {
		List<Produto> produtos = new ArrayList<Produto>();
		for (Integer i : pedidoDTO.itens_id()) {
			Produto produtoTemp = this.produtoRepository.getById(i);
			if (produtoTemp == null) {
				return null;
			} else {
				produtos.add(produtoTemp);
			}
		}
		Pedido newPedido = new Pedido();
		newPedido.setDataPedido(pedidoDTO.dataPedido());
		newPedido.setDocumento_cliente(pedidoDTO.documento_cliente());
		newPedido.setId_processo_venda(pedidoDTO.id_processo_venda());
		newPedido.setNome_cliente(pedidoDTO.nome_cliente());
		newPedido.setStatus(pedidoDTO.status());
		newPedido.setItens(produtos);
		this.pedidoRepository.save(newPedido);
		return pedidoToDTO(newPedido);
	}

	public List<PedidoDTO> listAllPedido() {
		List<Pedido> pedidos = this.pedidoRepository.findAll();
		List<PedidoDTO> pedidosDTO = new ArrayList<PedidoDTO>();
		for(Pedido p : pedidos) {
			pedidosDTO.add(pedidoToDTO(p));
		}
		return pedidosDTO;
	}

	public PedidoDTO pedidoById(Integer id) {
		return pedidoToDTO(this.pedidoRepository.getById(id));
	}

	private PedidoDTO pedidoToDTO(Pedido pedido) {
		List<Integer> itens_id = new ArrayList<Integer>();
		for (Produto p : pedido.getItens()) {
			itens_id.add(p.getId());
		}
		return new PedidoDTO(pedido.getId(), pedido.getDataPedido(), pedido.getStatus(), pedido.getDocumento_cliente(),
				pedido.getNome_cliente(), pedido.getId_processo_venda(), itens_id);
	}
}
