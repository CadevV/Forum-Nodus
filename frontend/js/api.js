const URLBASE = "http://localhost:3000";

async function health() {
  const resposta = await fetch(`${URLBASE}/health`);

  const dados = await resposta.json();

  console.log(dados);
}

async function healthBanco() {
  const resposta = await fetch(`${URLBASE}/healthBanco`);

  const dados = await resposta.json();

  console.log(dados);
}

async function criarPostApi(usuario, tags, titulo, conteudo) {
  const post = {
    user: usuario,
    tags: tags,
    titulo: titulo,
    conteudo: conteudo,
  };

  const resposta = await fetch(`${URLBASE}/post`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(post),
  });

  if (!resposta.ok) {
    throw new Error("post invalido");
  }

  return resposta.json();
}

async function recuperarPostApi() {
  const resposta = await fetch(`${URLBASE}/post`);

  const dados = await resposta.json();

  return dados;
}

async function cadastrarContaApi(emailUser, nameUser, passUser) {
  const user = {
    email: emailUser,
    name: nameUser,
    pass: passUser,
  };
  const resposta = await fetch(`${URLBASE}/cadastrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(user),
  });

  if (!resposta.ok) {
    console.log("Falha no Cadastro");
    return false;
  }

  const dados = await resposta.json();

  delete dados.pass;

  return dados;
}

async function loginContaApi(nameUser, passUser) {
  const user = {
    name: nameUser,
    pass: passUser,
  };

  const resposta = await fetch(`${URLBASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(user),
  });

  if (!resposta.ok) {
    console.log("erro no Login");
    return false;
  }

  const dados = await resposta.json();

  delete dados.pass;

  return dados;
}

async function logoutApi() {
  try {
    const resposta = await fetch(`${URLBASE}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resposta.ok) {
      throw new Error("Falha na Requisição");
    }

    return true;
  } catch (erro) {
    console.log(erro);
    return console.log("Erro no Logout");
  }
}

async function authApi() {
  try {
    const resposta = await fetch(`${URLBASE}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (resposta.status === 401) {
      return null;
    }

    if (!resposta.ok) {
      throw new Error("Erro ao verificar autenticação");
    }

    const dados = await resposta.json();

    return dados;
  } catch (erro) {
    return console.log("Erro na auth" + erro);
  }
}

async function deletePostApi(id) {
    try{
        const resposta = await fetch(`${URLBASE}/post/${id}`,{
            method: "DELETE",
            credentials: "include"
        })

        if(!resposta){
            throw new Error("Erro ao tentar Excluir Publicação")
        }

        return true
    } catch (erro) {
        return console.log(erro)
    }
}

async function deleteContaApi(id) {
    try{
        const resposta = await fetch(`${URLBASE}/usuario/${id}`,{
            method: "DELETE",
            credentials: "include"
        })

        if(!resposta){
            throw new Error("Erro ao tentar Excluir Usuario")
        }

        return true
    } catch (erro) {
        return console.log(erro)
    }
}
health();
healthBanco();
