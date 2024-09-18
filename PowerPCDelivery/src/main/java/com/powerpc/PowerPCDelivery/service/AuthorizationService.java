package com.powerpc.PowerPCDelivery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.powerpc.PowerPCDelivery.model.Usuario;
import com.powerpc.PowerPCDelivery.repository.UsuarioRepository;

@Service
public class AuthorizationService implements UserDetailsService {

	@Autowired
	UsuarioRepository usuarioRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return this.usuarioRepository.findByEmail(username);
	}

	public Usuario getUserLogged() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof UserDetails) {
			String username = ((UserDetails) principal).getUsername();
			System.out.println(username);
	        return usuarioRepository.findByEmailUsuario(username); // Aqui você pode obter o email
	    } else {
	    	System.out.println(principal.toString());
	    	return usuarioRepository.findByEmailUsuario(principal.toString());
	    }
	}
}
