let dadosUsuarioCep = {
  localidade: ``,
  bairro: ``,
  logradouro: ``,
  numero: ``
}

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
      const { localidade, bairro, logradouro } = data;

      dadosUsuarioCep.localidade = localidade;
      dadosUsuarioCep.bairro = bairro;
      dadosUsuarioCep.logradouro = logradouro;

      resumoCep.innerHTML = `
        <p class="cidade">${localidade}</p>
        <p class="bairro">${bairro}</p>
        <p class="rua">${logradouro} <span class="numero"><input class='input-style pequeno' placeholder="Nº" type="number" id="numero"></span></p> 
      `;

      document.querySelector('#numero').addEventListener('input', pegarNumeroCasa)
    })
    .catch((error) => {
      console.error(error);
      resumoCep.innerHTML = '<h3>CEP Inválido!</h3>'
    });
}

const pegarNumeroCasa = (event) => {
  dadosUsuarioCep.numero = event.target.value
}

const finalizarPedido = () => {
  alert(`
  Pedido Finalizado com Sucesso!
  =========================================
  Cidade: ${dadosUsuarioCep.localidade}
  bairro: ${dadosUsuarioCep.bairro}
  rua: ${dadosUsuarioCep.logradouro} n: ${dadosUsuarioCep.numero}
  =========================================

  Volte sempre :)
  `)
}


const carrinhoCompra = document.querySelector('.carrinho-compras')
carrinhoCompra.addEventListener('click', modalOn)

const botaoCep = document.querySelector('#botao-cep')
botaoCep.addEventListener('click', buscaCep)

const botaoFinalizarPedido = document.querySelector('#finalizar-pedido')
botaoFinalizarPedido.addEventListener('click', finalizarPedido)