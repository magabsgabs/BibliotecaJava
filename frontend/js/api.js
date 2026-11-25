const API_URL = "https://bibliotecajava.onrender.com";

class ApiError extends Error {
  constructor(message, status, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function requestApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new ApiError(
      `Não foi possível conectar ao back-end em ${API_URL}. Verifique se o Spring Boot está rodando.`,
      0
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
  } else {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { mensagem: text };
      }
    }
  }

  if (!response.ok) {
    const msg =
      (data && (data.erro || data.error || data.message)) ||
      `Erro na requisição (HTTP ${response.status}).`;
    throw new ApiError(msg, response.status, data);
  }

  return data;
}

const BibliotecaApi = {
  listarLivros(titulo = "") {
    const query = titulo && titulo.trim()
      ? `?titulo=${encodeURIComponent(titulo.trim())}`
      : "";
    return requestApi(`/api/livros${query}`, { method: "GET" });
  },

  criarLivro(livroPayload) {
    return requestApi("/api/livros", {
      method: "POST",
      body: JSON.stringify(livroPayload),
    });
  },

  atualizarLivro(id, livroPayload) {
    return requestApi(`/api/livros/${id}`, {
      method: "PUT",
      body: JSON.stringify(livroPayload),
    });
  },

  excluirLivro(id) {
    return requestApi(`/api/livros/${id}`, {
      method: "DELETE",
    });
  },

  listarCategorias() {
    return requestApi("/api/categorias", { method: "GET" });
  },

  criarCategoria(nome) {
    return requestApi("/api/categorias", {
      method: "POST",
      body: JSON.stringify({ nome }),
    });
  },

  listarAutores() {
    return requestApi("/api/autores", { method: "GET" });
  },

  criarAutor(nome) {
    return requestApi("/api/autores", {
      method: "POST",
      body: JSON.stringify({ nome }),
    });
  },

  listarUsuarios() {
    return requestApi("/api/usuarios", { method: "GET" });
  },

  consultarCep(cep) {
    const cepLimpo = String(cep || "").replace(/\D/g, "");
    return requestApi(`/api/usuarios/cep/${encodeURIComponent(cepLimpo)}`, {
      method: "GET",
    });
  },

  cadastrarUsuario(usuarioPayload) {
    return requestApi("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(usuarioPayload),
    });
  },

  listarEmprestimos() {
    return requestApi("/api/emprestimos", { method: "GET" });
  },

  criarEmprestimo(emprestimoPayload) {
    return requestApi("/api/emprestimos", {
      method: "POST",
      body: JSON.stringify(emprestimoPayload),
    });
  },

  devolverEmprestimo(id, dataDevolucao = "") {
    const query = dataDevolucao
      ? `?dataDevolucao=${encodeURIComponent(dataDevolucao)}`
      : "";
    return requestApi(`/api/emprestimos/${id}/devolver${query}`, {
      method: "PUT",
    });
  },

  listarMultas(apenasPendentes = false) {
    const query = apenasPendentes ? "?apenasPendentes=true" : "";
    return requestApi(`/api/multas${query}`, { method: "GET" });
  },

  pagarMulta(id) {
    return requestApi(`/api/multas/${id}/pagar`, {
      method: "PUT",
    });
  },
};
