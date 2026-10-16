const btnOpenModal = document.querySelector('.headerNewPost')
const btnCloseModal = document.querySelector('.btnCloseModal')
const modalPost = document.querySelector('.overlayModalPost')

const usuario = 
{
    status: true
}

function openModalPost(){
    if(usuario.status){
        modalPost.classList.add('active')
    }
}

function closeModalPost(){
    modalPost.classList.remove('active')
}

btnOpenModal.addEventListener('click', openModalPost)
btnCloseModal.addEventListener('click', closeModalPost)
