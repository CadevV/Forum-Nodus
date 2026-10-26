Nodus
Fórum de discussões desenvolvido para praticar desenvolvimento full-stack com JavaScript, Node.js, Express e PostgreSQL.

O Nodus é um projeto pessoal de estudos que reúne uma interface em HTML, CSS e JavaScript puro a uma API REST. O objetivo é praticar a construção de funcionalidades reais, desde a interação com o usuário no navegador até a validação e persistência dos dados no banco.
Status: V2 de estudos — integração com PostgreSQL implementada para publicações e usuários. O projeto continua em desenvolvimento e não está pronto para uso em produção.

Funcionalidades implementadas
- Cadastro de usuários: recebe nome, e-mail e senha; valida os dados e salva a conta no PostgreSQL.
- Hash de senhas: usa bcrypt para armazenar o hash, e não a senha original.
- Login: consulta o usuário no banco e verifica a senha com bcrypt.compare().
- Criação de posts: valida título, conteúdo e categoria antes de salvar no PostgreSQL.
- Feed de publicações: busca posts persistidos e os exibe na página inicial.
- Pesquisa por título: filtra os posts exibidos no navegador.
- Perfil: apresenta o nome do usuário, a quantidade de posts e suas publicações.
- Logout local: remove os dados do usuário armazenados no navegador.
- Verificações de saúde: rotas independentes para a API e a conexão com o banco.
Importante: o login atual verifica as credenciais, mas não cria uma sessão autenticada no servidor. A indicação logado armazenada no navegador serve apenas para controlar a interface nesta versão.

Tecnologias utilizadas
Camada	Tecnologias
Frontend	HTML5, CSS3, JavaScript (Vanilla JS), Bootstrap Icons
Backend	Node.js, Express
Banco de dados	PostgreSQL
Integração com o banco	pg (Pool de conexões)
Validação	Zod
Senhas	bcrypt
Configuração	dotenv e variáveis de ambiente
Comunicação	Fetch API, JSON e CORS


Estrutura do projeto
Forum-Nodus/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── db.js        # Pool de conexões PostgreSQL
│   │   └── index.js        # Rotas e inicialização da API
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js          # Requisições para a API
│   │   ├── login.js        # Cadastro e login na interface
│   │   ├── perfil.js       # Informações do perfil
│   │   └── script.js       # Feed, pesquisa e interações
│   ├── index.html
│   ├── login.html
│   └── perfil.html
├── .gitignore
└── readme.md
Requisitos
- Node.js 20.6 ou superior e npm.
- PostgreSQL instalado e em execução.
- Uma ferramenta para administrar o banco (opcional), como o pgAdmin 4.
- Um navegador moderno.
- Um servidor local para o frontend, como o Live Server do VS Code.
Como executar localmente
1. Clonar o repositório
git clone https://github.com/CadevV/Forum-Nodus.git
cd Forum-Nodus
2. Instalar as dependências
cd backend
npm install
3. Configurar o PostgreSQL
Crie um banco de dados PostgreSQL para o projeto (por exemplo, dbNodus). O banco usado no arquivo .env deve existir antes de iniciar a API.

O código atual usa as tabelas tbUser e tbPost (identificadores sem aspas são normalizados para minúsculas no PostgreSQL). Ainda não existe um sistema de migrations no repositório.

Exemplo de estrutura mínima compatível para uma instalação nova:
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
Este SQL é uma referência de instalação, não uma migration já presente no projeto. Se você já tem as tabelas e dados, não as recrie. O comando IF NOT EXISTS não atualiza estruturas antigas automaticamente.

4. Criar o arquivo .env
Dentro da pasta backend/, crie um arquivo chamado .env:
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=dbNodus
PGUSER=postgres
PGPASSWORD=COLOQUE_SUA_SENHA_AQUI
Ajuste os valores conforme sua instalação. Não publique o .env nem senhas reais no GitHub. O arquivo já está incluído no .gitignore.
5. Iniciar o backend
Ainda dentro de backend/:
npm start
A API estará disponível, por padrão, em http://localhost:3000.

Para verificar o funcionamento:
- GET http://localhost:3000/health — verifica se o servidor Express responde.
- GET http://localhost:3000/healthBanco — executa SELECT 1 para verificar o acesso ao PostgreSQL.
6. Iniciar o frontend
Abra frontend/index.html usando um servidor local, como o Live Server. Mantenha o backend e o PostgreSQL em execução.
As chamadas fetch do frontend apontam para http://localhost:3000. Se mudar a porta da API, atualize esses endereços em frontend/js/api.js.

Rotas da API
Método	Rota	Comportamento atual
GET	/	Informa que o backend está em execução.
GET	/health	Retorna o estado do servidor Express.
GET	/healthBanco	Testa a conexão com PostgreSQL usando SELECT 1.
GET	/post	Retorna um array de publicações armazenadas no banco.
POST	/post	Valida e cria um post; retorna 201 em caso de sucesso.
POST	/cadastrar	Valida e cadastra um usuário com senha protegida por hash.
GET	/cadastrar	Atualmente devolve somente o primeiro usuário encontrado; rota de estudo a revisar.
POST	/login	Verifica nome de usuário e senha; retorna 401 se as credenciais forem inválidas.


Exemplo: criar uma publicação
POST /post
{
  "user": "CadevV",
  "tags": "programacao",
  "titulo": "Meu primeiro post",
  "conteudo": "Aprendendo a integrar Express e PostgreSQL!"
}
O Zod exige que o título tenha entre 3 e 20 caracteres e o conteúdo entre 5 e 200 caracteres. No código atual, o sucesso retorna o JSON de texto "Post Criado" com HTTP 201.
Exemplo: cadastrar usuário
POST /cadastrar
{
  "email": "exemplo@email.com",
  "name": "usuario1",
  "pass": "senhaDeExemplo123"
}
A senha é transformada em hash com bcrypt antes do INSERT. A resposta atual retorna os campos públicos do registro, como id, emailuser e nameuser, sem o hash.
Exemplo: login
POST /login
{
  "name": "usuario1",
  "pass": "senhaDeExemplo123"
}
Quando as credenciais são válidas, a API responde com um objeto semelhante a:
{
  "id": 1,
  "name": "usuario1",
  "logado": true
}
Se o usuário não existir ou a senha estiver incorreta, a API retorna HTTP 401 e uma mensagem genérica de credenciais inválidas. Esse retorno não é um token de autenticação.
Como os dados são armazenados
- Usuários: persistidos no PostgreSQL; as senhas são guardadas como hashes bcrypt.
- Posts: persistidos no PostgreSQL; permanecem após reiniciar o servidor.
- Autoria: nesta versão, o post armazena o nome do autor em texto. Ainda não há chave estrangeira vinculando posts aos IDs dos usuários.
- Estado visual de login: armazenado temporariamente no localStorage do navegador.
Limitações conhecidas e melhorias futuras
Esta versão demonstra integração frontend–API–banco, mas ainda tem limitações:
- Autenticação e autorização: não há sessões ou cookies autenticados no servidor. O frontend usa localStorage para o estado visual, e a API ainda não protege a criação de posts contra requisições não autenticadas ou falsificação do autor.
- Cadastro e frontend: a resposta do cadastro usa nameuser, enquanto partes do frontend esperam name e logado. O fluxo após o cadastro ainda precisa ser ajustado.
- Validação de senhas: os schemas Zod atuais ainda aceitam números em alguns campos de senha; o bcrypt espera strings.
- Conflitos de cadastro: o backend ainda não trata a violação de UNIQUE com uma resposta específica 409 Conflict.
- Listagem de usuários: GET /cadastrar retorna apenas o primeiro resultado e não possui controle de acesso; deve ser revisada ou removida.
- Pesquisa: a busca por título ainda pode diferenciar maiúsculas e minúsculas.
- Limpeza de código: existem referências antigas de usuários em memória e imports que podem ser removidos.
- Modelagem: usuários e posts ainda não possuem relacionamento por chave estrangeira.
- Estrutura do banco: ainda não há migrations versionadas nem testes automatizados configurados.
- Interface: recursos como seguir usuários, filtros avançados e edição de perfil ainda não estão implementados por completo.
Não utilize senhas reais nem disponibilize esta versão publicamente como serviço de autenticação seguro. A proteção das rotas e a gestão de sessões devem ser implementadas antes de qualquer publicação para usuários reais.
Objetivo do projeto
O Nodus foi criado para consolidar conhecimentos de:
- HTML, CSS e JavaScript;
- manipulação do DOM e eventos;
- consumo de APIs com fetch;
- desenvolvimento de API com Express;
- validação com Zod;
- consultas SQL parametrizadas e Pool de conexões;
- persistência de dados no PostgreSQL;
- fundamentos de proteção de senhas com bcrypt.
O foco é a evolução prática do projeto e do aprendizado, com funcionalidades adicionadas gradualmente.
Desenvolvido por CadevV, como projeto individual de estudos.

Repositório: https://github.com/CadevV/Forum-Nodus