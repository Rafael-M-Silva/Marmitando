// global
const modal = document.querySelector(".modal-off");
const navbar = document.querySelector(".nav-bar");
const body = document.querySelector("body");
let valorCompra = 0
const frete = 5

// Objeto dados Usuario para encaminhar Wpp
let dadosUsuarioCep = {
  localidade: ``,
  bairro: ``,
  logradouro: ``,
  numero: ``,
  complemento: ``
};

// configuração quando o modal estiver ativo
const modalOn = () => {
  navbar.classList.toggle("display-none");
  modal.classList.toggle("modal-on");
  body.classList.toggle("overflow-hidden");
};

// Fechar modal e voltar para tela inicial
const fecharModal = () => {
  navbar.classList.remove("display-none");
  modal.classList.remove("modal-on");
  body.classList.remove("overflow-hidden");
}

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
        <textarea name="" id="complemento" cols="30" rows="4" placeholder="Complemento"></textarea>
      `;

      document
        .querySelector("#numero")
        .addEventListener("input", pegarNumeroCasa);

        document
        .querySelector('#complemento')
        .addEventListener('input', pegarComplemento)

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

// pegando o complemento da casa do usuario e passando esse valor para o objeto dadosUsuarioCep
const pegarComplemento = (event) => {
  dadosUsuarioCep.complemento = event.target.value;
};


// Finalizando o pedido imprimindo um alert e falta encaminhar para o wpp
let marmitas = []
let quantidades = []
const finalizarPedido = () => {
  let totalCompra = valorCompra + frete;
  
  if (dadosUsuarioCep.numero == 0) {
    alert("Preencha todos os campos!");
  } else if (valorCompra == 0) {
    alert("Nenhum item no carrinho");
  } else {
    const pegandoMarmitas = document.querySelectorAll('.card-produto')
    for(var i = 0; i < pegandoMarmitas.length; i++) {
      const marmita = pegandoMarmitas[i].querySelector('.opcao-produto').innerHTML
      const quantidade = pegandoMarmitas[i].querySelector('.quantidade-produto').value
      quantidades.push(quantidade)
      marmitas.push(marmita)
    }
    
    // Crie um array que combina marmitas e quantidades
    const marmitasComQuantidades = []
    for (let i = 0; i < marmitas.length; i++) {
      marmitasComQuantidades.push(`${marmitas[i]} x ${quantidades[i]}`)
    }

    const marmitasFormatadas = marmitasComQuantidades.join('\n');
    const mensagemWhatsapp = `
      *Pedido Finalizado com Sucesso!*
      =========================================
      _Cidade:_ ${dadosUsuarioCep.localidade}
      _Bairro:_ ${dadosUsuarioCep.bairro}
      _Rua:_ ${dadosUsuarioCep.logradouro} n: ${dadosUsuarioCep.numero}
      _Complemento:_ ${dadosUsuarioCep.complemento}
      =========================================
      *Marmitas selecionadas*

      ${marmitasFormatadas}

      Total da compra: *R$${totalCompra.toFixed(2).replace('.', ',')}*
  
      Volte sempre :)
    `;

    const numeroWhatsApp = '5511984481182';
    const mensagemCodificada = encodeURIComponent(mensagemWhatsapp);

    // Construir o link do WhatsApp
    const linkWhatsapp = `https://wa.me//${numeroWhatsApp}?text=${mensagemCodificada}`;
    // Redirecionar para o link do WhatsApp
    window.location.href = linkWhatsapp;
  }
};



// Atualizando o valor do subtotal e resumo
const atualizarValor = () => {
  let subTotal = 0;
  const notificacao = document.querySelector('.notificacao')
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
    valorCompra = subTotal
  }

  document.querySelector(".subtotal span").innerHTML = `R$ ${subTotal
    .toFixed(2)
    .replace(".", ",")}`;
  document.querySelector(".valor-produtos span").innerHTML = `R$ ${subTotal
    .toFixed(2)
    .replace(".", ",")}`;
  document.querySelector('.total-compra span').innerHTML = `R$ ${(subTotal + frete).toFixed(2).replace('.',',')}`

  if (subTotal == 0) {
    notificacao.classList.remove('notificacao-on')
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
  
  notificacao.classList.add('notificacao-on') /* acionando sino de notificação quando entrar item, subTotal > 1 já add */
};


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
  const popUpOn = document.querySelector('.pop-up-on')
  let popUp = document.createElement('div')
  popUp.classList.add('alert')
  popUp.classList.add('pop-up')

  popUp.innerHTML = `
    <img src="./assets/check.svg" alt="">
    <p>Item Adicionado com Sucesso!</p>
  `
  popUpOn.appendChild(popUp)

    setTimeout(() => {
    popUp.classList.remove('pop-up')

    setInterval(() => {
      popUp.remove()
    }, 2000);
  }, 300);

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
    <h3>Qtd</h3>
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

// Fechando modal e voltando para Home
const botaoLogo = document.querySelector('.logo')
botaoLogo.addEventListener('click', fecharModal)


// abrindo menu
const menu = document.querySelector('.menu')
menu.addEventListener('click', abrindoMenu)

