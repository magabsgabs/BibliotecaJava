package com.biblioteca.biblioteca_api.service;

import com.biblioteca.biblioteca_api.dto.EmprestimoRequestDTO;
import com.biblioteca.biblioteca_api.model.Emprestimo;
import com.biblioteca.biblioteca_api.model.Livro;
import com.biblioteca.biblioteca_api.model.Multa;
import com.biblioteca.biblioteca_api.model.StatusEmprestimo;
import com.biblioteca.biblioteca_api.model.Usuario;
import com.biblioteca.biblioteca_api.repository.EmprestimoRepository;
import com.biblioteca.biblioteca_api.repository.LivroRepository;
import com.biblioteca.biblioteca_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmprestimoService {

    private static final BigDecimal VALOR_MULTA_POR_DIA = new BigDecimal("2.50");

    private final EmprestimoRepository emprestimoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository,
                             UsuarioRepository usuarioRepository,
                             LivroRepository livroRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.usuarioRepository = usuarioRepository;
        this.livroRepository = livroRepository;
    }

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public List<Emprestimo> listarPorUsuario(Long usuarioId) {
        return emprestimoRepository.findByUsuarioId(usuarioId);
    }

    public Emprestimo buscarPorId(Long id) {
        return emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprestimo nao encontrado com id: " + id));
    }

    @Transactional
    public Emprestimo realizarEmprestimo(EmprestimoRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado com id: " + dto.getUsuarioId()));

        Livro livro = livroRepository.findById(dto.getLivroId())
                .orElseThrow(() -> new RuntimeException("Livro nao encontrado com id: " + dto.getLivroId()));

        if (livro.getQuantidadeDisponivel() <= 0) {
            throw new IllegalArgumentException("Nao ha exemplares disponiveis para este livro.");
        }

        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() - 1);
        livroRepository.save(livro);

        int dias = (dto.getDiasPrazo() != null && dto.getDiasPrazo() > 0) ? dto.getDiasPrazo() : 7;
        LocalDate hoje = LocalDate.now();

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setLivro(livro);
        emprestimo.setDataEmprestimo(hoje);
        emprestimo.setDataPrevistaDevolucao(hoje.plusDays(dias));
        emprestimo.setStatus(StatusEmprestimo.ATIVO);

        return emprestimoRepository.save(emprestimo);
    }

    @Transactional
    public Emprestimo registrarDevolucao(Long id, LocalDate dataDevolucao) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            throw new IllegalArgumentException("Este emprestimo ja foi devolvido.");
        }

        LocalDate dataReal = (dataDevolucao != null) ? dataDevolucao : LocalDate.now();
        emprestimo.setDataDevolucaoReal(dataReal);
        emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);

        Livro livro = emprestimo.getLivro();
        livro.setQuantidadeDisponivel(Math.min(livro.getQuantidadeTotal(), livro.getQuantidadeDisponivel() + 1));
        livroRepository.save(livro);

        if (dataReal.isAfter(emprestimo.getDataPrevistaDevolucao())) {
            long diasAtraso = ChronoUnit.DAYS.between(emprestimo.getDataPrevistaDevolucao(), dataReal);
            BigDecimal valorMulta = VALOR_MULTA_POR_DIA.multiply(BigDecimal.valueOf(diasAtraso));

            Multa multa = new Multa();
            multa.setEmprestimo(emprestimo);
            multa.setValor(valorMulta);
            multa.setDataGeracao(dataReal);
            multa.setPaga(false);

            emprestimo.setMulta(multa);
        }

        return emprestimoRepository.save(emprestimo);
    }

    @Transactional
    public void deletar(Long id) {
        Emprestimo emprestimo = buscarPorId(id);
        if (emprestimo.getStatus() != StatusEmprestimo.DEVOLVIDO) {
            Livro livro = emprestimo.getLivro();
            livro.setQuantidadeDisponivel(Math.min(livro.getQuantidadeTotal(), livro.getQuantidadeDisponivel() + 1));
            livroRepository.save(livro);
        }
        emprestimoRepository.delete(emprestimo);
    }
}