package com.biblioteca.biblioteca_api.service;

import com.biblioteca.biblioteca_api.dto.UsuarioRequestDTO;
import com.biblioteca.biblioteca_api.dto.ViaCepDTO;
import com.biblioteca.biblioteca_api.model.Endereco;
import com.biblioteca.biblioteca_api.model.Role;
import com.biblioteca.biblioteca_api.model.Usuario;
import com.biblioteca.biblioteca_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ViaCepService viaCepService;

    public UsuarioService(UsuarioRepository usuarioRepository, ViaCepService viaCepService) {
        this.usuarioRepository = usuarioRepository;
        this.viaCepService = viaCepService;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado com id: " + id));
    }

    public Usuario criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Ja existe um usuario com este e-mail.");
        }
        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("Ja existe um usuario com este CPF.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setCpf(dto.getCpf());
        usuario.setRole(dto.getRole() != null ? dto.getRole() : Role.LEITOR);

        if (dto.getCep() != null && !dto.getCep().isBlank()) {
            usuario.setEndereco(montarEnderecoPorCep(dto.getCep(), dto.getNumero()));
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarPorId(id);
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(dto.getSenha());
        }
        if (dto.getRole() != null) {
            usuario.setRole(dto.getRole());
        }
        if (dto.getCep() != null && !dto.getCep().isBlank()) {
            Endereco novoEndereco = montarEnderecoPorCep(dto.getCep(), dto.getNumero());
            if (usuario.getEndereco() != null) {
                novoEndereco.setId(usuario.getEndereco().getId());
            }
            usuario.setEndereco(novoEndereco);
        }

        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }

    private Endereco montarEnderecoPorCep(String cep, String numero) {
        ViaCepDTO viaCep = viaCepService.buscarCep(cep);
        Endereco endereco = new Endereco();
        endereco.setCep(viaCep.getCep());
        endereco.setLogradouro(viaCep.getLogradouro());
        endereco.setNumero(numero);
        endereco.setBairro(viaCep.getBairro());
        endereco.setCidade(viaCep.getLocalidade());
        endereco.setUf(viaCep.getUf());
        return endereco;
    }
}