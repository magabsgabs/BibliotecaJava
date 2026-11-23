package com.biblioteca.biblioteca_api.service;

import com.biblioteca.biblioteca_api.model.Multa;
import com.biblioteca.biblioteca_api.repository.MultaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MultaService {

    private final MultaRepository multaRepository;

    public MultaService(MultaRepository multaRepository) {
        this.multaRepository = multaRepository;
    }

    public List<Multa> listarTodas() {
        return multaRepository.findAll();
    }

    public List<Multa> listarPendentes() {
        return multaRepository.findByPagaFalse();
    }

    public Multa buscarPorId(Long id) {
        return multaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Multa nao encontrada com id: " + id));
    }

    public Multa pagarMulta(Long id) {
        Multa multa = buscarPorId(id);
        if (multa.isPaga()) {
            throw new IllegalArgumentException("Esta multa ja foi paga.");
        }
        multa.setPaga(true);
        return multaRepository.save(multa);
    }
}