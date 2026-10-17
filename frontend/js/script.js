const inputSearch = document.querySelector(".inputSearchPost");
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

const usuario = {
  status: true,
};

const postFront = [];

function openModalPost(modal, boxModal) {
  modal.classList.add("active");
  boxModal.classList.add("active");
}

function closeModalPost(modal, boxModal) {
  modal.classList.remove("active");
  boxModal.classList.remove("active");
}

function buscarPost() {
  const valorSearch = inputSearch.value;
  const postAtuais = document.querySelectorAll(".boxPost");

  postAtuais.forEach((post) => {
    const titulo = post.querySelector(".titlePost").textContent.toLowerCase();
    if (titulo.includes(valorSearch)) {
      post.classList.remove("off");
      return;
    }
    post.classList.add("off");
  });
}

async function criarPost() {
  const assuntoSelecionado = document.querySelector("input[name=tag]:checked");

  if (!assuntoSelecionado) return;

  const valorAssunto = assuntoSelecionado.value;
  const valorTitulo = inputTituloUsuario.value;
  const valorConteudo = inputTextareaUsuario.value;

  if (!valorAssunto || !valorTitulo || !valorConteudo) return;

  const newPost = {
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
    `;
  const tag = elementNewPost.querySelector(".tag");
  const titulo = elementNewPost.querySelector(".titlePost");
  const conteudo = elementNewPost.querySelector(".contPost");

  tag.textContent = valorAssunto;
  titulo.textContent = valorTitulo.trim();
  conteudo.textContent = valorConteudo.trim();

  const resultado = await criarPostApi(
    newPost.tags,
    newPost.titulo,
    newPost.conteudo,
  );

  containerPosts.appendChild(elementNewPost);

  console.log(resultado);
  closeModalPost();
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
        `;
    containerPosts.appendChild(elementNewPost);
  }
}

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
  openModalPost(modalLogin, boxModalLogin);
});

inputSearch.addEventListener("input", buscarPost);
formPost.addEventListener("submit", (event) => {
  event.preventDefault();
  criarPost();
});

recuperarPost();
