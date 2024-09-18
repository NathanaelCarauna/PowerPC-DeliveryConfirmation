package com.powerpc.PowerPCDelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import com.powerpc.PowerPCDelivery.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
	
	UserDetails findByEmail(String email);
	
	@Query("SELECT u FROM Usuario u WHERE u.email = :userEmail")
	Usuario findByEmailUsuario(@Param("userEmail") String userEmail);

}
