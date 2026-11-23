package com.biblioteca.biblioteca_api.service;

import com.biblioteca.biblioteca_api.dto.LivroRequestDTO;
import com.biblioteca.biblioteca_api.model.Autor;
import com.biblioteca.biblioteca_api.model.Categoria;
import com.biblioteca.biblioteca_api.model.Livro;
import com.biblioteca.biblioteca_api.repository.AutorRepository;
import com.biblioteca.biblioteca_api.repository.CategoriaRepository;
import com.biblioteca.biblioteca_api.repository.LivroRepository;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final CategoriaRepository categoriaRepository;
    private final AutorRepository autorRepository;

    public LivroService(LivroRepository livroRepository,
                        CategoriaRepository categoriaRepository,
                        AutorRepository autorRepository) {
        this.livroRepository = livroRepository;
        this.categoriaRepository = categoriaRepository;
        this.autorRepository = autorRepository;
    }

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public List<Livro> buscarPorTitulo(String titulo) {
        return livroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro nao encontrado com id: " + id));
    }

    public Livro criar(LivroRequestDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrada com id: " + dto.getCategoriaId()));

        int total = dto.getQuantidadeTotal() != null ? dto.getQuantidadeTotal() : 1;

        Livro livro = new Livro();
        livro.setTitulo(dto.getTitulo());
        livro.setIsbn(dto.getIsbn());
        livro.setAnoPublicacao(dto.getAnoPublicacao());
        livro.setQuantidadeTotal(total);
        livro.setQuantidadeDisponivel(total);
        livro.setCategoria(categoria);

        if (dto.getAutoresIds() != null && !dto.getAutoresIds().isEmpty()) {
            Set<Autor> autores = new HashSet<>(autorRepository.findAllById(dto.getAutoresIds()));
            livro.setAutores(autores);
        }

        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, LivroRequestDTO dto) {
        Livro livro = buscarPorId(id);
        livro.setTitulo(dto.getTitulo());
        livro.setIsbn(dto.getIsbn());
        livro.setAnoPublicacao(dto.getAnoPublicacao());

        if (dto.getQuantidadeTotal() != null) {
            int diferenca = dto.getQuantidadeTotal() - livro.getQuantidadeTotal();
            livro.setQuantidadeTotal(dto.getQuantidadeTotal());
            livro.setQuantidadeDisponivel(Math.max(0, livro.getQuantidadeDisponivel() + diferenca));
        }

        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoria nao encontrada com id: " + dto.getCategoriaId()));
            livro.setCategoria(categoria);
        }

        if (dto.getAutoresIds() != null) {
            Set<Autor> autores = new HashSet<>(autorRepository.findAllById(dto.getAutoresIds()));
            livro.setAutores(autores);
        }

        return livroRepository.save(livro);
    }

    public void deletar(Long id) {
        Livro livro = buscarPorId(id);
        livroRepository.delete(livro);
    }
}