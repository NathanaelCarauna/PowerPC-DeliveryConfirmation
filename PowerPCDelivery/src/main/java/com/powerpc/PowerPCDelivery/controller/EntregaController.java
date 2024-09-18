package com.powerpc.PowerPCDelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.powerpc.PowerPCDelivery.dto.EntregaDTO;
import com.powerpc.PowerPCDelivery.dto.EntregaResponseDTO;
import com.powerpc.PowerPCDelivery.service.EntregaService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/entrega")
@Tag(name = "Entrega", description = "Endpoints de entrega")
public class EntregaController {

	@Autowired
	private EntregaService entregaService;

	@PostMapping("/create")
	public ResponseEntity<EntregaResponseDTO> create(@RequestBody EntregaDTO body) {
		EntregaResponseDTO entrega = this.entregaService.create(body);
		return ResponseEntity.ok(entrega);
	}

	@GetMapping("/listAll")
	public ResponseEntity<List<EntregaResponseDTO>> listAll() {
		List<EntregaResponseDTO> entregas = this.entregaService.listAllEntrega();
		return ResponseEntity.ok(entregas);
	}

	@GetMapping("/listByEntregador")
	public ResponseEntity<List<EntregaResponseDTO>> listByUsuario() {
		List<EntregaResponseDTO> entregas = this.entregaService.listAllByUser();
		return ResponseEntity.ok(entregas);
	}

}
