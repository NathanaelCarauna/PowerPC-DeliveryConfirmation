package com.powerpc.PowerPCDelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.powerpc.PowerPCDelivery.dto.ProdutoDTO;
import com.powerpc.PowerPCDelivery.service.ProdutoService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/produto")
@Tag(name = "Produto", description = "Endpoints de produto")
public class ProdutoController {

	@Autowired
	private ProdutoService produtoService;

	@PostMapping("/create")
	public ResponseEntity<ProdutoDTO> create(@RequestBody ProdutoDTO body) {
		ProdutoDTO produto = this.produtoService.create(body);
		return ResponseEntity.ok(produto);
	}

	@GetMapping("/listAll")
	public ResponseEntity<List<ProdutoDTO>> listAll() {
		List<ProdutoDTO> produtos = this.produtoService.listAllProduto();
		return ResponseEntity.ok(produtos);
	}
}
