package com.biblioteca.biblioteca_api.repository;

import com.biblioteca.biblioteca_api.model.Multa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MultaRepository extends JpaRepository<Multa, Long> {
    List<Multa> findByPagaFalse();
}