package com.powerpc.PowerPCDelivery.config;

import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.powerpc.PowerPCDelivery.model.Filial;
import com.powerpc.PowerPCDelivery.model.Role;
import com.powerpc.PowerPCDelivery.model.Usuario;
import com.powerpc.PowerPCDelivery.repository.FilialRepository;
import com.powerpc.PowerPCDelivery.repository.UsuarioRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {

	@Autowired
	UsuarioRepository usuarioRepository;

	@Autowired
	FilialRepository filialRepository;

	@Override
	public void run(String... args) throws Exception {
		if (usuarioRepository.count() == 0) {
			Filial initFilial = new Filial();
			initFilial.setNome("Garanhuns");
			this.filialRepository.save(initFilial);

			Usuario initUsuario = new Usuario();
			initUsuario.setName("Lucas Candeia");
			initUsuario.setEmail("lucas@gmail.com");
			initUsuario.setRole(Role.ADMIN);
			initUsuario.setSenha(new BCryptPasswordEncoder().encode("123456789"));
			initUsuario.setFiliais(new ArrayList<Filial>(Arrays.asList(initFilial)));
			this.usuarioRepository.save(initUsuario);

			System.out.println("Banco de dados populado com sucesso!");
		} else {
			System.out.println("Banco de dados já contém dados, não foi necessário populá-lo.");
		}

	}

}
