package com.powerpc.PowerPCDelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.powerpc.PowerPCDelivery.model.Entrega;

public interface EntregaRepository extends JpaRepository<Entrega, Integer>{
	
	@Query("SELECT e FROM Entrega e WHERE e.entregador.id = :userId")
    List<Entrega> listByUser(@Param("userId") Integer userId);
}
