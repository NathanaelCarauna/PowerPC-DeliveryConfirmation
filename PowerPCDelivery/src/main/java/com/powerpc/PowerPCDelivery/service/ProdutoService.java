package com.powerpc.PowerPCDelivery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.powerpc.PowerPCDelivery.dto.ProdutoDTO;
import com.powerpc.PowerPCDelivery.model.Produto;
import com.powerpc.PowerPCDelivery.repository.ProdutoRepository;

@Service
public class ProdutoService {

	@Autowired
	ProdutoRepository produtoRepository;

	public ProdutoDTO create(ProdutoDTO produtoDTO) {
		Produto newProduto = new Produto();
		newProduto.setId_processo_venda(produtoDTO.id_processo_venda());
		newProduto.setId_processo_venda_produto(produtoDTO.id_processo_venda_produto());
		newProduto.setNome(produtoDTO.nome());
		newProduto.setQuantidade(produtoDTO.quantidade());
		this.produtoRepository.save(newProduto);
		return produtoToDTO(newProduto);
	}

	public List<ProdutoDTO> listAllProduto() {
		List<Produto> produtos = this.produtoRepository.findAll();
		List<ProdutoDTO> produtosDTO = new ArrayList<ProdutoDTO>();
		for (Produto p : produtos) {
			produtosDTO.add(produtoToDTO(p));
		}
		return produtosDTO;
	}

	private ProdutoDTO produtoToDTO(Produto produto) {
		return new ProdutoDTO(produto.getId(), produto.getId_processo_venda_produto(), produto.getId_processo_venda(),
				produto.getNome(), produto.getQuantidade());
	}

}
