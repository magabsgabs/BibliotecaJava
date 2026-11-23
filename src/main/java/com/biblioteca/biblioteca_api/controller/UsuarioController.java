package com.biblioteca.biblioteca_api.controller;

import com.biblioteca.biblioteca_api.dto.UsuarioRequestDTO;
import com.biblioteca.biblioteca_api.dto.ViaCepDTO;
import com.biblioteca.biblioteca_api.model.Usuario;
import com.biblioteca.biblioteca_api.service.UsuarioService;
import com.biblioteca.biblioteca_api.service.ViaCepService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ViaCepService viaCepService;

    public UsuarioController(UsuarioService usuarioService, ViaCepService viaCepService) {
        this.usuarioService = usuarioService;
        this.viaCepService = viaCepService;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @GetMapping("/cep/{cep}")
    public ResponseEntity<ViaCepDTO> consultarCep(@PathVariable String cep) {
        return ResponseEntity.ok(viaCepService.buscarCep(cep));
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}