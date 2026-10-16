async function health(){
    const resposta = await fetch(`http://localhost:3000/health`)

    const dados = await resposta.json()

    console.log(dados)
}

health()