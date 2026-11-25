# Biblioteca API

API REST desenvolvida em Java com Spring Boot para gerenciamento de uma biblioteca (usuários, endereços via ViaCEP, categorias, autores, livros, empréstimos e cálculo automático de multas por atraso).

## Links do Projeto

- **Aplicação Web / Front-end (Vercel):** [https://bibliotecajava-frontend.vercel.app](https://bibliotecajava-frontend.vercel.app)
- **Back-end / API Base (Render):** [https://bibliotecajava.onrender.com](https://bibliotecajava.onrender.com)
- **Documentação Swagger UI:** [https://bibliotecajava.onrender.com/swagger-ui/index.html](https://bibliotecajava.onrender.com/swagger-ui/index.html)
- **Repositório (GitHub):** [https://github.com/magabsgabs/BibliotecaJava](https://github.com/magabsgabs/BibliotecaJava)

*(Nota: Como a API está hospedada no plano gratuito do Render, a primeira requisição após um período de inatividade pode levar cerca de 50 segundos para iniciar o servidor.)*

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
- Front-end em HTML5, CSS3 e JavaScript
- Containerização com Docker

## Como Executar Localmente

1. Clone o repositório (`git clone https://github.com/magabsgabs/BibliotecaJava.git`) e importe como projeto Maven no Eclipse/IntelliJ.
2. Execute a classe `BibliotecaApiApplication.java`.
3. Acesse a documentação e teste as rotas pelo Swagger:
   - **Swagger UI:** http://localhost:8081/swagger-ui/index.html
   - **Console H2:** http://localhost:8081/h2-console (JDBC URL: `jdbc:h2:mem:bibliotecadb`, User: `sa`, sem senha)
4. Abra o arquivo `frontend/index.html` no navegador (ou via Live Server) para utilizar a interface web.

## Principais Endpoints

- **Usuários & ViaCEP:** `/api/usuarios` e `GET /api/usuarios/cep/{cep}`
- **Categorias:** `/api/categorias`
- **Autores:** `/api/autores`
- **Livros:** `/api/livros` (aceita filtro `?titulo=`)
- **Empréstimos:** `/api/emprestimos` e `PUT /api/emprestimos/{id}/devolver`
- **Multas:** `/api/multas` e `PUT /api/multas/{id}/pagar`# Biblioteca API

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