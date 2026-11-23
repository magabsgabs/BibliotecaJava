package com.biblioteca.biblioteca_api.dto;

import java.util.Set;

public class LivroRequestDTO {
    private String titulo;
    private String isbn;
    private Integer anoPublicacao;
    private Integer quantidadeTotal;
    private Long categoriaId;
    private Set<Long> autoresIds;

    public LivroRequestDTO() {}

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public Integer getAnoPublicacao() { return anoPublicacao; }
    public void setAnoPublicacao(Integer anoPublicacao) { this.anoPublicacao = anoPublicacao; }
    public Integer getQuantidadeTotal() { return quantidadeTotal; }
    public void setQuantidadeTotal(Integer quantidadeTotal) { this.quantidadeTotal = quantidadeTotal; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    public Set<Long> getAutoresIds() { return autoresIds; }
    public void setAutoresIds(Set<Long> autoresIds) { this.autoresIds = autoresIds; }
}