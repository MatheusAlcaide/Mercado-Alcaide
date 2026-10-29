window.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // BUSCAR DADOS DO LOCALSTORAGE
    // ========================================

    const historicoVendas =
        JSON.parse(
            localStorage.getItem("historicoVendas")
        ) || [];

    const produtos =
        JSON.parse(
            localStorage.getItem("produtosMercadinho")
        ) || [];


    // ========================================
    // ELEMENTOS DA TELA
    // ========================================

    const vendasHoje =
        document.querySelector("#vendas-hoje");

    const faturamentoHoje =
        document.querySelector("#faturamento-hoje");

    const itensVendidos =
        document.querySelector("#itens-vendidos");

    const estoqueTotal =
        document.querySelector("#estoque-total");

    const listaUltimasVendas =
        document.querySelector("#lista-ultimas-vendas");


    // ========================================
    // DATA DE HOJE
    // ========================================

    const hoje =
        new Date().toLocaleDateString("pt-BR");


    // ========================================
    // FILTRAR VENDAS DE HOJE
    // ========================================

    const vendasDeHoje =
        historicoVendas.filter(
            function (venda) {

                return venda.data === hoje;

            }
        );


    // ========================================
    // QUANTIDADE DE VENDAS
    // ========================================

    vendasHoje.textContent =
        vendasDeHoje.length;


    // ========================================
    // FATURAMENTO DE HOJE
    // ========================================

    let totalFaturamento = 0;


    vendasDeHoje.forEach(
        function (venda) {

            totalFaturamento +=
                Number(venda.total);

        }
    );


    faturamentoHoje.textContent =
        totalFaturamento.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );


    // ========================================
    // ITENS VENDIDOS HOJE
    // ========================================

    let quantidadeItens = 0;


    vendasDeHoje.forEach(
        function (venda) {

            quantidadeItens +=
                Number(venda.quantidadeItens);

        }
    );


    itensVendidos.textContent =
        quantidadeItens;


    // ========================================
    // ESTOQUE TOTAL
    // ========================================

    let quantidadeEstoque = 0;


    produtos.forEach(
        function (produto) {

            quantidadeEstoque +=
                Number(produto.estoque);

        }
    );


    estoqueTotal.textContent =
        quantidadeEstoque;


    // ========================================
    // ÚLTIMAS VENDAS
    // ========================================

    function mostrarUltimasVendas() {

        listaUltimasVendas.innerHTML = "";


        if (historicoVendas.length === 0) {

            listaUltimasVendas.innerHTML = `

                <div class="sem-vendas-admin">

                    <i class="fa-solid fa-receipt"></i>

                    Nenhuma venda registrada ainda.

                </div>

            `;

            return;

        }


        // COPIA E INVERTE
        const vendasRecentes =
            [...historicoVendas]
                .reverse()
                .slice(0, 6);


        vendasRecentes.forEach(
            function (venda) {

                const linha =
                    document.createElement("div");


                linha.classList.add(
                    "venda-admin"
                );


                linha.innerHTML = `

                    <span>
                        ${venda.hora}
                    </span>

                    <span>
                        ${venda.pagamento}
                    </span>

                    <span>
                        ${venda.quantidadeItens}
                    </span>

                    <span class="valor-venda">
                        ${Number(venda.total)
                            .toLocaleString(
                                "pt-BR",
                                {
                                    style: "currency",
                                    currency: "BRL"
                                }
                            )}
                    </span>

                `;


                listaUltimasVendas.appendChild(
                    linha
                );

            }
        );

    }
    // ========================================
// ENTRADA DE MERCADORIA
// ========================================

const botaoEntradaMercadoria =
    document.querySelector(".entrada-mercadoria");

const modalEntrada =
    document.querySelector("#modal-entrada");

const fecharEntrada =
    document.querySelector("#fechar-entrada");

const produtoEntrada =
    document.querySelector("#produto-entrada");

const quantidadeEntrada =
    document.querySelector("#quantidade-entrada");

const valorEntrada =
    document.querySelector("#valor-entrada");

const estoqueAtualEntrada =
    document.querySelector("#estoque-atual-entrada");

const confirmarEntrada =
    document.querySelector("#confirmar-entrada");


// ========================================
// CARREGAR PRODUTOS NO SELECT
// ========================================

function carregarProdutosEntrada() {

    const produtosAtualizados =
        JSON.parse(
            localStorage.getItem("produtosMercadinho")
        ) || [];


    produtoEntrada.innerHTML = `

        <option value="">
            Selecione um produto
        </option>

    `;


    produtosAtualizados.forEach(
        function (produto) {

            const option =
                document.createElement("option");


            option.value =
                produto.codigo;


            option.textContent =
                produto.nome +
                " - Estoque: " +
                produto.estoque;


            produtoEntrada.appendChild(
                option
            );

        }
    );

}


// ========================================
// ABRIR MODAL
// ========================================

botaoEntradaMercadoria.addEventListener(
    "click",
    function () {

        carregarProdutosEntrada();

        produtoEntrada.value = "";

        quantidadeEntrada.value = "";

        valorEntrada.value = "";

        estoqueAtualEntrada.textContent =
            "-";


        modalEntrada.classList.add(
            "modal-aberto"
        );

    }
);


// ========================================
// FECHAR MODAL
// ========================================

function fecharModalEntrada() {

    modalEntrada.classList.remove(
        "modal-aberto"
    );

}


fecharEntrada.addEventListener(
    "click",
    fecharModalEntrada
);


modalEntrada.addEventListener(
    "click",
    function (evento) {

        if (evento.target === modalEntrada) {

            fecharModalEntrada();

        }

    }
);


// ========================================
// MOSTRAR ESTOQUE ATUAL
// ========================================

produtoEntrada.addEventListener(
    "change",
    function () {

        const codigo =
            produtoEntrada.value;


        const produtosAtualizados =
            JSON.parse(
                localStorage.getItem(
                    "produtosMercadinho"
                )
            ) || [];


        const produto =
            produtosAtualizados.find(
                function (item) {

                    return item.codigo === codigo;

                }
            );


        if (produto) {

            estoqueAtualEntrada.textContent =
                produto.estoque;

        } else {

            estoqueAtualEntrada.textContent =
                "-";

        }

    }
);


// ========================================
// CONFIRMAR ENTRADA
// ========================================

confirmarEntrada.addEventListener(
    "click",
    function () {

        const codigo =
            produtoEntrada.value;

        const quantidade =
            Number(
                quantidadeEntrada.value
            );

        const valor =
            Number(
                valorEntrada.value
            );


        if (codigo === "") {

            alert(
                "Selecione um produto."
            );

            return;

        }


        if (
            quantidade <= 0 ||
            !Number.isFinite(quantidade)
        ) {

            alert(
                "Informe uma quantidade válida."
            );

            return;

        }


        if (
            valor < 0 ||
            !Number.isFinite(valor)
        ) {

            alert(
                "Informe um valor válido."
            );

            return;

        }


        const produtosAtualizados =
            JSON.parse(
                localStorage.getItem(
                    "produtosMercadinho"
                )
            ) || [];


        const produto =
            produtosAtualizados.find(
                function (item) {

                    return item.codigo === codigo;

                }
            );


        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;

        }


        const estoqueAnterior =
            Number(produto.estoque);


        produto.estoque =
            estoqueAnterior +
            quantidade;


        // ========================================
        // SALVAR NOVO ESTOQUE
        // ========================================

        localStorage.setItem(
            "produtosMercadinho",
            JSON.stringify(
                produtosAtualizados
            )
        );


        // ========================================
        // SALVAR MOVIMENTAÇÃO
        // ========================================

        const movimentacoes =
            JSON.parse(
                localStorage.getItem(
                    "movimentacoesMercadinho"
                )
            ) || [];


        const agora =
            new Date();


        const novaMovimentacao = {

            id:
                Date.now(),

            tipo:
                "entrada",

            categoria:
                "mercadoria",

            produto:
                produto.nome,

            codigo:
                produto.codigo,

            quantidade:
                quantidade,

            estoqueAnterior:
                estoqueAnterior,

            estoqueNovo:
                produto.estoque,

            valor:
                valor,

            impactoFinanceiro:
                -valor,

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
                agora.toISOString()

        };


        movimentacoes.push(
            novaMovimentacao
        );


        localStorage.setItem(
            "movimentacoesMercadinho",
            JSON.stringify(
                movimentacoes
            )
        );


        alert(
            "Entrada registrada com sucesso!\n\n" +
            "Produto: " +
            produto.nome +
            "\nQuantidade adicionada: " +
            quantidade +
            "\nNovo estoque: " +
            produto.estoque +
            "\nValor gasto: " +
            valor.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            )
        );


        fecharModalEntrada();


        // ATUALIZA A PÁGINA ADMIN
        window.location.reload();

    }
);


    mostrarUltimasVendas();
    // ========================================
// REGISTRAR SAÍDA
// ========================================

const botaoRegistrarSaida =
    document.querySelector(".saida-admin");

const modalSaida =
    document.querySelector("#modal-saida");

const fecharSaida =
    document.querySelector("#fechar-saida");

const descricaoSaida =
    document.querySelector("#descricao-saida");

const categoriaSaida =
    document.querySelector("#categoria-saida");

const valorSaida =
    document.querySelector("#valor-saida");

const confirmarSaida =
    document.querySelector("#confirmar-saida");


// ========================================
// ABRIR MODAL
// ========================================

botaoRegistrarSaida.addEventListener(
    "click",
    function () {

        descricaoSaida.value = "";

        categoriaSaida.value = "";

        valorSaida.value = "";


        modalSaida.classList.add(
            "modal-aberto"
        );


        descricaoSaida.focus();

    }
);


// ========================================
// FECHAR MODAL
// ========================================

function fecharModalSaida() {

    modalSaida.classList.remove(
        "modal-aberto"
    );

}


fecharSaida.addEventListener(
    "click",
    fecharModalSaida
);


modalSaida.addEventListener(
    "click",
    function (evento) {

        if (evento.target === modalSaida) {

            fecharModalSaida();

        }

    }
);


// ========================================
// CONFIRMAR SAÍDA
// ========================================

confirmarSaida.addEventListener(
    "click",
    function () {

        const descricao =
            descricaoSaida.value.trim();

        const categoria =
            categoriaSaida.value;

        const valor =
            Number(valorSaida.value);


        // DESCRIÇÃO
        if (descricao === "") {

            alert(
                "Informe a descrição da despesa."
            );

            descricaoSaida.focus();

            return;

        }


        // CATEGORIA
        if (categoria === "") {

            alert(
                "Selecione uma categoria."
            );

            return;

        }


        // VALOR
        if (
            valor <= 0 ||
            !Number.isFinite(valor)
        ) {

            alert(
                "Informe um valor válido."
            );

            valorSaida.focus();

            return;

        }


        // ========================================
        // BUSCAR MOVIMENTAÇÕES
        // ========================================

        const movimentacoes =
            JSON.parse(
                localStorage.getItem(
                    "movimentacoesMercadinho"
                )
            ) || [];


        const agora =
            new Date();


        // ========================================
        // CRIAR MOVIMENTAÇÃO
        // ========================================

        const novaMovimentacao = {

            id:
                Date.now(),

            tipo:
                "saida",

            categoria:
                categoria,

            descricao:
                descricao,

            valor:
                valor,

            impactoFinanceiro:
                -valor,

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
                agora.toISOString()

        };


        // ========================================
        // SALVAR
        // ========================================

        movimentacoes.push(
            novaMovimentacao
        );


        localStorage.setItem(
            "movimentacoesMercadinho",
            JSON.stringify(
                movimentacoes
            )
        );


        // ========================================
        // SUCESSO
        // ========================================

        alert(
            "Saída registrada com sucesso!\n\n" +
            "Descrição: " +
            descricao +
            "\nCategoria: " +
            categoria +
            "\nValor: " +
            valor.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            )
        );


        fecharModalSaida();

    }
);

});