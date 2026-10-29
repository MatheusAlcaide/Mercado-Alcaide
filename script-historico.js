document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ========================================
        // ELEMENTOS
        // ========================================

        const listaHistorico =
            document.querySelector("#lista-historico");

        const filtroTipo =
            document.querySelector("#filtro-tipo");

        const pesquisa =
            document.querySelector("#pesquisa-historico");

        const totalReposicao =
            document.querySelector("#total-reposicao");

        const totalDespesas =
            document.querySelector("#total-despesas");

        const totalGastos =
            document.querySelector("#total-gastos");


        // ========================================
        // FORMATAR DINHEIRO
        // ========================================

        function formatarDinheiro(valor) {

            return Number(valor).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

        }


        // ========================================
        // CARREGAR MOVIMENTAÇÕES
        // ========================================

        function carregarMovimentacoes() {

            return JSON.parse(
                localStorage.getItem(
                    "movimentacoesMercadinho"
                )
            ) || [];

        }


        // ========================================
        // RESUMO
        // ========================================

        function atualizarResumo() {

            const movimentacoes =
                carregarMovimentacoes();


            let reposicao = 0;

            let despesas = 0;


            movimentacoes.forEach(
                function (movimentacao) {

                    const valor =
                        Number(movimentacao.valor) || 0;


                    if (
                        movimentacao.tipo === "entrada"
                    ) {

                        reposicao += valor;

                    }


                    if (
                        movimentacao.tipo === "saida"
                    ) {

                        despesas += valor;

                    }

                }
            );


            totalReposicao.textContent =
                formatarDinheiro(reposicao);


            totalDespesas.textContent =
                formatarDinheiro(despesas);


            totalGastos.textContent =
                formatarDinheiro(
                    reposicao + despesas
                );

        }


        // ========================================
        // MOSTRAR HISTÓRICO
        // ========================================

        function mostrarHistorico() {

            let movimentacoes =
                carregarMovimentacoes();


            const tipoSelecionado =
                filtroTipo.value;


            const textoPesquisa =
                pesquisa.value
                    .trim()
                    .toLowerCase();


            // FILTRAR TIPO

            if (
                tipoSelecionado !== "todos"
            ) {

                movimentacoes =
                    movimentacoes.filter(
                        function (movimentacao) {

                            return (
                                movimentacao.tipo ===
                                tipoSelecionado
                            );

                        }
                    );

            }


            // PESQUISA

            if (textoPesquisa !== "") {

                movimentacoes =
                    movimentacoes.filter(
                        function (movimentacao) {

                            const produto =
                                movimentacao.produto || "";

                            const descricao =
                                movimentacao.descricao || "";

                            const categoria =
                                movimentacao.categoria || "";


                            const texto =
                                (
                                    produto +
                                    " " +
                                    descricao +
                                    " " +
                                    categoria
                                ).toLowerCase();


                            return texto.includes(
                                textoPesquisa
                            );

                        }
                    );

            }


            // MAIS RECENTE PRIMEIRO

            movimentacoes.sort(
                function (a, b) {

                    return new Date(
                        b.dataCompleta
                    ) - new Date(
                        a.dataCompleta
                    );

                }
            );


            listaHistorico.innerHTML = "";


            // NENHUMA MOVIMENTAÇÃO

            if (movimentacoes.length === 0) {

                listaHistorico.innerHTML = `
                    <div class="sem-movimentacoes">

                        <i class="fa-solid fa-clock-rotate-left"></i>

                        <p>
                            Nenhuma movimentação encontrada.
                        </p>

                    </div>
                `;

                return;

            }


            // ========================================
            // CRIAR LINHAS
            // ========================================

            movimentacoes.forEach(
                function (movimentacao) {

                    const linha =
                        document.createElement("div");


                    linha.classList.add(
                        "movimentacao-historico"
                    );


                    let tipoTexto = "";

                    let tipoClasse = "";

                    let descricao = "";


                    // ENTRADA DE MERCADORIA

                    if (
                        movimentacao.tipo === "entrada"
                    ) {

                        tipoTexto =
                            "Reposição";

                        tipoClasse =
                            "tipo-entrada";


                        descricao =
                            movimentacao.produto ||
                            "Entrada de mercadoria";

                    }


                    // DESPESA

                    else {

                        tipoTexto =
                            "Despesa";

                        tipoClasse =
                            "tipo-saida";


                        descricao =
                            movimentacao.descricao ||
                            "Despesa";

                    }


                    const categoria =
                        movimentacao.categoria ||
                        "-";


                    const valor =
                        Number(
                            movimentacao.valor
                        ) || 0;


                    linha.innerHTML = `

                        <div class="data-movimentacao">

                            <span>
                                ${movimentacao.data || "-"}
                            </span>

                            <small>
                                ${movimentacao.hora || ""}
                            </small>

                        </div>


                        <span
                            class="
                                tipo-movimentacao
                                ${tipoClasse}
                            "
                        >
                            ${tipoTexto}
                        </span>


                        <span>
                            ${descricao}
                        </span>


                        <span>
                            ${categoria}
                        </span>


                        <span class="valor-negativo">

                            - ${formatarDinheiro(valor)}

                        </span>

                    `;


                    listaHistorico.appendChild(
                        linha
                    );

                }
            );

        }


        // ========================================
        // FILTROS
        // ========================================

        filtroTipo.addEventListener(
            "change",
            mostrarHistorico
        );


        pesquisa.addEventListener(
            "input",
            mostrarHistorico
        );


        // ========================================
        // INICIAR
        // ========================================

        atualizarResumo();

        mostrarHistorico();

    }
);