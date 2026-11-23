package com.biblioteca.biblioteca_api.config;

import com.biblioteca.biblioteca_api.model.*;
import com.biblioteca.biblioteca_api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final AutorRepository autorRepository;
    private final LivroRepository livroRepository;

    public DataSeeder(UsuarioRepository usuarioRepository,
                      CategoriaRepository categoriaRepository,
                      AutorRepository autorRepository,
                      LivroRepository livroRepository) {
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.autorRepository = autorRepository;
        this.livroRepository = livroRepository;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) {
            return;
        }

        Categoria categoria = new Categoria();
        categoria.setNome("Tecnologia");
        categoria.setDescricao("Livros de programacao e arquitetura de software");
        categoria = categoriaRepository.save(categoria);

        Autor autor = new Autor();
        autor.setNome("Robert C. Martin");
        autor.setNacionalidade("Estados Unidos");
        autor = autorRepository.save(autor);

        Livro livro = new Livro();
        livro.setTitulo("Clean Code");
        livro.setIsbn("978-0132350884");
        livro.setAnoPublicacao(2008);
        livro.setQuantidadeTotal(3);
        livro.setQuantidadeDisponivel(3);
        livro.setCategoria(categoria);
        livro.setAutores(new HashSet<>(Set.of(autor)));
        livroRepository.save(livro);

        Endereco endereco = new Endereco();
        endereco.setCep("11015-002");
        endereco.setLogradouro("Avenida Conselheiro Nebias");
        endereco.setNumero("100");
        endereco.setBairro("Vila Mathias");
        endereco.setCidade("Santos");
        endereco.setUf("SP");

        Usuario admin = new Usuario();
        admin.setNome("Admin Biblioteca");
        admin.setEmail("admin@biblioteca.com");
        admin.setSenha("123456");
        admin.setCpf("000.000.000-00");
        admin.setRole(Role.ADMIN);
        admin.setEndereco(endereco);
        usuarioRepository.save(admin);
    }
}