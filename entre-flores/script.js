const  temaBtn = document.getElementById("temaBtn");

temaBtn.addEventListener("click", () => {
    document.body.classList.toggle("escuro");

    if (document.body.classList.contains("escuro")){
        temaBtn.textContent = "☀️";
    } else {
        temaBtn.textContent = "🌙";
    }
});

const galeriaBtn = document.getElementById("galeriaBtn");

galeriaBtn.addEventListener("click", () => {
    document.getElementById("galeria").scrollIntoView({
        behavior: "smooth"
    });
});

const botoesMomento = document.querySelectorAll(".momentoBtn");
const textoMomento = document.getElementById("textoMomento");

botoesMomento.forEach((botao) => {
    
    botao.addEventListener("click", () => {
        
        const momento = botao.dataset.momento;

        if (momento === "manha") {
            textoMomento.textContent =
                "Pela manhã, a luz é mais suave e destaca os tons delicador das flores.";

        }

        else if (momento === "tarde") {
            textoMomento.textContent =
            "À tarde, a luz pode revelar cores mais intensas e sombras diferentes.";
        }

        else if (momento === "noite") {
            textoMomento.textContent =
            "À noite, a ausência da luz natural cria outra atmosfera e muda a forma de observar a flor.";            
        }
    
    });

});

const formulario = document.getElementById("formulario");
const mensagemForm = document.getElementById("mensagemForm");

formulario.addEventListener("submit", (event) => {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    mensagemForm.textContent =
    `Obrigada pela mensagem, ${nome}! 🌸`;
});
