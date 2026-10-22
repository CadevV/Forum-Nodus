const user = localStorage.getItem('user')
const userValid = JSON.parse(user) 


function verificarLogado(){
    const userVeri = localStorage.getItem('user')
    const userValidVeri = JSON.parse(userVeri) 
    if(!userValidVeri || !userValidVeri.logado) {
        window.location.href = "./../frontend/index.html"
        return
    }
}

function montarPerfil(){
    const nomePerfil = userValid.name

    document.title = `Nodus | ${nomePerfil}`
}

verificarLogado()
montarPerfil()