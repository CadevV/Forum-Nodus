const inputSearch = document.querySelector(".inputSearchPost");
const searchMobile = document.querySelector(".searchPost")
const btnsOptionsHeader =  document.querySelectorAll('.btnOption')
const btnSearchPostMobile = document.querySelector(".headerSearchMobile")
const btnOpenModal = document.querySelector(".headerNewPost");
const btnOpenLogin = document.querySelector(".headerAcont");
const btnCloseModal = document.querySelectorAll(".btnCloseModal");
const modalPost = document.querySelector(".overlayModalPost");
const boxModalPost = document.querySelector(".modalPost");
const modalLogin = document.querySelector(".overlayModalLogin");
const boxModalLogin = document.querySelector(".modalLogin");
const formPost = document.querySelector(".formModalPost");
const inputTituloUsuario = document.querySelector(".inputModalPost");
const inputTextareaUsuario = document.querySelector(".textareaModalPost");
const containerPosts = document.querySelector(".containerPosts");
const optionCadastroModal = document.querySelectorAll('.optionCadastro')
const optionPerfilModal = document.querySelectorAll('.optionPerfil')
const btnDeslogar = document.getElementById('btnDeslogar')

const postFront = [];
const userUsuario = localStorage.getItem('user')
const userObject = JSON.parse(userUsuario)

function openSearchMobile(){
  btnsOptionsHeader.forEach(element => {
    element.classList.toggle('active')
  });
  searchMobile.classList.toggle('active')
}

function openModalPost(modal, boxModal) {
  modal.classList.add("active");
  boxModal.classList.add("active");
}

function closeModalPost(modal, boxModal) {
  modal.classList.remove("active");
  boxModal.classList.remove("active");
}

function logicaCadastroPerfil(){
  if(!userObject || !userObject.logado){
    optionCadastroModal.forEach(el => {
      el.classList.add('active')
    })

    optionPerfilModal.forEach(el => {
      el.classList.remove('active')
    });
    return
  } else if(userObject.logado){
    optionCadastroModal.forEach(el => {
      el.classList.remove('active')
    })

    optionPerfilModal.forEach(el => {
      el.classList.add('active')
    });
  }
}

function buscarPost() {
  const valorSearch = inputSearch.value;
  const postAtuais = document.querySelectorAll(".boxPost");

  postAtuais.forEach((post) => {
    const titulo = post.querySelector(".titlePost").textContent.toLowerCase();
    if (titulo.includes(valorSearch)) {
      post.classList.remove("off");
      return
    }
    post.classList.add("off");
  });
}

async function criarPost() {
  if(!userObject ||!userObject.logado){
    console.log("usuario não logado")
    window.location.href = './../frontend/login.html'
    return
  }

  const assuntoSelecionado = document.querySelector("input[name=tag]:checked");

  if (!assuntoSelecionado) return;

  const valorAssunto = assuntoSelecionado.value;
  const valorTitulo = inputTituloUsuario.value;
  const valorConteudo = inputTextareaUsuario.value;

  if (!valorAssunto || !valorTitulo || !valorConteudo) return;

  const newPost = {
    user: userObject.name,
    tags: valorAssunto,
    titulo: valorTitulo,
    conteudo: valorConteudo,
  };

  const elementNewPost = document.createElement("article");
  elementNewPost.classList.add("boxPost");

  elementNewPost.innerHTML = `
        <div class="postCima">
            <div class="userPublicPost">
                <div class="logoUserPost"></div>
                <h4 class="usuarioPost">Epaminondas</h4>
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
    `;
  const usuarioPost = elementNewPost.querySelector('.usuarioPost')
  const tag = elementNewPost.querySelector(".tag");
  const titulo = elementNewPost.querySelector(".titlePost");
  const conteudo = elementNewPost.querySelector(".contPost");

  usuarioPost.textContent = userObject.name
  tag.textContent = valorAssunto;
  titulo.textContent = valorTitulo.trim();
  conteudo.textContent = valorConteudo.trim();

  const resultado = await criarPostApi(
    newPost.user,
    newPost.tags,
    newPost.titulo,
    newPost.conteudo,
  );

  containerPosts.appendChild(elementNewPost);

  console.log(resultado);
  closeModalPost(modalPost, boxModalPost);
}

async function recuperarPost() {
  const result = await recuperarPostApi();

  postFront.push(...result);

  for (let i = 0; i < result.length; i++) {
    const elementNewPost = document.createElement("article");
    elementNewPost.classList.add("boxPost");

    elementNewPost.innerHTML = `
            <div class="postCima">
                <div class="userPublicPost">
                    <div class="logoUserPost"></div>
                    <h4 class="usuarioPost"></h4>
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
        `;
    const usuario = elementNewPost.querySelector('.usuarioPost')
    const tag = elementNewPost.querySelector(".tag");
    const titulo = elementNewPost.querySelector(".titlePost");
    const conteudo = elementNewPost.querySelector(".contPost");

    usuario.textContent = postFront[i].autor
    tag.textContent = postFront[i].tags
    titulo.textContent = postFront[i].titulo
    conteudo.textContent = postFront[i].conteudo

    containerPosts.appendChild(elementNewPost);
  }
}

function deslogarConta(){
    userObject.logado = false

    localStorage.removeItem("user")
}

btnSearchPostMobile.addEventListener('click', openSearchMobile)

btnOpenModal.addEventListener("click", () => {
  openModalPost(modalPost, boxModalPost);
});

btnCloseModal.forEach((element) => {
  element.addEventListener("click", () => {
    closeModalPost(modalPost, boxModalPost);
  });
});

btnCloseModal.forEach((element) => {
  element.addEventListener("click", () => {
    closeModalPost(modalLogin, boxModalLogin);
  });
});

btnOpenLogin.addEventListener("click", () => {
  logicaCadastroPerfil()
  openModalPost(modalLogin, boxModalLogin);
});

inputSearch.addEventListener("input", buscarPost);
formPost.addEventListener("submit", (event) => {
  event.preventDefault();
  criarPost();
});

btnDeslogar.addEventListener('click', ()=>{
  deslogarConta()
  closeModalPost(modalLogin, boxModalLogin)
})

recuperarPost();
