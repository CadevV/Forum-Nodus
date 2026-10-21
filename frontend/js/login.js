const btnSelectLogin = document.querySelector('.btnSelectLogin')
const btnSelectCadastro = document.querySelector('.btnSelectCadastro')
const formLogin = document.querySelector('.formLogin')
const formCadastro = document.querySelector('.formCadastro')
const inputEmailCadastro = document.getElementById('emailCadastro')
const inputNameCadastro = document.getElementById('nameCadastro')
const inputpassCadastro = document.getElementById('passCadastro')
const inputpassConfirmCadastro = document.getElementById('passCadastroConfirm')
const inputNameLogin = document.getElementById('inputLoginNome')
const inputPassLogin = document.getElementById('inputLoginSenha')

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

async function loginConta(){
    const valorName = inputNameLogin.value
    const valorPass = inputPassLogin.value

    if(valorName == "" || valorPass == "") {
        console.log("erro")
        return
    }

    const login = await loginContaApi(valorName, valorPass)

    window.location.href = 'http://127.0.0.1:5500/frontend/index.html'
}

async function cadastrarConta(){
    const valorEmail = inputEmailCadastro.value 
    const valorName = inputNameCadastro.value
    const valorPass = inputpassCadastro.value
    const valorPassConfirm = inputpassConfirmCadastro.value

    if(valorEmail == "" || valorName == "" || valorPass == "" || valorPassConfirm == "") return
    if(valorPass !== valorPassConfirm) return

    const cadastro = await cadastrarContaApi(valorEmail, valorName, valorPass)

    window.location.href = 'http://127.0.0.1:5500/frontend/index.html'
}

btnSelectLogin.addEventListener('click', trocarMenuLogin)
btnSelectCadastro.addEventListener('click', trocarMenuLogin)
formCadastro.addEventListener('submit', (event)=>{
    event.preventDefault()
    cadastrarConta()
})

formLogin.addEventListener('submit', (event)=>{
    event.preventDefault()
    loginConta()
})