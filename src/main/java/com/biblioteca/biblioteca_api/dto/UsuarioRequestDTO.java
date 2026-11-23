package com.biblioteca.biblioteca_api.dto;

import com.biblioteca.biblioteca_api.model.Role;

public class UsuarioRequestDTO {
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private Role role;
    private String cep;
    private String numero;

    public UsuarioRequestDTO() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
}