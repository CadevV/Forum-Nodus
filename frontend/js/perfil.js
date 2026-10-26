const user = localStorage.getItem("user");
const userValid = JSON.parse(user);
const perfilNome = document.querySelector(".nomePerfil");
const postsUser = document.querySelector(".postsUser");
const containerPosts = document.querySelector('.containerPosts');

let listaPost = [];

function verificarLogado() {
  const userVeri = localStorage.getItem("user");
  const userValidVeri = JSON.parse(userVeri);
  if (!userValidVeri || !userValidVeri.logado) {
    window.location.href = "./../frontend/index.html";
    return;
  }
}

async function montarPerfil() {
  const nomePerfil = userValid.name;

  document.title = `Nodus | ${nomePerfil}`;

  perfilNome.textContent = nomePerfil;

  const posts = await recuperarPostApi();
  listaPost.push(...posts);

  const postsUsuario = listaPost.filter(el => el.autor == nomePerfil);

  const quantidadePosts = postsUsuario.length;

  postsUser.textContent = quantidadePosts;

  for(let i = 0; i<quantidadePosts; i++){
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
    const usuarioPost = elementNewPost.querySelector(".usuarioPost");
    const tag = elementNewPost.querySelector(".tag");
    const titulo = elementNewPost.querySelector(".titlePost");
    const conteudo = elementNewPost.querySelector(".contPost");

    usuarioPost.textContent = nomePerfil;
    tag.textContent = postsUsuario[i].tags;
    titulo.textContent = postsUsuario[i].titulo;
    conteudo.textContent = postsUsuario[i].conteudo;

    containerPosts.appendChild(elementNewPost);
  }
}

verificarLogado();

if(userValid && userValid.logado){
    montarPerfil();
}