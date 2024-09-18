package com.powerpc.PowerPCDelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.powerpc.PowerPCDelivery.dto.PedidoDTO;
import com.powerpc.PowerPCDelivery.service.PedidoService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/pedido")
@Tag(name = "Pedido", description = "Endpoints de pedido")
public class PedidoController {

	@Autowired
	private PedidoService pedidoService;

	@PostMapping("/create")
	public ResponseEntity<PedidoDTO> create(@RequestBody PedidoDTO body) {
		PedidoDTO pedido = this.pedidoService.create(body);
		return ResponseEntity.ok(pedido);
	}

	@GetMapping("/listAll")
	public ResponseEntity<List<PedidoDTO>> listAll() {
		List<PedidoDTO> pedidos = this.pedidoService.listAllPedido();
		return ResponseEntity.ok(pedidos);
	}

	@GetMapping("/pedidoById/{id}")
	public ResponseEntity<PedidoDTO> pedidoById(@PathVariable Integer id) {
		PedidoDTO pedido = this.pedidoService.pedidoById(id);
		return ResponseEntity.ok(pedido);
	}

}
