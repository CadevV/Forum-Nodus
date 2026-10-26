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
const feedbackLogin = document.querySelector('.feedbackLogin')
const feedbackCadastro = document.querySelector('.feedbackCadastro')

function verificarLogado(){
    const user = localStorage.getItem('user')
    const userValid = JSON.parse(user)

    if(!userValid || !userValid.logado) return

    window.location.href = "./../frontend/index.html"
}

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
    const h5Feedback = feedbackLogin.querySelector('h5')

    if(valorName == "" || valorPass == "") {
        console.log("erro Preencha os Campos")
        feedbackLogin.classList.add('branco')
        h5Feedback.textContent = "Preencha os campos"

        setTimeout(() => {
            feedbackLogin.classList.remove('branco')
        },3000)

        return
    }

    const login = await loginContaApi(valorName, valorPass)

    if(!login){
        console.log("erro na autenticação")
        feedbackLogin.classList.add('erro')
        h5Feedback.textContent = "Senha ou Nome do usuario incorretos"

        setTimeout(() => {
            feedbackLogin.classList.remove('erro')
        },3000)

        return        
    }

    window.location.href = './../frontend/index.html'
}

async function cadastrarConta(){
    const valorEmail = inputEmailCadastro.value 
    const valorName = inputNameCadastro.value
    const valorPass = inputpassCadastro.value
    const valorPassConfirm = inputpassConfirmCadastro.value
    const h5Feedback = feedbackCadastro.querySelector('h5')

    if(valorEmail == "" || valorName == "" || valorPass == "" || valorPassConfirm == ""){
        console.log("erro Preencha os Campos")
        feedbackCadastro.classList.add('branco')
        h5Feedback.textContent = "Preencha os campos"

        setTimeout(() => {
            feedbackCadastro.classList.remove('branco')
        },3000)

        return
    }
    if(valorPass !== valorPassConfirm) {
        console.log("Senhas diferentes")
        feedbackCadastro.classList.add('erro')
        h5Feedback.textContent = "As senhas não correspondem"

        setTimeout(() => {
            feedbackCadastro.classList.remove('erro')
        },3000)

        return   
    }

    const cadastro = await cadastrarContaApi(valorEmail, valorName, valorPass)

    if(!cadastro){
        console.log("erro na autenticação")
        feedbackCadastro.classList.add('erro')
        h5Feedback.textContent = "Algum Campo Invalido ou Usuario já Cadastrado"

        setTimeout(() => {
            feedbackCadastro.classList.remove('erro')
        },3000)

        return        
    }

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
formCadastro.addEventListener('submit', (event)=>{
    event.preventDefault()
    cadastrarConta()
})

formLogin.addEventListener('submit', (event)=>{
    event.preventDefault()
    loginConta()
})

verificarLogado()