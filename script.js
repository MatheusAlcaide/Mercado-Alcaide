function atualizarDataHora() {

    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");

    const dataAtual = `${dia}/${mes}/${ano}`;
    const horaAtual = `${horas}:${minutos}`;

    const elementoData = document.querySelector("#data-atual");
    const elementoHora = document.querySelector("#hora-atual");

    if (elementoData) {
        elementoData.textContent = dataAtual;
    }

    if (elementoHora) {
        elementoHora.textContent = horaAtual;
    }

}
const acessoAdmin = document.querySelector("#acesso-admin");

if (acessoAdmin) {

    acessoAdmin.addEventListener("dblclick", function () {

        const senha = prompt("Digite a senha administrativa:");

        if (senha === "1234") {

            window.location.href = "admin.html";

        } else if (senha !== null) {

            alert("Senha incorreta.");

        }

    });

}

atualizarDataHora();

setInterval(atualizarDataHora, 1000);