package com.powerpc.PowerPCDelivery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.powerpc.PowerPCDelivery.dto.UsuarioDTO;
import com.powerpc.PowerPCDelivery.dto.UsuarioLoginResponseDTO;
import com.powerpc.PowerPCDelivery.model.Filial;
import com.powerpc.PowerPCDelivery.model.Usuario;
import com.powerpc.PowerPCDelivery.repository.FilialRepository;
import com.powerpc.PowerPCDelivery.repository.UsuarioRepository;

@Service
public class UsuarioService {

	@Autowired
	UsuarioRepository usuarioRepository;

	@Autowired
	FilialRepository filialRepository;
	
	@Autowired
	AuthorizationService authorizationService;

	public UsuarioDTO create(UsuarioDTO usuarioDTO) {
		List<Filial> filiais = new ArrayList<Filial>();
		for (Integer i : usuarioDTO.filiais()) {
			Filial temp = this.filialRepository.getById(i);
			if (temp == null) {
				return null;
			} else {
				filiais.add(temp);
			}
		}
		Usuario newUsuario = new Usuario();
		newUsuario.setName(usuarioDTO.name());
		newUsuario.setEmail(usuarioDTO.email());
		newUsuario.setSenha(new BCryptPasswordEncoder().encode(usuarioDTO.senha()));
		newUsuario.setFiliais(filiais);
		this.usuarioRepository.save(newUsuario);
		return usuarioToDTO(newUsuario);
	}

	public List<UsuarioDTO> listAllUsuario() {
		List<Usuario> usuarios = this.usuarioRepository.findAll();
		List<UsuarioDTO> usuariosDTO = new ArrayList<UsuarioDTO>();
		for(Usuario u : usuarios) {
			usuariosDTO.add(usuarioToDTO(u));
		}
		return usuariosDTO;
	}
	
	public UsuarioLoginResponseDTO getUsuarioLogin(String token, String email) {
		Usuario u = this.usuarioRepository.findByEmailUsuario(email);
		UsuarioDTO uDTO = usuarioToDTO(u);
		return new UsuarioLoginResponseDTO(uDTO.id(), uDTO.name(), uDTO.email(), uDTO.filiais(), token);
	}
	
	private UsuarioDTO usuarioToDTO(Usuario usuario) {
		List<Integer> id_filiais = new ArrayList<Integer>();
		for (Filial i : usuario.getFiliais()) {
			id_filiais.add(i.getId());
		}
		return new UsuarioDTO(usuario.getId(), usuario.getName(), usuario.getEmail(), usuario.getSenha(), id_filiais);
	}

}
