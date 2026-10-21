async function health(){
    const resposta = await fetch(`http://localhost:3000/health`)

    const dados = await resposta.json()

    console.log(dados)
}

async function criarPostApi(usuario,tags, titulo, conteudo) {
    const post = {
        "user": usuario,
        "tags": tags,
        "titulo": titulo,
        "conteudo": conteudo
    }

    const resposta = await fetch("http://localhost:3000/post",{
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(post)
    })

    if(!resposta.ok){
        throw new Error("post invalido")
    }
    
    return await resposta.json()
}

async function recuperarPostApi() {
    const resposta = await fetch("http://localhost:3000/post")

    const dados = await resposta.json()

    return dados
}

async function cadastrarContaApi(emailUser, nameUser, passUser) {
    const user = {
        email: emailUser,
        name: nameUser,
        pass: passUser
    }
    const resposta = await fetch("http://localhost:3000/cadastrar", {
        method: "POST",

        headers: {
            "Content-Type":"application/json"
        },

        body:JSON.stringify(user)
    })

    if(!resposta.ok){
        throw new Error("Falha ao Cadastrar")
    }

    const dados = await resposta.json()

    return dados
}

async function loginContaApi(nameUser, passUser) {
    const user = {
        name: nameUser,
        pass: passUser
    }

    const resposta = await fetch("http://localhost:3000/login",{
        method: "POST",

        headers:{
            "Content-Type": "application/json"
        },

        body:JSON.stringify(user)
    })

    if(!resposta.ok) {
        throw new Error("Usuario não encontrado")
    }

    const dados = await resposta.json()

    delete dados.pass

    const userText = JSON.stringify(dados)

    localStorage.setItem('user', userText)

    return dados
}

health()