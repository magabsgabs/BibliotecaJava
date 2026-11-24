const state = {
  livros: [],
  categorias: [],
  autores: [],
  usuarios: [],
  emprestimos: [],
  multas: [],
  usuarioAtivoId: "",
  editandoLivroId: null,
};

function mostrarFeedback(mensagem, tipo = "info") {
  const banner = document.getElementById("feedbackBanner");
  const msgEl = document.getElementById("feedbackMessage");
  banner.classList.remove("hidden", "feedback-error", "feedback-success", "feedback-info");
  banner.classList.add(`feedback-${tipo}`);
  msgEl.textContent = mensagem;
}

function esconderFeedback() {
  document.getElementById("feedbackBanner").classList.add("hidden");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatarMoeda(valor) {
  const num = Number(valor || 0);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function configurarAbas() {
  const botoes = document.querySelectorAll(".tab-btn");
  const paineis = document.querySelectorAll(".tab-panel");

  botoes.forEach((btn) => {
    btn.addEventListener("click", () => {
      const alvo = btn.dataset.tab;
      botoes.forEach((b) => b.classList.toggle("active", b === btn));
      paineis.forEach((p) => p.classList.toggle("active", p.id === `tab-${alvo}`));
    });
  });
}

async function carregarCategorias() {
  try {
    const dados = await BibliotecaApi.listarCategorias();
    state.categorias = Array.isArray(dados) ? dados : [];
    renderizarCategorias();
    preencherSelectCategorias();
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
}

async function carregarAutores() {
  try {
    const dados = await BibliotecaApi.listarAutores();
    state.autores = Array.isArray(dados) ? dados : [];
    renderizarAutores();
    preencherSelectAutores();
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
}

function preencherSelectCategorias() {
  const select = document.getElementById("livroCategoria");
  const valorAtual = select.value;
  select.innerHTML = '<option value="">Selecione uma categoria...</option>';

  state.categorias.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = `${cat.nome} (#${cat.id})`;
    select.appendChild(opt);
  });

  if (valorAtual) select.value = valorAtual;
}

function preencherSelectAutores(idsSelecionados = []) {
  const select = document.getElementById("livroAutores");
  const selecionadosSet = new Set(idsSelecionados.map(Number));
  select.innerHTML = "";

  if (state.autores.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Nenhum autor cadastrado";
    select.appendChild(opt);
    return;
  }

  state.autores.forEach((autor) => {
    const opt = document.createElement("option");
    opt.value = autor.id;
    opt.textContent = `${autor.nome} (#${autor.id})`;
    if (selecionadosSet.has(Number(autor.id))) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function renderizarAutores() {
  const ul = document.getElementById("listaAutores");
  if (!state.autores.length) {
    ul.innerHTML = '<li class="empty-row">Nenhum autor encontrado.</li>';
    return;
  }
  ul.innerHTML = state.autores
    .map(
      (a) =>
        `<li><span><strong>${escapeHtml(a.nome)}</strong></span><span class="badge badge-neutral">ID #${a.id}</span></li>`
    )
    .join("");
}

function renderizarCategorias() {
  const ul = document.getElementById("listaCategorias");
  if (!state.categorias.length) {
    ul.innerHTML = '<li class="empty-row">Nenhuma categoria encontrada.</li>';
    return;
  }
  ul.innerHTML = state.categorias
    .map(
      (c) =>
        `<li><span><strong>${escapeHtml(c.nome)}</strong></span><span class="badge badge-neutral">ID #${c.id}</span></li>`
    )
    .join("");
}

function configurarFormsCatalogoApoio() {
  document.getElementById("formAutor").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("autorNome");
    try {
      await BibliotecaApi.criarAutor(input.value.trim());
      input.value = "";
      mostrarFeedback("Autor cadastrado com sucesso!", "success");
      await carregarAutores();
    } catch (err) {
      mostrarFeedback(err.message, "error");
    }
  });

  document.getElementById("formCategoria").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("categoriaNome");
    try {
      await BibliotecaApi.criarCategoria(input.value.trim());
      input.value = "";
      mostrarFeedback("Categoria cadastrada com sucesso!", "success");
      await carregarCategorias();
    } catch (err) {
      mostrarFeedback(err.message, "error");
    }
  });
}

async function carregarLivros(titulo = "") {
  try {
    const dados = await BibliotecaApi.listarLivros(titulo);
    state.livros = Array.isArray(dados) ? dados : [];
    renderizarLivros();
    preencherSelectEmprestimoLivros();
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
}

function obterNomeCategoriaLivro(livro) {
  if (livro.categoria && typeof livro.categoria === "object") {
    return livro.categoria.nome || `Cat #${livro.categoria.id}`;
  }
  const catId = livro.categoriaId ?? livro.categoria;
  const encontrada = state.categorias.find((c) => Number(c.id) === Number(catId));
  return encontrada ? encontrada.nome : catId ? `Cat #${catId}` : "—";
}

function obterNomesAutoresLivro(livro) {
  if (Array.isArray(livro.autores) && livro.autores.length) {
    return livro.autores
      .map((a) => (typeof a === "object" ? a.nome : `#${a}`))
      .join(", ");
  }
  if (Array.isArray(livro.autoresIds) && livro.autoresIds.length) {
    return livro.autoresIds
      .map((id) => {
        const encontrado = state.autores.find((a) => Number(a.id) === Number(id));
        return encontrado ? encontrado.nome : `Autor #${id}`;
      })
      .join(", ");
  }
  if (livro.autor && typeof livro.autor === "object") {
    return livro.autor.nome || `Autor #${livro.autor.id}`;
  }
  return "—";
}

function extrairIdsAutoresLivro(livro) {
  if (Array.isArray(livro.autores) && livro.autores.length) {
    return livro.autores.map((a) => Number(typeof a === "object" ? a.id : a));
  }
  if (Array.isArray(livro.autoresIds) && livro.autoresIds.length) {
    return livro.autoresIds.map(Number);
  }
  if (livro.autorId) return [Number(livro.autorId)];
  return [];
}

function renderizarLivros() {
  const tbody = document.getElementById("tabelaLivrosBody");
  if (!state.livros.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Nenhum livro encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = state.livros
    .map((livro) => {
      const qtDisp = livro.qtDisponivel ?? livro.quantidadeDisponivel ?? 0;
      const qtTot = livro.qtTotal ?? livro.quantidadeTotal ?? 0;
      const ano = livro.anoPublicacao ?? "—";
      const isbn = livro.isbn ?? "—";
      const badgeEstoque =
        Number(qtDisp) > 0
          ? `<span class="badge badge-success">${qtDisp}/${qtTot}</span>`
          : `<span class="badge badge-danger">0/${qtTot}</span>`;

      return `
        <tr>
          <td>#${livro.id}</td>
          <td>
            <strong>${escapeHtml(livro.titulo)}</strong><br />
            <small>ISBN: ${escapeHtml(isbn)}</small>
          </td>
          <td>${escapeHtml(ano)}</td>
          <td>${badgeEstoque}</td>
          <td>
            <small><strong>Cat.:</strong> ${escapeHtml(obterNomeCategoriaLivro(livro))}</small><br />
            <small><strong>Autor(es):</strong> ${escapeHtml(obterNomesAutoresLivro(livro))}</small>
          </td>
          <td>
            <div class="action-cell">
              <button type="button" class="btn btn-secondary btn-sm" onclick="prepararEdicaoLivro(${livro.id})">Editar</button>
              <button type="button" class="btn btn-danger btn-sm" onclick="removerLivro(${livro.id})">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function prepararEdicaoLivro(id) {
  const livro = state.livros.find((l) => Number(l.id) === Number(id));
  if (!livro) return;

  state.editandoLivroId = livro.id;
  document.getElementById("formLivroTitulo").textContent = `Editando Livro #${livro.id}`;
  document.getElementById("btnCancelarEdicaoLivro").classList.remove("hidden");
  document.getElementById("btnSalvarLivro").textContent = "Atualizar Livro";

  document.getElementById("livroId").value = livro.id;
  document.getElementById("livroTitulo").value = livro.titulo || "";
  document.getElementById("livroIsbn").value = livro.isbn || "";
  document.getElementById("livroAnoPublicacao").value = livro.anoPublicacao || "";
  document.getElementById("livroQtTotal").value = livro.qtTotal ?? livro.quantidadeTotal ?? 0;
  document.getElementById("livroQtDisponivel").value = livro.qtDisponivel ?? livro.quantidadeDisponivel ?? 0;

  const catId = livro.categoria?.id ?? livro.categoriaId ?? livro.categoria ?? "";
  document.getElementById("livroCategoria").value = catId;
  preencherSelectAutores(extrairIdsAutoresLivro(livro));

  document.getElementById("formLivro").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetarFormLivro() {
  state.editandoLivroId = null;
  document.getElementById("formLivro").reset();
  document.getElementById("livroId").value = "";
  document.getElementById("formLivroTitulo").textContent = "Cadastrar Novo Livro";
  document.getElementById("btnCancelarEdicaoLivro").classList.add("hidden");
  document.getElementById("btnSalvarLivro").textContent = "Salvar Livro";
  preencherSelectAutores([]);
}

async function removerLivro(id) {
  if (!confirm(`Deseja realmente excluir o livro #${id}?`)) return;
  try {
    await BibliotecaApi.excluirLivro(id);
    mostrarFeedback(`Livro #${id} excluído com sucesso!`, "success");
    await carregarLivros(document.getElementById("buscaTituloInput").value);
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
}

function configurarEventosLivros() {
  document.getElementById("formLivro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const autoresSelecionados = Array.from(
      document.getElementById("livroAutores").selectedOptions
    )
      .map((opt) => Number(opt.value))
      .filter((n) => !Number.isNaN(n) && n > 0);

    const categoriaId = Number(document.getElementById("livroCategoria").value);
    const qtTotal = Number(document.getElementById("livroQtTotal").value);
    const qtDisponivel = Number(document.getElementById("livroQtDisponivel").value);

    const payload = {
      titulo: document.getElementById("livroTitulo").value.trim(),
      isbn: document.getElementById("livroIsbn").value.trim(),
      anoPublicacao: Number(document.getElementById("livroAnoPublicacao").value),
      qtTotal,
      qtDisponivel,
      categoriaId,
      autoresIds: autoresSelecionados,
    };

    try {
      if (state.editandoLivroId) {
        await BibliotecaApi.atualizarLivro(state.editandoLivroId, payload);
        mostrarFeedback(`Livro #${state.editandoLivroId} atualizado com sucesso!`, "success");
      } else {
        await BibliotecaApi.criarLivro(payload);
        mostrarFeedback("Livro cadastrado com sucesso!", "success");
      }
      resetarFormLivro();
      await carregarLivros(document.getElementById("buscaTituloInput").value);
    } catch (err) {
      mostrarFeedback(err.message, "error");
    }
  });

  document.getElementById("btnCancelarEdicaoLivro").addEventListener("click", resetarFormLivro);
  document.getElementById("btnAtualizarLivros").addEventListener("click", () =>
    carregarLivros(document.getElementById("buscaTituloInput").value)
  );

  document.getElementById("btnBuscarLivro").addEventListener("click", () => {
    carregarLivros(document.getElementById("buscaTituloInput").value);
  });

  document.getElementById("buscaTituloInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      carregarLivros(e.target.value);
    }
  });

  document.getElementById("btnLimparBuscaLivro").addEventListener("click", () => {
    document.getElementById("buscaTituloInput").value = "";
    carregarLivros("");
  });
}

async function carregarUsuarios() {
  try {
    const dados = await BibliotecaApi.listarUsuarios();
    state.usuarios = Array.isArray(dados) ? dados : [];
    renderizarUsuarios();
    preencherSeletoresUsuarios();
  } catch (err) {
    state.usuarios = [];
    renderizarUsuarios();
    preencherSeletoresUsuarios();
  }
}

function preencherSeletoresUsuarios() {
  const topSelect = document.getElementById("usuarioAtivoSelect");
  const empSelect = document.getElementById("emprestimoUsuarioSelect");

  topSelect.innerHTML = '<option value="">Selecione um usuário...</option>';
  empSelect.innerHTML = '<option value="">Opcional: escolher da lista de usuários...</option>';

  state.usuarios.forEach((u) => {
    const label = `${u.nome} (#${u.id}) — ${u.role || "LEITOR"}`;

    const optTop = document.createElement("option");
    optTop.value = u.id;
    optTop.textContent = label;
    topSelect.appendChild(optTop);

    const optEmp = document.createElement("option");
    optEmp.value = u.id;
    optEmp.textContent = label;
    empSelect.appendChild(optEmp);
  });

  if (state.usuarioAtivoId) {
    topSelect.value = state.usuarioAtivoId;
  }
  atualizarBadgeUsuarioAtivo();
}

function atualizarBadgeUsuarioAtivo() {
  const badge = document.getElementById("usuarioAtivoBadge");
  if (!state.usuarioAtivoId) {
    badge.textContent = "Sem seleção";
    badge.className = "badge badge-neutral";
    return;
  }
  const user = state.usuarios.find((u) => Number(u.id) === Number(state.usuarioAtivoId));
  badge.textContent = user ? `${user.nome} (${user.role || "LEITOR"})` : `ID #${state.usuarioAtivoId}`;
  badge.className = "badge badge-success";
}

function formatarEnderecoUsuario(u) {
  const partes = [
    u.logradouro || u.rua,
    u.numero ? `nº ${u.numero}` : "",
    u.bairro,
    u.cidade || u.localidade,
    u.uf || u.estado,
    u.cep ? `CEP ${u.cep}` : "",
  ].filter(Boolean);
  return partes.length ? partes.join(", ") : "—";
}

function renderizarUsuarios() {
  const tbody = document.getElementById("tabelaUsuariosBody");
  if (!state.usuarios.length) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="empty-row">Nenhum usuário listado (ou cadastre um novo usuário ao lado).</td></tr>';
    return;
  }

  tbody.innerHTML = state.usuarios
    .map(
      (u) => `
        <tr>
          <td>#${u.id}</td>
          <td>
            <strong>${escapeHtml(u.nome)}</strong><br />
            <small>${escapeHtml(u.email)}</small>
          </td>
          <td>
            <span class="badge badge-neutral">${escapeHtml(u.role || "LEITOR")}</span><br />
            <small>CPF: ${escapeHtml(u.cpf || "—")}</small>
          </td>
          <td><small>${escapeHtml(formatarEnderecoUsuario(u))}</small></td>
        </tr>
      `
    )
    .join("");
}

async function buscarEnderecoViaCep() {
  const cepInput = document.getElementById("usuarioCep");
  const preview = document.getElementById("previewEnderecoBox");
  const cepLimpo = cepInput.value.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    preview.textContent = "Informe um CEP válido com 8 dígitos.";
    return;
  }

  preview.textContent = "Consultando CEP na API...";
  try {
    const dados = await BibliotecaApi.consultarCep(cepLimpo);
    const logradouro = dados.logradouro || "";
    const bairro = dados.bairro || "";
    const cidade = dados.localidade || dados.cidade || "";
    const uf = dados.uf || dados.estado || "";
    const numero = document.getElementById("usuarioNumero").value.trim();

    preview.textContent =
      [logradouro, numero ? `nº ${numero}` : "", bairro, cidade && uf ? `${cidade}/${uf}` : cidade || uf]
        .filter(Boolean)
        .join(" • ") || JSON.stringify(dados);
  } catch (err) {
    preview.textContent = `Falha ao consultar CEP: ${err.message}`;
    mostrarFeedback(err.message, "error");
  }
}

function configurarEventosUsuarios() {
  document.getElementById("usuarioAtivoSelect").addEventListener("change", (e) => {
    state.usuarioAtivoId = e.target.value;
    atualizarBadgeUsuarioAtivo();
    if (state.usuarioAtivoId) {
      document.getElementById("emprestimoUsuarioId").value = state.usuarioAtivoId;
      document.getElementById("emprestimoUsuarioSelect").value = state.usuarioAtivoId;
    }
  });

  document.getElementById("btnBuscarCep").addEventListener("click", buscarEnderecoViaCep);
  document.getElementById("usuarioCep").addEventListener("blur", buscarEnderecoViaCep);
  document.getElementById("usuarioNumero").addEventListener("input", () => {
    if (document.getElementById("usuarioCep").value.replace(/\D/g, "").length === 8) {
      buscarEnderecoViaCep();
    }
  });

  document.getElementById("formUsuario").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      nome: document.getElementById("usuarioNome").value.trim(),
      email: document.getElementById("usuarioEmail").value.trim(),
      senha: document.getElementById("usuarioSenha").value,
      cpf: document.getElementById("usuarioCpf").value.trim(),
      role: document.getElementById("usuarioRole").value,
      cep: document.getElementById("usuarioCep").value.trim(),
      numero: document.getElementById("usuarioNumero").value.trim(),
    };

    try {
      const criado = await BibliotecaApi.cadastrarUsuario(payload);
      mostrarFeedback(
        `Usuário "${criado.nome || payload.nome}" cadastrado com sucesso!`,
        "success"
      );
      e.target.reset();
      document.getElementById("previewEnderecoBox").textContent =
        "Digite um CEP válido e saia do campo ou clique em 'Buscar CEP'.";
      await carregarUsuarios();
    } catch (err) {
      mostrarFeedback(err.message, "error");
    }
  });

  document.getElementById("btnAtualizarUsuarios").addEventListener("click", carregarUsuarios);
}

function preencherSelectEmprestimoLivros() {
  const select = document.getElementById("emprestimoLivroSelect");
  select.innerHTML = '<option value="">Opcional: escolher da lista de livros...</option>';
  state.livros.forEach((l) => {
    const qtDisp = l.qtDisponivel ?? l.quantidadeDisponivel ?? 0;
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = `${l.titulo} (#${l.id}) — Disp.: ${qtDisp}`;
    select.appendChild(opt);
  });
}

async function carregarEmprestimos() {
  try {
    const dados = await BibliotecaApi.listarEmprestimos();
    state.emprestimos = Array.isArray(dados) ? dados : [];
    renderizarEmprestimos();
  } catch (err) {
    state.emprestimos = [];
    renderizarEmprestimos();
  }
}

function renderizarEmprestimos() {
  const tbody = document.getElementById("tabelaEmprestimosBody");
  if (!state.emprestimos.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhum empréstimo registrado.</td></tr>';
    return;
  }

  tbody.innerHTML = state.emprestimos
    .map((emp) => {
      const usuarioLabel =
        emp.usuario?.nome || emp.nomeUsuario || `Usuário #${emp.usuarioId ?? emp.usuario?.id ?? "?"}`;
      const livroLabel =
        emp.livro?.titulo || emp.tituloLivro || `Livro #${emp.livroId ?? emp.livro?.id ?? "?"}`;
      const devolvido = Boolean(emp.dataDevolucao || emp.devolvido || emp.status === "DEVOLVIDO");
      const statusBadge = devolvido
        ? `<span class="badge badge-success">Devolvido</span>`
        : `<span class="badge badge-warning">Ativo</span>`;

      const prazoInfo = emp.dataPrevistaDevolucao
        ? `Prazo: ${escapeHtml(emp.dataPrevistaDevolucao)}`
        : emp.diasPrazo
        ? `Prazo: ${escapeHtml(emp.diasPrazo)} dias`
        : "";

      return `
        <tr>
          <td>#${emp.id}</td>
          <td>${escapeHtml(usuarioLabel)}</td>
          <td>${escapeHtml(livroLabel)}</td>
          <td>
            ${statusBadge}<br />
            <small>${escapeHtml(prazoInfo)}</small>
          </td>
          <td>
            ${
              devolvido
                ? "<small>Concluído</small>"
                : `<button type="button" class="btn btn-primary btn-sm" onclick="devolverLivro(${emp.id})">Devolver</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
}

async function devolverLivro(id) {
  const dataSimulada = document.getElementById("dataDevolucaoSimulada").value;
  try {
    const resp = await BibliotecaApi.devolverEmprestimo(id, dataSimulada);
    const detalheMulta = resp && resp.valorMulta ? ` Multa gerada: ${formatarMoeda(resp.valorMulta)}.` : "";
    mostrarFeedback(`Empréstimo #${id} devolvido com sucesso!${detalheMulta}`, "success");
    await Promise.all([carregarEmprestimos(), carregarLivros(), carregarMultas()]);
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
}

function configurarEventosEmprestimos() {
  document.getElementById("emprestimoUsuarioSelect").addEventListener("change", (e) => {
    if (e.target.value) document.getElementById("emprestimoUsuarioId").value = e.target.value;
  });

  document.getElementById("emprestimoLivroSelect").addEventListener("change", (e) => {
    if (e.target.value) document.getElementById("emprestimoLivroId").value = e.target.value;
  });

  document.getElementById("formEmprestimo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuarioId = Number(document.getElementById("emprestimoUsuarioId").value);
    const livroId = Number(document.getElementById("emprestimoLivroId").value);
    const prazoRaw = document.getElementById("emprestimoDiasPrazo").value;

    const payload = { usuarioId, livroId };
    if (prazoRaw && Number(prazoRaw) > 0) {
      payload.diasPrazo = Number(prazoRaw);
    }

    try {
      await BibliotecaApi.criarEmprestimo(payload);
      mostrarFeedback("Empréstimo criado e estoque atualizado!", "success");
      e.target.reset();
      await Promise.all([carregarEmprestimos(), carregarLivros()]);
    } catch (err) {
      mostrarFeedback(err.message, "error");
    }
  });

  document.getElementById("btnAtualizarEmprestimos").addEventListener("click", carregarEmprestimos);
}

async function carregarMultas() {
  const apenasPendentes = document.getElementById("filtroApenasPendentes").checked;
  try {
    const dados = await BibliotecaApi.listarMultas(apenasPendentes);
    state.multas = Array.isArray(dados) ? dados : [];
    renderizarMultas();
  } catch (err) {
    state.multas = [];
    renderizarMultas();
  }
}

function renderizarMultas() {
  const tbody = document.getElementById("tabelaMultasBody");
  if (!state.multas.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhuma multa encontrada.</td></tr>';
    return;
  }

  tbody.innerHTML = state.multas
    .map((m) => {
      const paga = Boolean(m.paga || m.pago || m.status === "PAGA");
      const valor = m.valor ?? m.valorMulta ?? 0;
      const diasAtraso = m.diasAtraso ?? "—";
      const empInfo = m.emprestimoId ? `Empréstimo #${m.emprestimoId}` : `Ref. #${m.id}`;

      return `
        <tr>
          <td>#${m.id}</td>
          <td>${escapeHtml(empInfo)}</td>
          <td>
            <strong>${formatarMoeda(valor)}</strong><br />
            <small>Dias atraso: ${escapeHtml(diasAtraso)}</small>
          </td>
          <td>
            ${
              paga
                ? '<span class="badge badge-success">Paga</span>'
                : '<span class="badge badge-danger">Pendente</span>'
            }
          </td>
          <td>
            ${
              paga
                ? "<small>Quitada</small>"
                : `<button type="button" class="btn btn-primary btn-sm" onclick="pagarMulta(${m.id})">Pagar / Dar baixa</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
}

async function pagarMulta(id) {
  try {
    await BibliotecaApi.pagarMulta(id);
    mostrarFeedback(`Multa #${id} quitada com sucesso!`, "success");
    await carregarMultas();
  } catch (err) {
    mostrarFeedback(err.message, "error");
  }
}

function configurarEventosMultas() {
  document.getElementById("filtroApenasPendentes").addEventListener("change", carregarMultas);
  document.getElementById("btnAtualizarMultas").addEventListener("click", carregarMultas);
}

async function inicializarAplicacao() {
  document.getElementById("apiUrlLabel").textContent = API_URL;
  document.getElementById("feedbackClose").addEventListener("click", esconderFeedback);

  configurarAbas();
  configurarFormsCatalogoApoio();
  configurarEventosLivros();
  configurarEventosUsuarios();
  configurarEventosEmprestimos();
  configurarEventosMultas();

  await Promise.all([
    carregarCategorias(),
    carregarAutores(),
    carregarLivros(),
    carregarUsuarios(),
    carregarEmprestimos(),
    carregarMultas(),
  ]);
}

document.addEventListener("DOMContentLoaded", inicializarAplicacao);