package com.biblioteca.biblioteca_api.controller;

import com.biblioteca.biblioteca_api.model.Multa;
import com.biblioteca.biblioteca_api.service.MultaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/multas")
public class MultaController {

    private final MultaService multaService;

    public MultaController(MultaService multaService) {
        this.multaService = multaService;
    }

    @GetMapping
    public List<Multa> listar(@RequestParam(required = false) Boolean apenasPendentes) {
        if (Boolean.TRUE.equals(apenasPendentes)) {
            return multaService.listarPendentes();
        }
        return multaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Multa> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(multaService.buscarPorId(id));
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<Multa> pagar(@PathVariable Long id) {
        return ResponseEntity.ok(multaService.pagarMulta(id));
    }
}