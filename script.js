let fotosAtuais = [];
let fotoIndice = 0;

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarVisualizacaoCarrinho() {
    const contador = document.getElementById('carrinho-count');

    if (contador) {
        contador.innerText = carrinho.length;
    }
}

function abrirModal(nome, preco, imagemPrincipal, descricao, imagensExtras = []) {

    document.getElementById('modalNome').innerText = nome;
    document.getElementById('modalPreco').innerText = preco;
    document.getElementById('modalDescricao').innerText = descricao;

    fotosAtuais = [imagemPrincipal, ...imagensExtras];
    fotoIndice = 0;

    document.getElementById('modalImg').src = fotosAtuais[fotoIndice];

    const btnComprar = document.querySelector('#modalProduto .btn-comprar');

    btnComprar.onclick = function () {
        adicionarAoCarrinho(nome, preco, imagemPrincipal);
    };

    document.getElementById('modalProduto').style.display = "flex";
}

function mudarFoto(direcao) {

    if (fotosAtuais.length <= 1) return;

    fotoIndice += direcao;

    if (fotoIndice >= fotosAtuais.length) {
        fotoIndice = 0;
    }

    if (fotoIndice < 0) {
        fotoIndice = fotosAtuais.length - 1;
    }

    document.getElementById('modalImg').src = fotosAtuais[fotoIndice];
}

function fecharModal() {
    document.getElementById('modalProduto').style.display = "none";
}

function adicionarAoCarrinho(nome, preco, imagem) {

    carrinho.push({
        nome,
        preco,
        imagem
    });

    salvarCarrinho();

    atualizarVisualizacaoCarrinho();

    alert(`${nome} foi adicionado ao carrinho!`);
}

function abrirCarrinho() {

    const lista = document.getElementById('lista-carrinho');
    const totalElemento = document.getElementById('valor-total');

    if (!lista || !totalElemento) return;

    lista.innerHTML = "";

    let somaTotal = 0;

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p style="padding:20px">
                Seu carrinho está vazio.
            </p>
        `;

        totalElemento.innerText = "R$ 0,00";

    } else {

        carrinho.forEach((item, index) => {

            let valorNumerico = parseFloat(
                item.preco
                    .replace("R$", "")
                    .replace(".", "")
                    .replace(",", ".")
            );

            somaTotal += valorNumerico;

            lista.innerHTML += `
                <div class="item-carrinho">

                    <img src="${item.imagem}">

                    <div style="flex-grow:1">

                        <p style="margin:0; font-weight:bold">
                            ${item.nome}
                        </p>

                        <p style="margin:5px 0; color:#ff4d4f">
                            ${item.preco}
                        </p>

                    </div>

                    <button onclick="removerItem(${index})"
                        style="
                            background:none;
                            border:none;
                            cursor:pointer;
                            font-size:18px;
                        ">
                        🗑️
                    </button>

                </div>
            `;
        });

        totalElemento.innerText =
            somaTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
    }

    document.getElementById('janela-carrinho').style.display = "block";
}

function fecharCarrinho() {
    document.getElementById('janela-carrinho').style.display = "none";
}

function removerItem(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarVisualizacaoCarrinho();

    abrirCarrinho();
}

window.onclick = function(event) {

    if (event.target.classList.contains('modal')) {

        fecharModal();

        fecharCarrinho();
    }
}

window.onload = function () {
    atualizarVisualizacaoCarrinho();
}

function irParaCheckout() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  window.location.href = "checkout.html";
}

function carregarCheckout() {
  const itensContainer = document.getElementById("checkout-itens");
  const subtotalElemento = document.getElementById("checkout-subtotal");
  const totalElemento = document.getElementById("checkout-total");

  if (!itensContainer || !subtotalElemento || !totalElemento) return;

  let subtotal = 0;
  itensContainer.innerHTML = "";

  carrinho.forEach(item => {
    let valor = parseFloat(
      item.preco.replace("R$", "").replace(".", "").replace(",", ".")
    );

    subtotal += valor;

    itensContainer.innerHTML += `
      <div class="checkout-item">
        <img src="${item.imagem}">
        <div>
          <strong>${item.nome}</strong>
          <p>${item.preco}</p>
        </div>
      </div>
    `;
  });

  subtotalElemento.innerText = subtotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  totalElemento.innerText = subtotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function confirmarCompra() {
  alert("Compra finalizada com sucesso!");

  localStorage.removeItem("carrinho");

  window.location.href = "home.html";
}

function rolarProdutos(botao, direcao) {
  const carrossel = botao.parentElement.querySelector(".linha-produtos");
  carrossel.scrollBy({
    left: direcao * 350,
    behavior: "smooth"
  });
}