const perfilNome = document.querySelector(".nomePerfil");
const postsUser = document.querySelector(".postsUser");
const containerPosts = document.querySelector(".containerPosts");
const btnDel = document.querySelectorAll('.btnDel')

let listaPost = [];

async function verificarLogado() {
  const usuario = await authApi();
  if (!usuario || !usuario.id) {
    window.location.href = "./../frontend/index.html";
    return;
  }
}

async function montarPerfil() {
  const usuario = await authApi();

  if (!usuario) return;

  const nomePerfil = usuario.name;

  document.title = `Nodus | ${nomePerfil}`;

  perfilNome.textContent = nomePerfil;

  const posts = await recuperarPostApi();
  listaPost.push(...posts);

  const postsUsuario = listaPost.filter((el) => el.autor == nomePerfil);

  const quantidadePosts = postsUsuario.length;

  postsUser.textContent = quantidadePosts;

  for (let i = 0; i < quantidadePosts; i++) {
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

                <div class="infoPostBaixo">
                    <p class="contPost">
                        
                    </p>
                    <div class="delBtn">
                        <button class="btnDel"> <i class="bi bi-x-lg"></i> Deletar</button>
                    </div>
                </div>
            </div>
        `;
    const usuarioPost = elementNewPost.querySelector(".usuarioPost");
    const tag = elementNewPost.querySelector(".tag");
    const titulo = elementNewPost.querySelector(".titlePost");
    const conteudo = elementNewPost.querySelector(".contPost");
    const btnExcluir = elementNewPost.querySelector('.delBtn')

    usuarioPost.textContent = nomePerfil;
    tag.textContent = postsUsuario[i].tags;
    titulo.textContent = postsUsuario[i].titulo;
    conteudo.textContent = postsUsuario[i].conteudo;
    btnExcluir.dataset.id = postsUsuario[i].id

    containerPosts.appendChild(elementNewPost);
  }
}

async function deletePost(event) {
    const botao = event.target.closest('.delBtn')

    if(!botao) return

    const id = botao.dataset.id

    const resposta = await deletePostApi(id)

    if(!resposta){
        return console.log("Não foi possivel Deletar")
    }

    const post = botao.closest('.boxPost')

    post.remove()
}

containerPosts.addEventListener("click", (event)=>{
    deletePost(event)
})

verificarLogado();

montarPerfil();

