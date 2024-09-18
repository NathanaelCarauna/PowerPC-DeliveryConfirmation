package com.powerpc.PowerPCDelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.powerpc.PowerPCDelivery.dto.FilialDTO;
import com.powerpc.PowerPCDelivery.service.FilialService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/filial")
@Tag(name = "Filial", description = "Endpoints de filial")
public class FilialController {
	
	@Autowired
	private FilialService filialService;

	@PostMapping("/create")
	public ResponseEntity<FilialDTO> create(@RequestBody FilialDTO body) {
		FilialDTO filial = this.filialService.create(body);
		return ResponseEntity.ok(filial);
	}

	@GetMapping("/listAll")
	public ResponseEntity<List<FilialDTO>> listAll() {
		List<FilialDTO> filiais = this.filialService.listAllFilial();
		return ResponseEntity.ok(filiais);
	}

}
