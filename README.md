# Biblioteca API

API REST desenvolvida em Java com Spring Boot para gerenciamento de uma biblioteca (usuários, endereços via ViaCEP, categorias, autores, livros, empréstimos e cálculo automático de multas por atraso).

## Integrantes
- Maria Gabriella Giacomini Alves ([@magabsgabs](https://github.com/magabsgabs))
- Anna Beatriz Martins ([@annabeatriz-martins](https://github.com/annabeatriz-martins))

## Tecnologias Utilizadas
- Java 25 & Spring Boot 4.2.0
- Spring Data JPA / Hibernate
- Spring Security (CORS configurado)
- Banco de Dados H2 (em memória)
- Integração com API externa ViaCEP (`RestClient`)
- Documentação interativa com Swagger / OpenAPI (Springdoc)

## Como Executar Localmente
1. Clone o repositório e importe como projeto Maven no Eclipse/IntelliJ.
2. Execute a classe `BibliotecaApiApplication.java`.
3. Acesse a documentação e teste as rotas pelo Swagger:
   - **Swagger UI:** `http://localhost:8081/swagger-ui/index.html`
   - **Console H2:** `http://localhost:8081/h2-console` (JDBC URL: `jdbc:h2:mem:bibliotecadb`, User: `sa`, sem senha)

## Principais Endpoints
- **Usuários & ViaCEP:** `/api/usuarios` e `GET /api/usuarios/cep/{cep}`
- **Categorias:** `/api/categorias`
- **Autores:** `/api/autores`
- **Livros:** `/api/livros` (aceita filtro `?titulo=`)
- **Empréstimos:** `/api/emprestimos` e `PUT /api/emprestimos/{id}/devolver`
- **Multas:** `/api/multas` e `PUT /api/multas/{id}/pagar`