package com.biblioteca.biblioteca_api.controller;

import com.biblioteca.biblioteca_api.dto.EmprestimoRequestDTO;
import com.biblioteca.biblioteca_api.model.Emprestimo;
import com.biblioteca.biblioteca_api.service.EmprestimoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    @GetMapping
    public List<Emprestimo> listar(@RequestParam(required = false) Long usuarioId) {
        if (usuarioId != null) {
            return emprestimoService.listarPorUsuario(usuarioId);
        }
        return emprestimoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Emprestimo> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Emprestimo> realizarEmprestimo(@RequestBody EmprestimoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(emprestimoService.realizarEmprestimo(dto));
    }

    @PutMapping("/{id}/devolver")
    public ResponseEntity<Emprestimo> registrarDevolucao(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate dataDevolucao) {
        return ResponseEntity.ok(emprestimoService.registrarDevolucao(id, dataDevolucao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        emprestimoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}