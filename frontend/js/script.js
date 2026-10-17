const btnOpenModal = document.querySelector('.headerNewPost')
const btnCloseModal = document.querySelector('.btnCloseModal')
const modalPost = document.querySelector('.overlayModalPost')
const formPost = document.querySelector('.formModalPost')
const inputTituloUsuario = document.querySelector('.inputModalPost')
const inputTextareaUsuario = document.querySelector('.textareaModalPost')
const containerPosts = document.querySelector('.containerPosts')

const usuario = 
{
    status: true
}

const postFront = []

function openModalPost(){
    if(usuario.status){
        modalPost.classList.add('active')
    }
}

function closeModalPost(){
    modalPost.classList.remove('active')
}

async function criarPost(){
    const assuntoSelecionado = document.querySelector('input[name=tag]:checked')

    if(!assuntoSelecionado) return

    const valorAssunto = assuntoSelecionado.value
    const valorTitulo = inputTituloUsuario.value
    const valorConteudo = inputTextareaUsuario.value

    if(!valorAssunto || !valorTitulo || !valorConteudo) return

    const newPost = 
    {
        "tags": valorAssunto,
        "titulo": valorTitulo,
        "conteudo": valorConteudo
    }

    const elementNewPost = document.createElement("article")
    elementNewPost.classList.add("boxPost")

    elementNewPost.innerHTML = 
    `
        <div class="postCima">
            <div class="userPublicPost">
                <div class="logoUserPost"></div>
                <h4>Epaminondas</h4>
            </div>

            <div class="postTags">
                <ul class="listTags">
                    <li class="tag"></li>
                </ul>
            </div>
        </div>

        <div class="infoPost">
            <h2 class="titlePost"></h2>
            <p class="contPost">
                
            </p>
        </div>
    `
    const tag = elementNewPost.querySelector('.tag')
    const titulo = elementNewPost.querySelector('.titlePost')
    const conteudo = elementNewPost.querySelector('.contPost')

    tag.textContent = valorAssunto
    titulo.textContent = valorTitulo.trim()
    conteudo.textContent = valorConteudo.trim()

    const resultado = await criarPostApi(newPost.tags, newPost.titulo, newPost.conteudo)

    containerPosts.appendChild(elementNewPost)

    console.log(resultado)
    closeModalPost()
}

async function recuperarPost() {
    const result = await recuperarPostApi()

    postFront.push(...result)

    for(let i = 0; i<result.length; i++){
        const elementNewPost = document.createElement("article")
        elementNewPost.classList.add("boxPost")

        elementNewPost.innerHTML = 
        `
            <div class="postCima">
                <div class="userPublicPost">
                    <div class="logoUserPost"></div>
                    <h4>Epaminondas</h4>
                </div>

                <div class="postTags">
                    <ul class="listTags">
                        <li class="tag">${postFront[i].tags}</li>
                    </ul>
                </div>
            </div>

            <div class="infoPost">
                <h2 class="titlePost">${postFront[i].titulo}</h2>
                <p class="contPost">
                    ${postFront[i].conteudo}
                </p>
            </div>
        `
        containerPosts.appendChild(elementNewPost)
    }
}

btnOpenModal.addEventListener('click', openModalPost)
btnCloseModal.addEventListener('click', closeModalPost)
formPost.addEventListener('submit', (event)=>{
    event.preventDefault()
    criarPost()
})

recuperarPost()