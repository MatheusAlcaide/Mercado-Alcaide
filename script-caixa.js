window.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTOS DO CAIXA
    // ========================================

    const campoCodigo =
        document.querySelector("#codigo");

    const botaoAdicionar =
        document.querySelector(".botao-adicionar");

    const botoesPagamento =
        document.querySelectorAll(".formas-pagamento button");

    const botaoCancelarVenda =
        document.querySelector(".cancelar-venda");

    const botaoFinalizarVenda =
        document.querySelector(".finalizar-venda");

    let formaPagamentoSelecionada = "";


    // ========================================
    // BUSCAR PRODUTOS ATUALIZADOS
    // ========================================

    function carregarProdutos() {

        return JSON.parse(
            localStorage.getItem("produtosMercadinho")
        ) || [];

    }


    // ========================================
    // ENCONTRAR PRODUTO PELO CÓDIGO
    // ========================================

    function buscarProduto(codigo) {

        const produtos = carregarProdutos();

        return produtos.find(function (produto) {

            return produto.codigo === codigo;

        });

    }


    // ========================================
    // CONFIGURAR PRODUTO
    // ========================================

    function configurarProduto(produto) {

        const botaoMenos =
            produto.querySelector(
                ".quantidade button:first-child"
            );

        const botaoMais =
            produto.querySelector(
                ".quantidade button:last-child"
            );

        const quantidade =
            produto.querySelector(
                ".quantidade span"
            );

        const botaoRemover =
            produto.querySelector(
                ".remover-produto"
            );


        // ========================================
        // BOTÃO +
        // ========================================

        botaoMais.addEventListener("click", function () {

            const codigo =
                produto
                    .querySelector(".nome-produto small")
                    .textContent
                    .trim();


            const produtoCadastrado =
                buscarProduto(codigo);


            if (!produtoCadastrado) {

                alert(
                    "Este produto não está mais cadastrado."
                );

                return;

            }


            let valorAtual =
                Number(quantidade.textContent);


            // VERIFICA ESTOQUE
            if (
                valorAtual >=
                Number(produtoCadastrado.estoque)
            ) {

                alert(
                    "Estoque insuficiente.\n\n" +
                    "Produto: " +
                    produtoCadastrado.nome +
                    "\nEstoque disponível: " +
                    produtoCadastrado.estoque
                );

                return;

            }


            valorAtual =
                valorAtual + 1;


            quantidade.textContent =
                valorAtual;


            atualizarValores();

        });


        // ========================================
        // BOTÃO -
        // ========================================

        botaoMenos.addEventListener("click", function () {

            let valorAtual =
                Number(quantidade.textContent);


            if (valorAtual > 1) {

                valorAtual =
                    valorAtual - 1;

            }


            quantidade.textContent =
                valorAtual;


            atualizarValores();

        });


        // ========================================
        // LIXEIRA
        // ========================================

        botaoRemover.addEventListener("click", function () {

            produto.remove();

            atualizarValores();

        });

    }


    // ========================================
    // CONFIGURA PRODUTOS QUE JÁ ESTÃO NO HTML
    // ========================================

    const produtosIniciais =
        document.querySelectorAll(".produto-venda");


    produtosIniciais.forEach(function (produto) {

        configurarProduto(produto);

    });


    // ========================================
    // ADICIONAR PRODUTO NA VENDA
    // ========================================

    function adicionarProdutoNaVenda(produto) {

        const listaVenda =
            document.querySelector(".lista-venda");


        // PRODUTO SEM ESTOQUE
        if (Number(produto.estoque) <= 0) {

            alert(
                "Este produto está sem estoque.\n\n" +
                produto.nome
            );

            return;

        }


        // ========================================
        // VERIFICA SE JÁ ESTÁ NA VENDA
        // ========================================

        const produtosAtuais =
            document.querySelectorAll(".produto-venda");

        let produtoJaExiste = null;


        produtosAtuais.forEach(function (item) {

            const codigo =
                item.querySelector(
                    ".nome-produto small"
                );


            if (
                codigo &&
                codigo.textContent.trim() ===
                produto.codigo
            ) {

                produtoJaExiste = item;

            }

        });


        // ========================================
        // SE JÁ EXISTIR
        // ========================================

        if (produtoJaExiste) {

            const quantidade =
                produtoJaExiste.querySelector(
                    ".quantidade span"
                );


            let valorAtual =
                Number(quantidade.textContent);


            if (
                valorAtual >=
                Number(produto.estoque)
            ) {

                alert(
                    "Estoque insuficiente.\n\n" +
                    "Produto: " +
                    produto.nome +
                    "\nEstoque disponível: " +
                    produto.estoque
                );

                return;

            }


            valorAtual =
                valorAtual + 1;


            quantidade.textContent =
                valorAtual;


            atualizarValores();

            return;

        }


        // ========================================
        // CRIA NOVO PRODUTO
        // ========================================

        const produtoNovo =
            document.createElement("div");


        produtoNovo.classList.add(
            "produto-venda"
        );


        produtoNovo.innerHTML = `

            <div class="nome-produto">

                <div class="produto-icone">

                    <i class="fa-solid fa-box"></i>

                </div>

                <div>

                    <strong>
                        ${produto.nome}
                    </strong>

                    <small>
                        ${produto.codigo}
                    </small>

                </div>

            </div>


            <div class="quantidade">

                <button>-</button>

                <span>1</span>

                <button>+</button>

            </div>


            <span>
                R$ ${Number(produto.preco)
                    .toFixed(2)
                    .replace(".", ",")}
            </span>


            <strong>
                R$ ${Number(produto.preco)
                    .toFixed(2)
                    .replace(".", ",")}
            </strong>


            <button class="remover-produto">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        listaVenda.appendChild(
            produtoNovo
        );


        configurarProduto(
            produtoNovo
        );


        atualizarValores();

    }


    // ========================================
    // BOTÃO ADICIONAR
    // ========================================

    botaoAdicionar.addEventListener(
        "click",
        function () {

            const codigoDigitado =
                campoCodigo.value.trim();


            if (codigoDigitado === "") {

                alert(
                    "Digite ou escaneie um código de barras."
                );

                campoCodigo.focus();

                return;

            }


            const produtoEncontrado =
                buscarProduto(
                    codigoDigitado
                );


            if (produtoEncontrado) {

                adicionarProdutoNaVenda(
                    produtoEncontrado
                );


                campoCodigo.value = "";

                campoCodigo.focus();

            } else {

                alert(
                    "Produto não encontrado."
                );


                campoCodigo.select();

            }

        }
    );


    // ========================================
    // ENTER ADICIONA PRODUTO
    // ========================================

    campoCodigo.addEventListener(
        "keydown",
        function (evento) {

            if (evento.key === "Enter") {

                botaoAdicionar.click();

            }

        }
    );


    // ========================================
    // ATUALIZAR VALORES
    // ========================================

    function atualizarValores() {

        const produtosAtuais =
            document.querySelectorAll(
                ".produto-venda"
            );


        const mensagemSemProdutos =
            document.querySelector(
                ".sem-produtos"
            );


        if (mensagemSemProdutos) {

            if (
                produtosAtuais.length === 0
            ) {

                mensagemSemProdutos.style.display =
                    "block";

            } else {

                mensagemSemProdutos.style.display =
                    "none";

            }

        }


        let quantidadeTotal = 0;

        let valorTotal = 0;


        produtosAtuais.forEach(
            function (produto) {

                const quantidade =
                    Number(
                        produto.querySelector(
                            ".quantidade span"
                        ).textContent
                    );


                const precoTexto =
                    produto.children[2]
                        .textContent;


                const preco =
                    Number(
                        precoTexto
                            .replace("R$", "")
                            .replace(",", ".")
                            .trim()
                    );


                const subtotal =
                    quantidade * preco;


                produto.children[3].textContent =
                    subtotal.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );


                quantidadeTotal +=
                    quantidade;


                valorTotal +=
                    subtotal;

            }
        );


        const resumo =
            document.querySelectorAll(
                ".linha-resumo strong"
            );


        if (resumo[0]) {

            resumo[0].textContent =
                quantidadeTotal;

        }


        if (resumo[1]) {

            resumo[1].textContent =
                valorTotal.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );

        }


        const total =
            document.querySelector(
                ".total-venda strong"
            );


        if (total) {

            total.textContent =
                valorTotal.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );

        }

    }


    // ========================================
    // FORMA DE PAGAMENTO
    // ========================================

    botoesPagamento.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    botoesPagamento.forEach(
                        function (outroBotao) {

                            outroBotao.classList.remove(
                                "pagamento-selecionado"
                            );

                        }
                    );


                    botao.classList.add(
                        "pagamento-selecionado"
                    );


                    formaPagamentoSelecionada =
                        botao.textContent.trim();

                }
            );

        }
    );


    // ========================================
    // LIMPAR CAIXA
    // ========================================

    function limparCaixa() {

        const produtosAtuais =
            document.querySelectorAll(
                ".produto-venda"
            );


        produtosAtuais.forEach(
            function (produto) {

                produto.remove();

            }
        );


        formaPagamentoSelecionada = "";


        botoesPagamento.forEach(
            function (botao) {

                botao.classList.remove(
                    "pagamento-selecionado"
                );

            }
        );


        campoCodigo.value = "";


        atualizarValores();


        campoCodigo.focus();

    }


    // ========================================
    // CANCELAR VENDA
    // ========================================

    botaoCancelarVenda.addEventListener(
        "click",
        function () {

            const produtosAtuais =
                document.querySelectorAll(
                    ".produto-venda"
                );


            if (
                produtosAtuais.length === 0
            ) {

                alert(
                    "Não existem produtos na venda."
                );

                return;

            }


            const confirmar =
                confirm(
                    "Deseja realmente cancelar esta venda?"
                );


            if (confirmar) {

                limparCaixa();


                alert(
                    "Venda cancelada."
                );

            }

        }
    );


    // ========================================
    // FINALIZAR VENDA
    // ========================================

    botaoFinalizarVenda.addEventListener(
        "click",
        function () {

            const produtosAtuais =
                document.querySelectorAll(
                    ".produto-venda"
                );


            if (
                produtosAtuais.length === 0
            ) {

                alert(
                    "Adicione pelo menos um produto antes de finalizar a venda."
                );

                return;

            }


            if (
                formaPagamentoSelecionada === ""
            ) {

                alert(
                    "Selecione uma forma de pagamento."
                );

                return;

            }


            // ========================================
            // CARREGA ESTOQUE ATUAL
            // ========================================

            const produtosSalvos =
                carregarProdutos();


            let estoqueValido = true;

            let mensagemErro = "";


            // ========================================
            // CONFERE ESTOQUE NOVAMENTE
            // ========================================

            produtosAtuais.forEach(
                function (produtoVenda) {

                    const codigo =
                        produtoVenda
                            .querySelector(
                                ".nome-produto small"
                            )
                            .textContent
                            .trim();


                    const quantidadeVendida =
                        Number(
                            produtoVenda
                                .querySelector(
                                    ".quantidade span"
                                )
                                .textContent
                        );


                    const produtoEncontrado =
                        produtosSalvos.find(
                            function (produto) {

                                return produto.codigo ===
                                    codigo;

                            }
                        );


                    if (!produtoEncontrado) {

                        estoqueValido = false;

                        mensagemErro =
                            "Um dos produtos não está mais cadastrado.";

                        return;

                    }


                    if (
                        quantidadeVendida >
                        Number(produtoEncontrado.estoque)
                    ) {

                        estoqueValido = false;


                        mensagemErro =
                            "Estoque insuficiente para:\n\n" +
                            produtoEncontrado.nome +
                            "\n\nDisponível: " +
                            produtoEncontrado.estoque +
                            "\nNa venda: " +
                            quantidadeVendida;

                    }

                }
            );


            if (!estoqueValido) {

                alert(mensagemErro);

                return;

            }


            // ========================================
            // TOTAL DA VENDA
            // ========================================

            const totalTexto =
                document.querySelector(
                    ".total-venda strong"
                ).textContent;


            const confirmar =
                confirm(
                    "Finalizar venda?\n\n" +
                    "Pagamento: " +
                    formaPagamentoSelecionada +
                    "\nTotal: " +
                    totalTexto
                );


            if (!confirmar) {

                return;

            }


            // ========================================
            // PRODUTOS PARA O HISTÓRICO
            // ========================================

            const itensVenda = [];

            let valorTotalVenda = 0;


            produtosAtuais.forEach(
                function (produtoVenda) {

                    const codigo =
                        produtoVenda
                            .querySelector(
                                ".nome-produto small"
                            )
                            .textContent
                            .trim();


                    const quantidadeVendida =
                        Number(
                            produtoVenda
                                .querySelector(
                                    ".quantidade span"
                                )
                                .textContent
                        );


                    const produtoEncontrado =
                        produtosSalvos.find(
                            function (produto) {

                                return produto.codigo ===
                                    codigo;

                            }
                        );


                    if (produtoEncontrado) {

                        const preco =
                            Number(
                                produtoEncontrado.preco
                            );


                        const subtotal =
                            preco *
                            quantidadeVendida;


                        // DIMINUI ESTOQUE
                        produtoEncontrado.estoque =
                            Number(
                                produtoEncontrado.estoque
                            ) -
                            quantidadeVendida;


                        // GUARDA ITEM NO HISTÓRICO
                        itensVenda.push({

                            nome:
                                produtoEncontrado.nome,

                            codigo:
                                produtoEncontrado.codigo,

                            quantidade:
                                quantidadeVendida,

                            preco:
                                preco,

                            subtotal:
                                subtotal

                        });


                        valorTotalVenda +=
                            subtotal;

                    }

                }
            );


            // ========================================
            // SALVA NOVO ESTOQUE
            // ========================================

            localStorage.setItem(
                "produtosMercadinho",
                JSON.stringify(
                    produtosSalvos
                )
            );


            // ========================================
            // HISTÓRICO DE VENDAS
            // ========================================

            const historicoVendas =
                JSON.parse(
                    localStorage.getItem(
                        "historicoVendas"
                    )
                ) || [];


            const agora =
                new Date();


            const novaVenda = {

                id:
                    Date.now(),

                data:
                    agora.toLocaleDateString(
                        "pt-BR"
                    ),

                hora:
                    agora.toLocaleTimeString(
                        "pt-BR",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),

                dataCompleta:
                    agora.toISOString(),

                pagamento:
                    formaPagamentoSelecionada,

                itens:
                    itensVenda,

                quantidadeItens:
                    itensVenda.reduce(
                        function (total, item) {

                            return total +
                                item.quantidade;

                        },
                        0
                    ),

                total:
                    valorTotalVenda

            };


            historicoVendas.push(
                novaVenda
            );


            localStorage.setItem(
                "historicoVendas",
                JSON.stringify(
                    historicoVendas
                )
            );


            // ========================================
            // FINALIZA E LIMPA
            // ========================================

            alert(
                "Venda finalizada com sucesso!\n\n" +
                "Pagamento: " +
                formaPagamentoSelecionada +
                "\nTotal: " +
                valorTotalVenda.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                )
            );


            limparCaixa();

        }
    );


    // ========================================
    // INICIAR CAIXA
    // ========================================

    atualizarValores();

    campoCodigo.focus();

});