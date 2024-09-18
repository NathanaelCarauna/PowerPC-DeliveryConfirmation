package com.powerpc.PowerPCDelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.powerpc.PowerPCDelivery.dto.UsuarioDTO;
import com.powerpc.PowerPCDelivery.repository.UsuarioRepository;
import com.powerpc.PowerPCDelivery.service.UsuarioService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/usuario")
@Tag(name = "Usuário", description = "Endpoints de usuário")
public class UsuarioController {
	
	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	UsuarioRepository usuarioRepository;

	@PostMapping("/create")
	public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO body) {
		if(this.usuarioRepository.findByEmail(body.email()) != null) return ResponseEntity.badRequest().build();
		UsuarioDTO usuario = this.usuarioService.create(body);
		return ResponseEntity.ok(usuario);
	}
	
	@GetMapping("/listAll")
	public ResponseEntity<List<UsuarioDTO>> listAll() {
		List<UsuarioDTO> usuarios = this.usuarioService.listAllUsuario();
		return ResponseEntity.ok(usuarios);
	}
}
