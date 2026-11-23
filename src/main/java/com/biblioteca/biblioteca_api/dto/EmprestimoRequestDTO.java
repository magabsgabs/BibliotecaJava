package com.biblioteca.biblioteca_api.dto;

public class EmprestimoRequestDTO {
    private Long usuarioId;
    private Long livroId;
    private Integer diasPrazo;

    public EmprestimoRequestDTO() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getLivroId() { return livroId; }
    public void setLivroId(Long livroId) { this.livroId = livroId; }
    public Integer getDiasPrazo() { return diasPrazo; }
    public void setDiasPrazo(Integer diasPrazo) { this.diasPrazo = diasPrazo; }
}