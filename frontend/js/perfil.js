function verificarLogado(){
    const user = localStorage.getItem('user')
    const userValid = JSON.parse(user)

    if(!userValid || !userValid.logado) return

    window.location.href = "./../frontend/index.html"
}

verificarLogado()