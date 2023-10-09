// Objeto dados Usuario para encaminhar Wpp
let dadosUsuarioCep = {
  localidade: ``,
  bairro: ``,
  logradouro: ``,
  numero: ``,
};

// configuração quando o modal estiver ativo
const modalOn = () => {
  const modal = document.querySelector(".modal-off");
  const navbar = document.querySelector(".nav-bar");
  const body = document.querySelector("body");

  navbar.classList.toggle("display-none");
  modal.classList.toggle("modal-on");
  body.classList.toggle("overflow-hidden");
};

// Buscando o cep do usuario e imprimindo na tela
const buscaCep = () => {
  const cepInput = document.querySelector("#cep").value;
  const resumoCep = document.querySelector("#conteudo");

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

      document
        .querySelector("#numero")
        .addEventListener("input", pegarNumeroCasa);
    })
    .catch((error) => {
      console.error(error);
      resumoCep.innerHTML = "<h3>CEP Inválido!</h3>";
    });
};

// pegando o numero da casa do usuario e passando esse valor para o objeto dadosUsuarioCep
const pegarNumeroCasa = (event) => {
  dadosUsuarioCep.numero = event.target.value;
};

// Finalizando o pedido imprimindo um alert e falta encaminhar para o wpp
const finalizarPedido = () => {
  if (dadosUsuarioCep.numero == 0) {
    alert("Preencha o número da sua residencia!");
    return;
  }
  alert(`
  Pedido Finalizado com Sucesso!
  =========================================
  Cidade: ${dadosUsuarioCep.localidade}
  bairro: ${dadosUsuarioCep.bairro}
  rua: ${dadosUsuarioCep.logradouro} n: ${dadosUsuarioCep.numero}
  =========================================

  Volte sempre :)
  `);
};

// Atualizando o valor do subtotal e resumo
const atualizarValor = () => {
  let subTotal = 0;
  const precoProduto = document.querySelectorAll(
    ".card-produto .preco .preco-produto"
  );
  for (var i = 0; i < precoProduto.length; i++) {
    const preco = precoProduto[i].innerText.replace("R$", "").replace(",", ".");
    const quantidade = precoProduto[
      i
    ].parentElement.parentElement.querySelector(
      ".quantidade .form .quantidade-produto"
    ).value;

    subTotal += preco * quantidade;
  }

  document.querySelector(".subtotal span").innerHTML = `R$ ${subTotal
    .toFixed(2)
    .replace(".", ",")}`;
  document.querySelector(".valor-produtos span").innerHTML = `R$ ${subTotal
    .toFixed(2)
    .replace(".", ",")}`;

  if (subTotal == 0) {
    document.querySelector(".modal-off main .conteudo").innerHTML = `
    <div class="carrinho-vazio">
    <img class="carrinho" src="./assets/carrinho.svg" alt="Carrinho de compra">
      <h1>Carrinho Vazio!</h1>
      <a href="#kit-marmitas">
        <button id="continue-comprando" class="botao-comprar"> Continue Comprando </button>
      </a>
    </div>
    `;
    botaoContinueComprando = document.querySelector("#continue-comprando");
    botaoContinueComprando.addEventListener("click", modalOn);
    return;
  }
  const modalCarrinhoVazio = document.querySelector(".carrinho-vazio");
  if (modalCarrinhoVazio) {
    modalCarrinhoVazio.remove();
  }
};
atualizarValor();

// Removendo produto e atualizando o valor
const removerProduto = (event) => {
  event.target.parentElement.parentElement.remove();
  atualizarValor();
};

// Incrementado + 1 e atualizando o valor
const incrementarProduto = (event) => {
  let qtd = event.target.parentElement.querySelector(".quantidade-produto");
  qtd.value++;

  let valorProduto = event.target.parentElement.parentElement.parentElement
    .querySelector(".preco-produto")
    .innerText.replace("R$", "")
    .replace(",", ".");
  let total = qtd.value * valorProduto;

  qtd.parentElement.parentElement.parentElement.querySelector(
    ".valor-total"
  ).innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`;
  atualizarValor();
};

// Decrementando - 1 e atualizando o valor
const decrementoProduto = (event) => {
  let qtd = event.target.parentElement.querySelector(".quantidade-produto");
  qtd.value--;

  let valorProduto = event.target.parentElement.parentElement.parentElement
    .querySelector(".preco-produto")
    .innerText.replace("R$", "")
    .replace(",", ".");
  let total = qtd.value * valorProduto;

  if (qtd.value == 0) {
    qtd.parentElement.parentElement.parentElement.remove();
  }

  qtd.parentElement.parentElement.parentElement.querySelector(
    ".valor-total"
  ).innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`;
  atualizarValor();
};

const adicionarProdutoCarrinho = (event) => {
  const botao = event.target;
  const produtoInfo = botao.parentElement.parentElement;
  const tituloNovoProduto =
    produtoInfo.querySelector(".opcao-produto").innerText;
  const precoProduto = produtoInfo.querySelector(".preco-produto").innerText;
  const imagemProduto = produtoInfo.querySelector("img").src;
  const descricaoProduto =
    produtoInfo.querySelector(".descricao-produto").innerText;
  const tituloProduto = document.querySelectorAll(".card-produto");

  for (var i = 0; i < tituloProduto.length; i++) {
    if (
      tituloProduto[i].querySelector(".opcao-produto").innerHTML ===
      tituloNovoProduto
    ) {
      tituloProduto[i].querySelector(".quantidade-produto").value++;
      atualizarValor();
      return;
    }
  }

  let novoProduto = document.createElement("div");
  novoProduto.classList.add("card-produto");

  novoProduto.innerHTML = `
    <div class="produto">
    <h3>Produto</h3>
    <div class="descricao-produto">
        <div class="imagem-produto">
            <img src="${imagemProduto}" alt="${tituloNovoProduto}">
        </div>
        <div class="descricao">
            <span class="opcao-produto">${tituloNovoProduto}</span>
            <p class="descricao-produto">${descricaoProduto}</p>
        </div>
    </div>
  </div>
  <div class="preco">
    <h3>Preço</h3>
    <p class="preco-produto">${precoProduto}</p>
  </div>
  <div class="quantidade">
    <h3>Quantidade</h3>
    <div class="form">
        <input class="altarar-quantidade-produto mais" type="button" value="+">
        <input class="quantidade-produto" type="number" name="quantidade" value="1" disabled>
        <input class="altarar-quantidade-produto menos" type="button" value="-">
    </div>
  </div>
  <div class="total">
    <h3>Total</h3>
    <p class="valor-total">${precoProduto}</p>
  </div>
  <div class="lixeira">
    <img class="remover-produto" src="./assets/lixeira.svg" alt="">
  </div>
  `;

  let modalConteudo = document.querySelector(".modal-off main .conteudo");
  modalConteudo.appendChild(novoProduto);

  novoProduto
    .querySelector(".remover-produto")
    .addEventListener("click", removerProduto);
  novoProduto
    .querySelector(".menos")
    .addEventListener("click", decrementoProduto);
  novoProduto
    .querySelector(".mais")
    .addEventListener("click", incrementarProduto);

  atualizarValor();
};

// BOTAO DECREMENTO  -  Chamada dos objetos via DOM
const botaoDecrementoProduto = document.querySelectorAll(".menos");
for (var i = 0; i < botaoDecrementoProduto.length; i++) {
  botaoDecrementoProduto[i].addEventListener("click", decrementoProduto);
}

// BOTAO INCREMENTO  -  Chamada dos objetos via DOM
const botaoIncrementarProduto = document.querySelectorAll(".mais");
for (var i = 0; i < botaoIncrementarProduto.length; i++) {
  botaoIncrementarProduto[i].addEventListener("click", incrementarProduto);
}

// BOTAO REMOVER PRODUTO  -  Chamada dos objetos via DOM
const botaoRemoverProduto = document.querySelectorAll(".remover-produto");
for (var i = 0; i < botaoRemoverProduto.length; i++) {
  botaoRemoverProduto[i].addEventListener("click", removerProduto);
}

// BOTAO CARRINHO DE COMPRA  -  Chamada dos objetos via DOM
const carrinhoCompra = document.querySelector(".carrinho-compras");
carrinhoCompra.addEventListener("click", modalOn);

// BOTAO BUSCA CEP  -  Chamada dos objetos via DOM
const botaoCep = document.querySelector("#botao-cep");
botaoCep.addEventListener("click", buscaCep);

// BOTAO FINALIZAR PEDIDO  -  Chamada dos objetos via DOM
const botaoFinalizarPedido = document.querySelector("#finalizar-pedido");
botaoFinalizarPedido.addEventListener("click", finalizarPedido);

const botaoComprarProduto = document.querySelectorAll(".botao-comprar-produto");
for (var i = 0; i < botaoComprarProduto.length; i++) {
  botaoComprarProduto[i].addEventListener("click", adicionarProdutoCarrinho);
}
