//===================================
// CATÁLOGO INTERATICO DE PRODUTOS
// API utilizada : DummyJSON
//====================================

const API_URL = "https://dummyjson.com/products?limit=30";

const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");
const pesquisa = document.getElementById("pesquisa");
const formPesquisa = document.getElementById("formPesquisa");
const btnTodos = document.getElementById("btnTodos");
const btnFavoritos = document.getElementById("btnFavoritos");
const contadorFavoritos = document.getElementById("contadorFavoritos");
const tituloLista = document.getElementById("tituloLista");
const totalProdutos = document.getElementById("totalProdutos");
const modalDetalhes = document.getElementById("modalDetalhes");
const conteudoDetalhes = document.getElementById("conteudoDetalhes");
const fecharModal = document.getElementById("fecharModal");

// Dados da aplicação
let produtos = [];
let favoritos = carregarFavoritos();
let mostrandoFavoritos = false;
let termoPesquisa = "";


// Recuperar os favoritos salvos no navegador
function  carregarFavoritos() {
    try{
        const dadosSalvos = localStorage.getItem("catalogoFavoritos");
        return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch (erro) {
        console.error("Erro ao recuperar seus favoritos:", erro);
        return [];
    }
    
}

// Salvar os favoritos no navegador
function salvarFavoritos() {
    try {
        localStorage.setItem(
            "catalogoFavoritos",
            JSON.stringify(favoritos)
        );
    } catch (erro) {
        console.error("Erro ao salvar seus favoritos:", erro);
        alert("Não foi possível salvar os seus favoritos neste navegador.");
    }
}

// Formata os preços em reais (R$)
function formatarPreco(preco) {
    return preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// Traduz textos do inglês para português
async function traduzirTexto(texto) {
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-BR`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao traduzir texto.");
        }

        const dados = await resposta.json();

        return dados.responseData.translatedText;

    } catch (erro) {
        console.error("Erro na tradução:", erro);
        return texto;
    }
}

// Buscar os produtos na API
async function carregarProdutos() {
    mensagem.textContent = "Carregando produtos...";
    listaProdutos.innerHTML = "";

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar os produtos.")    
        }

        const dados = await resposta.json();
        produtos = dados.products;

        mensagem.textContent = "";
        exibirProdutos();
        atualizarContador();

    } catch (erro) {
        console.error("Erro ao carregar os produtos:", erro);
        mensagem.textContent = 
            "Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.";
    }
    
}

// Filtrar os produtos por nome e favoritos
function obterProdutosExibidos() {
    let resultado = produtos;

    if ( mostrandoFavoritos) {
        resultado = resultado.filter(produto =>
            favoritos.some(favorito => favorito.id === produto.id)
        );
    }

    if (termoPesquisa.trim() !== "") {
        const termo = termoPesquisa.toLowerCase();

        resultado = resultado.filter(produto =>
            produto.title.toLowerCase().includes(termo)
        );
    }

    return resultado;
}

// Exibe os cartões de produtos
function exibirProdutos() {
    listaProdutos.innerHTML = "";

    const resultado = obterProdutosExibidos();

    tituloLista.textContent = mostrandoFavoritos
        ? "Meus favoritos"
        : termoPesquisa
            ? "Resultados da pesquisa"
            : "Todos os produtos";
    
    totalProdutos.textContent = `${resultado.length} produto(s)`;

    if (resultado.length === 0) {
        mensagem.textContent = mostrandoFavoritos
            ? "Você ainda não tem favoritos que correspondam à pesquisa."
            : "Nenhum produto encontrado.";
        
        return;
    }

    mensagem.textContent = "";

    resultado.forEach(produto => {
        const card = document.createElement("article");
        card.className = "produto";

        const estaFavoritado = favoritos.some(
            favorito => favorito.id === produto.id
        );

        // Área da imagem
        const imagem = document.createElement("img");
        imagem.src = produto.thumbnail;
        imagem.alt = produto.title;
        imagem.loading = "lazy";

        imagem.addEventListener("error", () => {
            imagem.alt = "Imagem indisponível";
            imagem.removeAttribute("src");
        });

        const areaImagem = document.createElement("div");
        areaImagem.className = "imagem-produto";
        areaImagem.appendChild(imagem);

        // Botão de favoritos
        const botaoFavorito = document.createElement("button");
        botaoFavorito.className = "btn-favorito";
        botaoFavorito.classList.toggle("favoritado", estaFavoritado);
        botaoFavorito.textContent = estaFavoritado ? "♥" : "♡";
        botaoFavorito.setAttribute(
            "aria-label",
            estaFavoritado
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
        );

        botaoFavorito.addEventListener("click", () => {
            alternarFavorito(produto);
        });

        areaImagem.appendChild(botaoFavorito);

        // Informações do produto
        const informacoes = document.createElement("div");
        informacoes.className = "info-produto";

        const categoria = document.createElement("p");
        categoria.className = "categoria-produto";
        categoria.textContent = produto.category;

        const nome = document.createElement("h3");
        nome.className = "nome-produto";
        nome.textContent = produto.title;

        const preco = document.createElement("p");
        preco.className = "preco-produto";
        preco.textContent = formatarPreco(produto.price);

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.className = "btn-detalhes";
        botaoDetalhes.textContent = "Ver detalhes";

        botaoDetalhes.addEventListener("click", () => {
            mostrarDetalhes(produto);
        });

        informacoes.append(
            categoria,
            nome,
            preco,
            botaoDetalhes
        );

        card.append(areaImagem, informacoes);
        listaProdutos.appendChild(card);
    });

}

// Adiciona ou remove um produto dos favoritos 
function alternarFavorito(produto) {
    const indice = favoritos.findIndex(
        favorito => favorito.id === produto.id
    );

    if (indice !== -1) {
        favoritos.splice(indice, 1);
    } else {
        favoritos.push({
            id: produto.id,
            title: produto.title,
            price: produto.price,
            thumbnail: produto.thumbnail,
            category: produto.category
        });
    }

    salvarFavoritos();
    atualizarContador();
    exibirProdutos();
}

// Atualiza o contador de favoritos
function atualizarContador() {
    contadorFavoritos.textContent = favoritos.length;
}

// Mostra os detalhes do produto
async function mostrarDetalhes(produto) {
    conteudoDetalhes.innerHTML = "";

    const area = document.createElement("div");
    area.className = "detalhe-conteudo";

    const imagem = document.createElement("img");
    imagem.src = produto.thumbnail;
    imagem.alt = produto.title;

    const informacoes = document.createElement("div");

    const categoria = document.createElement("p");
    categoria.className = "categoria-produto";
    categoria.textContent = produto.category;

    const nome = document.createElement("h2");
    nome.textContent = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = "Traduzindo descrição...";

    const descricaoTraduzida = await traduzirTexto(produto.description);
    descricao.textContent = descricaoTraduzida;

    const preco = document.createElement("p");
    preco.className = "preco-produto";
    preco.textContent = formatarPreco(produto.price);

    const avaliacao = document.createElement("p");
    avaliacao.textContent = `Avaliação: ${produto.rating} de 5`;

    informacoes.append(
        categoria,
        nome,
        descricao,
        preco,
        avaliacao
    );

    area.append(imagem, informacoes);
    conteudoDetalhes.appendChild(area);
   
    modalDetalhes.showModal();
}

// Pesquisar produtos pelo nome
formPesquisa.addEventListener("submit", evento => {
    evento.preventDefault();

    termoPesquisa = pesquisa.value.trim();
    mostrandoFavoritos = false;

    btnTodos.classList.add("ativo");
    btnFavoritos.classList.remove("ativo");

    exibirProdutos();
});

// Mostrar todos os produtos
btnTodos.addEventListener("click", () => {
    mostrandoFavoritos = false;
    termoPesquisa = "";
    pesquisa.value = "";

    btnTodos.classList.add("ativo");
    btnFavoritos.classList.remove("ativo");

    exibirProdutos();
});

// Mostra apenas os favoritos
btnFavoritos.addEventListener("click", () => {
    mostrandoFavoritos = true;
    termoPesquisa = "";
    pesquisa.value = "";

    btnFavoritos.classList.add("ativo");
    btnTodos.classList.remove("ativo");

    exibirProdutos();
});

// Fecha a janela de detalhes
fecharModal.addEventListener("click", () => {
    modalDetalhes.close();
});

// Fecha a janela ao clicar fora do conteúdo
modalDetalhes.addEventListener("click", evento => {
    if (evento.target === modalDetalhes) {
        modalDetalhes.close();
    }
});

// Inicia a aplicação
carregarProdutos();