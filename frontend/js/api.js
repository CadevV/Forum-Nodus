async function health(){
    const resposta = await fetch(`http://localhost:3000/health`)

    const dados = await resposta.json()

    console.log(dados)
}

async function criarPostApi(tags, titulo, conteudo) {
    const post = {
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

    const dados = await resposta.json()

    return dados
}

async function recuperarPostApi() {
    const resposta = await fetch("http://localhost:3000/post")

    const dados = await resposta.json()

    return dados
}

health()