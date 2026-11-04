# Nodus

**Meu primeiro projeto full-stack: um fórum de publicações desenvolvido com JavaScript, Node.js, Express e PostgreSQL.**

> **Versão:** 2.0 — etapa de desenvolvimento concluída para fins de estudo.  
> **Status:** projeto de aprendizado e portfólio, executado localmente. **Não preparado para uso em produção.**

O **Nodus** é um fórum criado como projeto individual para aprender a desenvolver uma aplicação web de ponta a ponta: construir a interface, criar uma API REST, validar requisições, autenticar usuários, controlar permissões e persistir informações em um banco de dados relacional.

A versão 1.0 foi a primeira etapa desse aprendizado. A **v2.0** evoluiu o projeto com sessões autenticadas por cookie, vínculo entre posts e usuários e funcionalidades de exclusão.

## Funcionalidades

- **Cadastro:** criação de contas com nome de usuário, e-mail e senha.
- **Login e logout:** autenticação com sessões gerenciadas pelo Express e armazenadas no PostgreSQL.
- **Senhas protegidas:** armazenamento de hashes com `bcrypt` — a senha original não é salva no banco.
- **Publicações:** criação e visualização de posts com categoria, título, conteúdo e autor.
- **Feed:** listagem das publicações cadastradas, com pesquisa por título e filtro por categoria.
- **Categorias:** Geral, Programação, Jogos e Tecnologia.
- **Perfil:** visualização do nome do usuário, quantidade de posts e suas publicações.
- **Exclusão de posts:** opção disponível no perfil; o backend verifica se o post pertence ao usuário autenticado.
- **Exclusão de conta:** remove a conta e suas publicações em uma transação no banco, e encerra a sessão após a exclusão.
- **Monitoramento básico:** endpoints para verificar a disponibilidade da API e a conexão com o banco.

> A v2.0 representa a conclusão de uma etapa de estudos, não um produto completo. Algumas opções visuais ainda são demonstrativas; veja [Limitações conhecidas](#limitações-conhecidas).

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript puro (Vanilla JS), Bootstrap Icons |
| Backend | Node.js, Express 5 |
| Banco de dados | PostgreSQL |
| Acesso ao banco | `pg` (`Pool`) |
| Autenticação | `express-session` e `connect-pg-simple` |
| Senhas | `bcrypt` |
| Validação | Zod |
| Comunicação e configuração | Fetch API, JSON, CORS, dotenv |

O frontend não utiliza frameworks como React ou Vue. O projeto foi desenvolvido com o objetivo de praticar os fundamentos antes de adicionar ferramentas mais complexas.

## Estrutura do projeto

```text
Forum-Nodus/
├── backend/
│   ├── .env.example          # Exemplo das variáveis de ambiente
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── db/
│       │   └── db.js         # Pool do PostgreSQL
│       └── index.js          # Servidor, sessões, validações e rotas
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js           # Requisições à API
│   │   ├── login.js         # Cadastro e login
│   │   ├── perfil.js        # Perfil e exclusão de posts
│   │   └── script.js        # Feed, pesquisa, filtros e modais
│   ├── index.html
│   ├── login.html
│   └── perfil.html
├── .gitignore
└── readme.md
```

## Como executar localmente

### Pré-requisitos

- **Node.js 20.6 ou superior**, com npm. O script do projeto usa `node --env-file`.
- **PostgreSQL** instalado e em execução.
- Navegador atualizado.
- Um servidor HTTP para o frontend, como a extensão **Live Server** do VS Code.
- Uma ferramenta para executar SQL, como `psql` ou pgAdmin.

### 1. Clonar o repositório

```bash
git clone https://github.com/CadevV/Forum-Nodus.git
cd Forum-Nodus
```

### 2. Instalar as dependências do backend

```bash
cd backend
npm install
```

### 3. Preparar o banco de dados

Crie um banco PostgreSQL chamado `dbNodus` (ou utilize outro nome e ajuste `PGDATABASE`):

```sql
CREATE DATABASE "dbNodus";
```

**Conecte-se ao banco criado** antes de executar as instruções abaixo. O backend espera as tabelas `tbUser` e `tbPost`, incluindo o campo `usuario_id` que relaciona os posts aos usuários.

Exemplo de esquema mínimo compatível para **uma instalação nova**:

```sql
CREATE TABLE IF NOT EXISTS tbUser (
    id SERIAL PRIMARY KEY,
    emailUser TEXT NOT NULL UNIQUE,
    nameUser TEXT NOT NULL UNIQUE,
    hashUser TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbPost (
    id SERIAL PRIMARY KEY,
    tags TEXT NOT NULL,
    autor TEXT NOT NULL,
    titulo VARCHAR(20) NOT NULL,
    conteudo VARCHAR(200) NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES tbUser(id)
);
```

> **Importante:** esse SQL é um exemplo elaborado a partir das consultas do backend, não uma migration oficial do projeto. Não o execute cegamente sobre um banco existente da v1: `CREATE TABLE IF NOT EXISTS` não adiciona colunas ausentes nem migra dados. A tabela `session` é gerenciada pelo `connect-pg-simple` com `createTableIfMissing: true`.

### 4. Configurar o ambiente

Na pasta `backend`, copie o exemplo para um arquivo `.env`:

```bash
cp .env.example .env
```

Ou crie o arquivo manualmente, com o seguinte conteúdo:

```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=dbNodus
PGUSER=postgres
PGPASSWORD=SUA_SENHA_LOCAL
SESSION_SECRET=UMA_CHAVE_ALEATORIA_LONGA_E_SECRETA
```

Substitua os valores pelos dados do seu PostgreSQL. Use uma chave longa e aleatória em `SESSION_SECRET`, necessária para assinar o cookie da sessão.

O arquivo `.env` é ignorado pelo Git; **não publique credenciais no repositório**.

### 5. Iniciar o backend

Ainda em `backend/`, execute:

```bash
npm start
```

A API utiliza `http://localhost:3000` por padrão.

Você pode verificar:

- `GET http://localhost:3000/health` — disponibilidade do Express.
- `GET http://localhost:3000/healthBanco` — conexão com o PostgreSQL.

### 6. Abrir o frontend

Abra `frontend/index.html` com o **Live Server**, utilizando a origem `http://localhost:5500`.

Essa origem está configurada no CORS do backend. As requisições do frontend apontam para `http://localhost:3000`, conforme `frontend/js/api.js`. Se alterar as portas ou a origem, será necessário ajustar essas configurações.

Mantenha o PostgreSQL e o backend em execução durante o uso.

## Autenticação e autorização

Na v2.0, o login não depende de um estado de autenticação mantido apenas no navegador:

1. O usuário envia nome e senha para `POST /login`.
2. O backend compara a senha com o hash salvo no banco.
3. Após autenticar, o Express cria uma sessão com o identificador do usuário (`req.session.userId`).
4. O navegador recebe o cookie de sessão (`connect.sid`) e o envia nas requisições autenticadas.
5. As rotas protegidas verificam a sessão no servidor antes de executar operações.

O armazenamento das sessões usa `connect-pg-simple` com PostgreSQL. No frontend, as requisições autenticadas usam `credentials: "include"`.

**Permissões implementadas:**

- Criar um post exige uma sessão autenticada. O autor é obtido pelo backend a partir do usuário logado, e não de um nome enviado pelo cliente.
- Excluir um post exige autenticação **e** que o post pertença ao usuário da sessão.
- Excluir uma conta exige autenticação e correspondência entre o ID solicitado e o ID do usuário da sessão.
- Ao excluir a conta, o backend também remove seus posts e tenta destruir a sessão e limpar o cookie.

## Rotas da API

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| `GET` | `/` | Estado básico da API | Não |
| `GET` | `/health` | Verifica o servidor | Não |
| `GET` | `/healthBanco` | Verifica o banco de dados | Não |
| `POST` | `/cadastrar` | Cadastra um usuário | Não |
| `GET` | `/cadastrar` | Lista IDs e nomes de usuários (rota de estudo) | Não |
| `POST` | `/login` | Confere credenciais e cria a sessão | Não |
| `POST` | `/logout` | Encerra a sessão e limpa o cookie | Sessão existente para logout efetivo |
| `GET` | `/auth/me` | Retorna ID, nome e quantidade de posts do usuário autenticado | Sim |
| `GET` | `/usuario/:id` | Consulta o nome de um usuário por ID | Não |
| `DELETE` | `/usuario/:id` | Exclui a própria conta e seus posts | Sim; somente o titular |
| `GET` | `/post` | Lista as publicações | Não |
| `POST` | `/post` | Cria uma publicação | Sim |
| `DELETE` | `/post/:id` | Exclui uma publicação do próprio usuário | Sim; somente o autor |

### Exemplos de requisição

**Cadastro — `POST /cadastrar`**

```json
{
  "email": "exemplo@email.com",
  "name": "usuario1",
  "pass": "senhaDeExemplo123"
}
```

**Login — `POST /login`**

```json
{
  "name": "usuario1",
  "pass": "senhaDeExemplo123"
}
```

Com credenciais válidas, o backend responde com os dados básicos do usuário e estabelece a sessão via cookie.

**Publicação — `POST /post`** (requer autenticação)

```json
{
  "tags": "programação",
  "titulo": "Primeiro post",
  "conteudo": "Aprendendo a conectar o frontend ao backend!"
}
```

O backend valida o título (de **3 a 20 caracteres**) e o conteúdo (de **5 a 200 caracteres**), associa automaticamente a publicação ao usuário autenticado e retorna `201` quando ela é criada.

As rotas de exclusão retornam `204 No Content` em caso de sucesso. Erros de validação, autenticação, autorização ou recurso inexistente podem resultar, respectivamente, em `400`, `401`, `403` ou `404`.

## Evolução do projeto

### v1.0 — Fundamentos

Primeira etapa do Nodus: páginas, formulários, integração com API REST, cadastro, conferência de senha com `bcrypt`, criação e leitura de posts, pesquisa, filtros e persistência no PostgreSQL. O controle de login ainda não utilizava sessões autenticadas no servidor.

### v2.0 — Sessões e controle de autoria

- Autenticação baseada em sessões e cookies.
- Persistência das sessões no PostgreSQL.
- Verificação da conta autenticada por `GET /auth/me`.
- Associação de publicações ao usuário por `usuario_id`.
- Proteção de criação e exclusão de posts com autenticação e autorização.
- Exclusão da conta e de suas publicações com transação SQL.
- Encerramento da sessão no logout e após a exclusão da conta.
- Integração das funcionalidades de exclusão à interface.

## Limitações conhecidas

O Nodus é um **projeto de estudos**, não uma aplicação auditada ou preparada para receber usuários reais na internet. Pontos ainda não resolvidos ou não implementados:

- **Segurança para produção:** a configuração atual usa cookies com `secure: false`, CORS fixado em `http://localhost:5500` e não apresenta proteção dedicada contra CSRF. A implantação pública exige revisão de cookies, HTTPS, origens permitidas e proteção das operações autenticadas.
- **Exclusão de conta:** há confirmação no navegador, mas não é solicitada a senha novamente antes de excluir a conta.
- **Formulário de cadastro:** não há política de tamanho mínimo de senha no schema do backend; conflitos de unicidade do banco também não possuem tratamento HTTP específico.
- **Rotas de estudo:** `GET /cadastrar` disponibiliza IDs e nomes de usuários sem autenticação. Essa rota deve ser revista antes de qualquer publicação pública.
- **Filtros e pesquisa:** a busca por título e o filtro por categoria são funcionalidades locais da interface e podem não permanecer sincronizados com posts recém-criados sem recarregar a página.
- **Perfil:** algumas partes visuais são demonstrativas, como seguidores, descrição, edição do perfil e outros botões.
- **Modo claro, ordenação e recursos sociais:** existem elementos visuais sem implementação funcional completa.
- **Infraestrutura e qualidade:** não há migrations versionadas, testes automatizados configurados nem deploy público documentado.

**Não utilize senhas reais nem exponha esta configuração diretamente como um serviço de autenticação em produção.**

## O que aprendi

O Nodus foi uma oportunidade de praticar, em um único projeto:

- HTML semântico, CSS responsivo e manipulação do DOM com JavaScript.
- Formulários, eventos, modais e requisições assíncronas com `fetch`.
- Estruturação de APIs com Node.js e Express.
- Validação de dados com Zod e tratamento de respostas HTTP.
- Consultas SQL parametrizadas, relacionamentos e transações no PostgreSQL.
- Hash de senhas com `bcrypt`.
- Autenticação baseada em sessões, cookies e autorização no backend.
- Depuração, refatoração e integração entre frontend, API e banco de dados.

A **v2.0 encerra essa etapa de aprendizado**. O objetivo principal do Nodus foi evoluir meu conhecimento em desenvolvimento web full-stack, e não construir uma rede social completa.

---

**Desenvolvido por [CadevV](https://github.com/CadevV) como projeto individual de estudos.**  
**Código-fonte:** [CadevV/Forum-Nodus](https://github.com/CadevV/Forum-Nodus)
