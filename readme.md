# Nodus

**Meu primeiro projeto full-stack: um fórum de discussões desenvolvido com JavaScript, Node.js, Express e PostgreSQL.**

> **Status:** V1 — etapa de estudos concluída.  
> **Finalidade:** aprendizado e portfólio. **Não recomendado para uso em produção.**

O **Nodus** é um fórum criado como projeto individual de estudos para praticar o desenvolvimento de uma aplicação web de ponta a ponta: interface, consumo de API REST, validação de dados e persistência em banco de dados relacional.

A aplicação permite cadastrar usuários, verificar credenciais de login, publicar conteúdos, explorar o feed, pesquisar por título e visualizar publicações no perfil. O objetivo desta primeira versão foi consolidar os fundamentos do desenvolvimento full-stack — não reproduzir todas as funcionalidades de uma rede social.

## Funcionalidades

- **Cadastro de usuários:** recebe nome de usuário, e-mail e senha e salva os dados no PostgreSQL.
- **Verificação de login:** consulta o usuário no banco e confere a senha informada.
- **Proteção de senhas:** armazena hashes gerados com `bcrypt`, em vez de senhas em texto puro.
- **Publicações:** cria e lista posts com autor, categoria, título e conteúdo.
- **Persistência:** usuários e publicações permanecem salvos após reiniciar o backend.
- **Pesquisa:** filtra publicações pelo título, ignorando diferenças entre maiúsculas e minúsculas.
- **Categorias:** permite filtrar visualmente publicações carregadas por assunto (Geral, Programação, Jogos e Tecnologia).
- **Perfil:** exibe o nome, a quantidade de posts e as publicações associadas ao nome do usuário.
- **Logout local:** limpa os dados de login armazenados no navegador.
- **Monitoramento básico:** disponibiliza endpoints para verificar a API e a conexão com o banco.

> **Observação:** o login desta versão **não estabelece uma sessão autenticada no servidor**. O campo `logado` armazenado no navegador controla apenas a interface. Consulte [Limitações conhecidas](#limitações-conhecidas).

## Tecnologias utilizadas

| Camada | Tecnologias |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript (Vanilla JS), Bootstrap Icons |
| Backend | Node.js, Express |
| Banco de dados | PostgreSQL |
| Conexão com o banco | `pg` (`Pool`) |
| Validação | Zod |
| Hash de senhas | bcrypt |
| Configuração e comunicação | dotenv, CORS, Fetch API e JSON |

## Estrutura do projeto

```text
Forum-Nodus/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── db.js         # Configuração do Pool PostgreSQL
│   │   └── index.js         # API, validações e rotas
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js           # Requisições HTTP
│   │   ├── login.js         # Interface de cadastro e login
│   │   ├── perfil.js        # Informações e posts do perfil
│   │   └── script.js        # Feed, pesquisa e filtros
│   ├── index.html
│   ├── login.html
│   └── perfil.html
├── .gitignore
└── readme.md
```

## Como executar localmente

### Pré-requisitos

- Node.js **20.6 ou superior** e npm.
- PostgreSQL instalado e em execução.
- Um navegador atualizado.
- Um servidor local para o frontend (por exemplo, a extensão **Live Server** do VS Code).
- Opcionalmente, pgAdmin ou outra ferramenta para executar comandos SQL.

### 1. Clonar o repositório

```bash
git clone https://github.com/CadevV/Forum-Nodus.git
cd Forum-Nodus
```

### 2. Instalar as dependências

```bash
cd backend
npm install
```

### 3. Preparar o PostgreSQL

Crie um banco chamado `dbNodus`, ou escolha outro nome e ajuste `PGDATABASE` no arquivo `.env`. Se estiver usando um editor SQL conectado a outro banco, você pode criar o banco com:

```sql
CREATE DATABASE "dbNodus";
```

**Em seguida, conecte-se ao banco criado** antes de executar os comandos abaixo. O código espera as tabelas `tbUser` e `tbPost` (identificadores não delimitados são convertidos para minúsculas pelo PostgreSQL).

Exemplo de estrutura mínima compatível com o backend atual:

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
    conteudo VARCHAR(200) NOT NULL
);
```

> **Atenção:** esse SQL é um exemplo para uma **instalação nova**, não uma migration versionada. Se já houver tabelas e dados no banco, não recrie nem substitua a estrutura sem verificar seu esquema existente. `IF NOT EXISTS` não modifica tabelas antigas.

### 4. Configurar as variáveis de ambiente

Na pasta `backend/`, crie um arquivo `.env`:

```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=dbNodus
PGUSER=postgres
PGPASSWORD=SUA_SENHA_LOCAL
```

Ajuste usuário, senha, host e porta conforme sua instalação. O `.env` está incluído no `.gitignore` e **não deve ser publicado no GitHub**.

### 5. Iniciar a API

Dentro de `backend/`, execute:

```bash
npm start
```

Por padrão, o servidor ficará disponível em `http://localhost:3000`.

Para conferir a configuração:

- `GET http://localhost:3000/health` — verifica se o Express está respondendo.
- `GET http://localhost:3000/healthBanco` — executa `SELECT 1` para testar a conexão com o PostgreSQL.

### 6. Abrir o frontend

Abra `frontend/index.html` com o Live Server (ou outro servidor HTTP local). Mantenha a API e o PostgreSQL em execução durante o uso.

As requisições do frontend apontam para `http://localhost:3000`. Caso altere a porta da API, atualize os endereços em `frontend/js/api.js`.

## Rotas da API

| Método | Endpoint | Comportamento atual |
| --- | --- | --- |
| `GET` | `/` | Informa que a API está em execução. |
| `GET` | `/health` | Verifica a resposta do servidor Express. |
| `GET` | `/healthBanco` | Testa o acesso ao PostgreSQL. |
| `GET` | `/post` | Retorna um array de posts armazenados no banco. |
| `POST` | `/post` | Valida e insere uma publicação; retorna HTTP `201` em caso de sucesso. |
| `POST` | `/cadastrar` | Valida os dados, gera o hash da senha e cria um usuário. |
| `POST` | `/login` | Verifica nome e senha; retorna HTTP `401` para credenciais incorretas. |
| `GET` | `/cadastrar` | Rota de estudo que retorna **somente o primeiro** usuário encontrado (`id` e `nameuser`); precisa de revisão. |

### Exemplo: cadastrar usuário

`POST /cadastrar`

```json
{
  "email": "exemplo@email.com",
  "name": "usuario1",
  "pass": "senhaDeExemplo123"
}
```

A API armazena o **hash** da senha, não a senha original. A resposta de sucesso retorna os campos `id`, `emailuser` e `nameuser`, sem expor o hash.

### Exemplo: login

`POST /login`

```json
{
  "name": "usuario1",
  "pass": "senhaDeExemplo123"
}
```

Exemplo de resposta para credenciais válidas:

```json
{
  "id": 1,
  "name": "usuario1",
  "logado": true
}
```

**Importante:** esse objeto não é um token nem comprova autenticação em chamadas futuras ao backend.

### Exemplo: criar uma publicação

`POST /post`

```json
{
  "user": "usuario1",
  "tags": "programação",
  "titulo": "Meu primeiro post",
  "conteudo": "Aprendendo a integrar Express com PostgreSQL!"
}
```

O Zod exige, entre outras regras, **título de 3 a 20 caracteres** e **conteúdo de 5 a 200 caracteres**. Em caso de sucesso, a API responde com HTTP `201` e o texto JSON `"Post Criado"`.

## Como os dados são organizados

- **Usuários:** a tabela `tbUser` armazena e-mail, nome e hash da senha.
- **Posts:** a tabela `tbPost` armazena categoria, autor, título e conteúdo.
- **Autoria:** nesta versão, o campo `autor` é um texto com o nome informado na publicação; ainda não existe uma chave estrangeira relacionando posts a usuários.
- **Estado visual de login:** a interface utiliza `localStorage`, mas o backend não mantém sessões autenticadas.

## Limitações conhecidas

O Nodus é um projeto de estudos, **não uma aplicação pronta para produção**. As principais limitações desta V1 são:

- **Autenticação e autorização:** não há sessões/cookies autenticados nem proteção real de `POST /post`. Uma requisição direta pode informar outro nome como autor.
- **Fluxo de cadastro:** a interface alterna para a aba de login após cadastrar, mas `frontend/js/api.js` ainda grava os dados do cadastro no `localStorage` antes da autenticação.
- **Validação de senha:** o backend verifica o tipo `string`, mas ainda não impõe um tamanho mínimo de senha.
- **Tratamento de duplicidade:** conflitos de cadastro com restrições `UNIQUE` ainda não têm uma resposta específica `409`; podem retornar erro interno.
- **Listagem de usuários:** a rota `GET /cadastrar` não tem controle de acesso e retorna apenas o primeiro registro.
- **Filtros do feed:** a filtragem de categorias é básica; posts criados durante a sessão podem não entrar no filtro, e pesquisa e categoria não funcionam de maneira totalmente integrada.
- **Interface:** algumas opções visuais, como Seguindo, Em Alta, edição de perfil e tags relacionadas, ainda não têm funcionalidade completa.
- **Banco e qualidade:** não existem migrations versionadas, relacionamento por chave estrangeira entre posts e usuários nem testes automatizados configurados.

**Não utilize senhas reais nem exponha esta versão como um serviço de autenticação para usuários reais.** Antes de uma publicação pública interativa, seria necessário implementar autenticação segura, autorização, revisar os fluxos e testar a aplicação.

## O que aprendi com o projeto

O Nodus serviu para colocar em prática:

- Estruturação de interfaces com HTML e CSS e manipulação do DOM com JavaScript.
- Eventos de interface, formulários e chamadas assíncronas com `fetch`.
- Desenvolvimento de API REST usando Node.js e Express.
- Validação de requisições com Zod e tratamento de erros.
- Consultas SQL parametrizadas e conexão com PostgreSQL usando `pg`.
- Persistência de dados e fundamentos de hash de senhas com bcrypt.
- Investigação de bugs e integração entre frontend, backend e banco de dados.

Esta **V1 encerra a primeira etapa de aprendizado**. Melhorias futuras são possíveis, mas não fazem parte do escopo necessário para registrar o Nodus como meu primeiro projeto full-stack.

---

**Desenvolvido por [CadevV](https://github.com/CadevV) como projeto individual de estudos.**  
**Repositório:** [Forum-Nodus](https://github.com/CadevV/Forum-Nodus)
