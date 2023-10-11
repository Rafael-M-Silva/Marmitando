// abrindo e fechando menu
const abrindoMenu = (event) => {
  const botaoMenu = event.target
  const navbar = document.querySelector('.nav-bar')
  botaoMenu.classList.toggle('fa-x')
  navbar.classList.toggle('abrir-menu')

  window.addEventListener('scroll', ()=> {
    botaoMenu.classList.remove('fa-x')
    navbar.classList.remove('abrir-menu')
  })
}

// abrindo menu
const menu = document.querySelector('.menu')
menu.addEventListener('click', abrindoMenu)