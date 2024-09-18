package com.powerpc.PowerPCDelivery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.powerpc.PowerPCDelivery.dto.FilialDTO;
import com.powerpc.PowerPCDelivery.model.Filial;
import com.powerpc.PowerPCDelivery.repository.FilialRepository;

@Service
public class FilialService {

	@Autowired
	FilialRepository filialRepository;

	public FilialDTO create(FilialDTO filial) {
		Filial newFilial = new Filial();
		newFilial.setNome(filial.nome());
		this.filialRepository.save(newFilial);
		return filialToDTO(newFilial);
	}

	public List<FilialDTO> listAllFilial() {
		List<Filial> filiais = this.filialRepository.findAll();
		List<FilialDTO> filiaisDTO = new ArrayList<FilialDTO>();
		for(Filial f : filiais) {
			filiaisDTO.add(filialToDTO(f));
		}
		return filiaisDTO;
	}
	
	private FilialDTO filialToDTO(Filial filial) {
		return new FilialDTO(filial.getId(), filial.getNome());
	}
}
