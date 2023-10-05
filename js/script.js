const modalOn = () => {
  const modal = document.querySelector('.modal-off')
  const navbar = document.querySelector('.nav-bar')
  const body = document.querySelector('body')

  navbar.classList.toggle('display-none')
  modal.classList.toggle('modal-on')
  body.classList.toggle('overflow-hidden')
}

const buscaCep = () => {
  const cepInput = document.querySelector('#cep').value;
  const resumoCep = document.querySelector('#conteudo');

  const cep = `${cepInput}`;
  const API = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(API)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      /* criar um objeto global e depois passar aqui para pegar os dados do cliente
       */


      /* falta pegar o numero da casa */
      resumoCep.innerHTML = `
        <p class="cidade">${data.localidade}</p>
        <p class="bairro">${data.bairro}</p>
        <p class="rua">${data.logradouro} <span class="numero"><input class='input-style pequeno' placeholder="Nº" type="number" id="numero"></span></p> 
      `;
    })
    .catch((error) => {
      console.error(error);
      resumoCep.innerHTML = '<h3>CEP Inválido!</h3>'
    });
}


const carrinhoCompra = document.querySelector('.carrinho-compras')
carrinhoCompra.addEventListener('click', modalOn)

const botaoCep = document.querySelector('#botao-cep')
botaoCep.addEventListener('click', buscaCep)