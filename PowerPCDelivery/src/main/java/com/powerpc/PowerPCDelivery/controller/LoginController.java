package com.powerpc.PowerPCDelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.powerpc.PowerPCDelivery.config.TokenService;
import com.powerpc.PowerPCDelivery.dto.LoginDTO;
import com.powerpc.PowerPCDelivery.dto.UsuarioLoginResponseDTO;
import com.powerpc.PowerPCDelivery.model.Usuario;
import com.powerpc.PowerPCDelivery.service.UsuarioService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/authentication")
@Tag(name = "Authentication", description = "Endpoints de autenticação")
public class LoginController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private TokenService tokenService;

	@Autowired
	private UsuarioService usuarioService;

	@PostMapping("/login")
	public ResponseEntity<UsuarioLoginResponseDTO> login(@RequestBody LoginDTO body) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(body.email(), body.senha());
		var auth = this.authenticationManager.authenticate(usernamePassword);

		var token = this.tokenService.genaretedToken((Usuario) auth.getPrincipal());

		return ResponseEntity.ok(this.usuarioService.getUsuarioLogin(token, body.email()));

	}

}
