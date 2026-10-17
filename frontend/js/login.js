const btnSelectLogin = document.querySelector('.btnSelectLogin')
const btnSelectCadastro = document.querySelector('.btnSelectCadastro')
const formLogin = document.querySelector('.formLogin')
const formCadastro = document.querySelector('.formCadastro')

function trocarMenuLogin(){
    if(!btnSelectLogin.classList.contains('active')){
        btnSelectLogin.classList.add('active')
        btnSelectCadastro.classList.remove('active')
    }else{
        btnSelectCadastro.classList.add('active')
        btnSelectLogin.classList.remove('active')
    }

    if(btnSelectLogin.classList.contains('active')){
        formLogin.classList.add('active')
        formCadastro.classList.remove('active')
    }else{
        formLogin.classList.remove('active')
        formCadastro.classList.add('active')
    }
}

btnSelectLogin.addEventListener('click', trocarMenuLogin)
btnSelectCadastro.addEventListener('click', trocarMenuLogin)