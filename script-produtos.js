window.addEventListener("DOMContentLoaded", function () {

    const botaoNovo = document.querySelector(".novo-produto");
    const modal = document.querySelector("#modal-produto");
    const botaoFechar = document.querySelector(".fechar-modal");
    const botaoSalvar = document.querySelector(".salvar-produto");

    const campoNome = document.querySelector("#nome-produto");
    const campoCodigo = document.querySelector("#codigo-produto");
    const campoPreco = document.querySelector("#preco-produto");
    const campoEstoque = document.querySelector("#estoque-produto");

    const campoBusca = document.querySelector("#buscar-produto");
    const tabelaProdutos = document.querySelector(".tabela-produtos");

    let produtoEmEdicao = null;


    // ========================================
    // LIMPAR CAMPOS
    // ========================================

    function limparCampos() {

        campoNome.value = "";
        campoCodigo.value = "";
        campoPreco.value = "";
        campoEstoque.value = "";

    }


    // ========================================
    // SALVAR PRODUTOS NO NAVEGADOR
    // ========================================

    function salvarProdutos() {

        const linhas =
            document.querySelectorAll(".linha-produto");

        const produtos = [];


        linhas.forEach(function (linha) {

            const nome =
                linha.children[0].textContent.trim();

            const codigo =
                linha.children[1].textContent.trim();

            const precoTexto =
                linha.children[2]
                    .textContent
                    .replace("R$", "")
                    .replace(".", "")
                    .replace(",", ".")
                    .trim();

            const estoque =
                linha.children[3].textContent.trim();


            produtos.push({

                nome: nome,
                codigo: codigo,
                preco: Number(precoTexto),
                estoque: Number(estoque)

            });

        });


        localStorage.setItem(
            "produtosMercadinho",
            JSON.stringify(produtos)
        );

    }


    // ========================================
    // CONFIGURAR EXCLUSÃO
    // ========================================

    function configurarExclusao(botao) {

        botao.addEventListener("click", function () {

            const linhaProduto =
                botao.closest(".linha-produto");

            const nomeProduto =
                linhaProduto.children[0]
                    .textContent
                    .trim();


            const confirmar =
                confirm(
                    "Deseja excluir o produto " +
                    nomeProduto +
                    "?"
                );


            if (confirmar) {

                linhaProduto.remove();

                salvarProdutos();

            }

        });

    }


    // ========================================
    // CONFIGURAR EDIÇÃO
    // ========================================

    function configurarEdicao(botao) {

        botao.addEventListener("click", function () {

            const linhaProduto =
                botao.closest(".linha-produto");


            produtoEmEdicao = linhaProduto;


            const nome =
                linhaProduto.children[0]
                    .textContent
                    .trim();


            const codigo =
                linhaProduto.children[1]
                    .textContent
                    .trim();


            const precoTexto =
                linhaProduto.children[2]
                    .textContent
                    .replace("R$", "")
                    .replace(".", "")
                    .replace(",", ".")
                    .trim();


            const estoque =
                linhaProduto.children[3]
                    .textContent
                    .trim();


            campoNome.value = nome;
            campoCodigo.value = codigo;
            campoPreco.value = precoTexto;
            campoEstoque.value = estoque;


            modal.classList.add("modal-aberto");

            campoNome.focus();

        });

    }


    // ========================================
    // CRIAR LINHA DE PRODUTO
    // ========================================

    function criarLinhaProduto(produto) {

        const novaLinha =
            document.createElement("div");


        novaLinha.classList.add("linha-produto");


        novaLinha.innerHTML = `

            <strong>${produto.nome}</strong>

            <span>${produto.codigo}</span>

            <span>
                ${produto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}
            </span>

            <span>${produto.estoque}</span>

            <div class="acoes-produto">

                <button class="editar-produto">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="excluir-produto">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;


        tabelaProdutos.appendChild(novaLinha);


        const botaoEditar =
            novaLinha.querySelector(".editar-produto");

        const botaoExcluir =
            novaLinha.querySelector(".excluir-produto");


        configurarEdicao(botaoEditar);

        configurarExclusao(botaoExcluir);

    }


    // ========================================
    // CARREGAR PRODUTOS SALVOS
    // ========================================

    function carregarProdutos() {

        const produtosSalvos =
            localStorage.getItem("produtosMercadinho");


        if (produtosSalvos) {

            const produtos =
                JSON.parse(produtosSalvos);


            const linhasAtuais =
                document.querySelectorAll(".linha-produto");


            linhasAtuais.forEach(function (linha) {

                linha.remove();

            });


            produtos.forEach(function (produto) {

                criarLinhaProduto(produto);

            });

        } else {

            const botoesEditar =
                document.querySelectorAll(".editar-produto");

            const botoesExcluir =
                document.querySelectorAll(".excluir-produto");


            botoesEditar.forEach(function (botao) {

                configurarEdicao(botao);

            });


            botoesExcluir.forEach(function (botao) {

                configurarExclusao(botao);

            });


            salvarProdutos();

        }

    }


    // ========================================
    // NOVO PRODUTO
    // ========================================

    botaoNovo.addEventListener("click", function () {

        produtoEmEdicao = null;

        limparCampos();

        modal.classList.add("modal-aberto");

        campoNome.focus();

    });


    // ========================================
    // FECHAR MODAL
    // ========================================

    botaoFechar.addEventListener("click", function () {

        modal.classList.remove("modal-aberto");

        produtoEmEdicao = null;

        limparCampos();

    });


    // ========================================
    // SALVAR / EDITAR PRODUTO
    // ========================================

    botaoSalvar.addEventListener("click", function () {

        const nome =
            campoNome.value.trim();

        const codigo =
            campoCodigo.value.trim();

        const preco =
            Number(campoPreco.value);

        const estoque =
            Number(campoEstoque.value);


        if (
            nome === "" ||
            codigo === "" ||
            campoPreco.value === "" ||
            campoEstoque.value === ""
        ) {

            alert("Preencha todos os campos.");

            return;

        }


        // EDITANDO PRODUTO

        if (produtoEmEdicao) {

            produtoEmEdicao.children[0]
                .textContent = nome;


            produtoEmEdicao.children[1]
                .textContent = codigo;


            produtoEmEdicao.children[2]
                .textContent =
                preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                });


            produtoEmEdicao.children[3]
                .textContent = estoque;


            produtoEmEdicao = null;

        }

        // NOVO PRODUTO

        else {

            const produto = {

                nome: nome,
                codigo: codigo,
                preco: preco,
                estoque: estoque

            };


            criarLinhaProduto(produto);

        }


        salvarProdutos();

        limparCampos();

        modal.classList.remove("modal-aberto");

    });


    // ========================================
    // BUSCAR PRODUTO
    // ========================================

    campoBusca.addEventListener("input", function () {

        const textoBusca =
            campoBusca.value
                .toLowerCase()
                .trim();


        const linhas =
            document.querySelectorAll(".linha-produto");


        linhas.forEach(function (linha) {

            const nome =
                linha.children[0]
                    .textContent
                    .toLowerCase();


            const codigo =
                linha.children[1]
                    .textContent
                    .toLowerCase();


            if (
                nome.includes(textoBusca) ||
                codigo.includes(textoBusca)
            ) {

                linha.style.display = "grid";

            } else {

                linha.style.display = "none";

            }

        });

    });


    // ========================================
    // INICIAR
    // ========================================

    carregarProdutos();

});