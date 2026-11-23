package com.biblioteca.biblioteca_api.repository;

import com.biblioteca.biblioteca_api.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}