package com.powerpc.PowerPCDelivery.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Table(name = "produto")
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private Integer id_processo_venda_produto;
	private Integer id_processo_venda;
	private String nome;
	private Integer quantidade;

	@ManyToMany(mappedBy = "itens")
	private List<Pedido> pedidos;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getId_processo_venda_produto() {
		return id_processo_venda_produto;
	}

	public void setId_processo_venda_produto(Integer id_processo_venda_produto) {
		this.id_processo_venda_produto = id_processo_venda_produto;
	}

	public Integer getId_processo_venda() {
		return id_processo_venda;
	}

	public void setId_processo_venda(Integer id_processo_venda) {
		this.id_processo_venda = id_processo_venda;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Integer getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(Integer quantidade) {
		this.quantidade = quantidade;
	}

	public List<Pedido> getPedidos() {
		return pedidos;
	}

	public void setPedidos(List<Pedido> pedidos) {
		this.pedidos = pedidos;
	}

}
