const modalOn = () => {
  const modal = document.querySelector('.modal-off')
  const navbar = document.querySelector('.nav-bar')
  const body = document.querySelector('body')

  navbar.classList.toggle('display-none')
  modal.classList.toggle('modal-on')
  body.classList.toggle('overflow-hidden')
}

const carrinhoCompra = document.querySelector('.carrinho-compras')
carrinhoCompra.addEventListener('click', modalOn)
