# Nodus

**Um fórum de discussões desenvolvido para praticar desenvolvimento full-stack.**

O Nodus é um projeto de estudo individual criado para explorar o desenvolvimento de uma aplicação web completa, conectando uma interface construída com tecnologias nativas a uma API desenvolvida com Node.js e Express.

A proposta é reunir discussões sobre programação, tecnologia, jogos e outros assuntos em um ambiente com publicações, categorias e perfis de usuários.

> **Status:** V1 — versão de estudo com funcionalidades básicas implementadas e limitações conhecidas.

## Funcionalidades

- **Cadastro de usuários:** criação de contas com e-mail, nome de usuário e senha.
- **Login:** acesso utilizando nome de usuário e senha.
- **Criação de publicações:** envio de título, conteúdo e categoria.
- **Feed de publicações:** carregamento dos posts disponibilizados pela API.
- **Pesquisa:** busca de publicações pelo título.
- **Perfil de usuário:** visualização do nome, quantidade de publicações e posts do usuário.
- **Logout:** remoção dos dados de login armazenados no navegador.

## Tecnologias utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript puro (Vanilla JavaScript)
- Bootstrap Icons

### Backend
- Node.js
- Express
- Zod — validação dos dados recebidos pela API
- CORS — configuração de acesso entre frontend e backend
- dotenv — carregamento de variáveis de ambiente

O projeto também possui a dependência `pg`, destinada à integração com PostgreSQL, mas a versão atual ainda não utiliza o banco de dados nas operações da aplicação.

## Estrutura do projeto

```text
Forum-Nodus/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── login.js
│   │   ├── perfil.js
│   │   └── script.js
│   ├── index.html
│   ├── login.html
│   └── perfil.html
├── .gitignore
└── readme.md
```

## Requisitos

- Node.js 20.6 ou superior.
- npm, instalado junto com o Node.js.
- Navegador moderno.
- Um servidor local para executar o frontend, como a extensão Live Server do Visual Studio Code.

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/CadevV/Forum-Nodus.git
cd Forum-Nodus
```

### 2. Instalar as dependências do backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo chamado `.env` dentro da pasta `backend`, no mesmo nível do `package.json`.

Adicione a porta utilizada pelo servidor:

```env
PORT=3000
```

O arquivo `.env` contém configurações locais e não deve ser enviado ao GitHub.

### 4. Iniciar o backend

Ainda dentro da pasta `backend`, execute:

```bash
npm start
```

Por padrão, a API ficará disponível em:

`http://localhost:3000`

A rota `/health` pode ser utilizada para verificar se o servidor está respondendo.

### 5. Iniciar o frontend

Abra a pasta do projeto no Visual Studio Code.

Utilize a extensão **Live Server** para abrir o arquivo `frontend/index.html` em um servidor local. A partir da página inicial, é possível navegar para o login, cadastro e perfil.

O frontend realiza requisições para `http://localhost:3000`. Por isso, mantenha o backend em execução enquanto utiliza a aplicação.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Informa que o backend está em execução e apresenta a porta configurada. |
| `GET` | `/health` | Verifica se o servidor está respondendo. |
| `GET` | `/post` | Retorna as publicações disponíveis. |
| `POST` | `/post` | Valida e cria uma publicação. |
| `GET` | `/cadastrar` | Retorna a lista de usuários sem os campos de senha. |
| `POST` | `/cadastrar` | Valida e cadastra um usuário. |
| `POST` | `/login` | Verifica as credenciais informadas. |

### Exemplo de criação de publicação

A rota `POST /post` recebe um objeto JSON com os seguintes campos:

```json
{
  "user": "usuario",
  "tags": "programação",
  "titulo": "Meu primeiro post",
  "conteudo": "Compartilhando uma ideia com a comunidade."
}
```

O backend utiliza Zod para validar os dados. Atualmente, o título deve ter entre 3 e 20 caracteres, e o conteúdo deve ter entre 5 e 200 caracteres.

## Limitações conhecidas da V1

O Nodus ainda é um projeto em desenvolvimento. Algumas limitações da versão atual são:

- **Persistência temporária:** usuários e publicações são armazenados em arrays JavaScript na memória do servidor. Os dados são perdidos quando o backend é reiniciado.
- **Banco de dados:** o PostgreSQL ainda não está integrado às operações da aplicação.
- **Segurança das senhas:** as senhas ainda não são armazenadas com hash.
- **Autenticação:** o estado de login é mantido no `localStorage` do navegador. O backend ainda não possui autenticação segura para proteger as operações restritas.
- **Pesquisa:** a comparação atual pode falhar quando a pesquisa contém letras maiúsculas.
- **Interface:** algumas opções, como seguir usuários, filtros avançados, tags relacionadas e edição de perfil, ainda não possuem implementação completa.

O projeto não deve ser utilizado para armazenar dados reais ou credenciais importantes enquanto essas limitações de segurança não forem resolvidas.

## Objetivo do projeto

O principal objetivo do Nodus é consolidar conhecimentos de desenvolvimento web, incluindo manipulação do DOM, eventos, consumo de APIs com `fetch`, criação de rotas com Express, validação de dados e organização entre frontend e backend.

O projeto representa uma etapa prática de aprendizado e poderá receber novas funcionalidades conforme esses fundamentos forem consolidados.

---

Desenvolvido como projeto de estudo individual por **CadevV**.

Repositório: https://github.com/CadevV/Forum-Nodus
