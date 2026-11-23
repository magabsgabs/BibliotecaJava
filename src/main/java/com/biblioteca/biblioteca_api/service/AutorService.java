package com.biblioteca.biblioteca_api.service;

import com.biblioteca.biblioteca_api.model.Autor;
import com.biblioteca.biblioteca_api.repository.AutorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AutorService {

    private final AutorRepository autorRepository;

    public AutorService(AutorRepository autorRepository) {
        this.autorRepository = autorRepository;
    }

    public List<Autor> listarTodos() {
        return autorRepository.findAll();
    }

    public Autor buscarPorId(Long id) {
        return autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor nao encontrado com id: " + id));
    }

    public Autor criar(Autor autor) {
        return autorRepository.save(autor);
    }

    public Autor atualizar(Long id, Autor dados) {
        Autor autor = buscarPorId(id);
        autor.setNome(dados.getNome());
        autor.setNacionalidade(dados.getNacionalidade());
        return autorRepository.save(autor);
    }

    public void deletar(Long id) {
        Autor autor = buscarPorId(id);
        autorRepository.delete(autor);
    }
}