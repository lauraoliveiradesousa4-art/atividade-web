const formCadastro = document.getElementById("formCadastro");
const listaContatos = document.getElementById("listaContatos");
const btnLimpar = document.getElementById("btnLimpar");

let registros = JSON.parse(localStorage.getItem("contatos")) || [];

function mostrarContatos() {

    listaContatos.innerHTML = "";

    for (const contato of registros) {

        const div = document.createElement("div");

        div.innerHTML = `
            <p><strong>Nome:</strong> ${contato.nome}</p>
            <p><strong>Telefone:</strong> ${contato.telefone}</p>
            <p><strong>E-mail:</strong> ${contato.email}</p>
            <hr>
        `;

        listaContatos.appendChild(div);
    }
}

formCadastro.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    const novoContato = {
        nome: nome,
        telefone: telefone,
        email: email
    };

    registros.push(novoContato);

    localStorage.setItem("contatos", JSON.stringify(registros));

    mostrarContatos();

    formCadastro.reset();
});

btnLimpar.addEventListener("click", function() {

    registros = [];

    localStorage.removeItem("contatos");

    mostrarContatos();
});

mostrarContatos();