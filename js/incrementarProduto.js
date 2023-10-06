// Incrementado + 1 e atualizando o valor
const incrementarProduto = (event) => {
  let qtd = event.target.parentElement.querySelector(".quantidade-produto");
  qtd.value++;

  let valorProduto = 16;
  let total = qtd.value * valorProduto;
  if (qtd.value >= 20) {
    return (valorProduto = 15);
  }
  qtd.parentElement.parentElement.parentElement.querySelector(
    ".valor-total"
  ).innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`;
  atualizarValor();
};
