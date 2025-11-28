const form = document.getElementById("senhaForm");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
let enviando = false; // Flag para evitar múltiplos envios

/**
 * Valida o formato do email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Mostra o loading spinner e desabilita o botão
 */
function mostrarLoading() {
    submitBtn.style.display = "none";
    loadingSpinner.style.display = "flex";
    submitBtn.disabled = true;
}

/**
 * Esconde o loading spinner e habilita o botão
 */
function esconderLoading() {
    submitBtn.style.display = "flex";
    loadingSpinner.style.display = "none";
    submitBtn.disabled = false;
    enviando = false;
}

/**
 * Valida o formulário antes de submeter
 */
form.addEventListener("submit", (e) => {
    // Se já está enviando, não permite novo envio
    if (enviando) {
        e.preventDefault();
        return;
    }

    const email = emailInput.value.trim();

    // Validar se email não está vazio
    if (!email) {
        e.preventDefault();
        alert("Por favor, insira seu e-mail");
        return;
    }

    // Validar formato do email
    if (!validarEmail(email)) {
        e.preventDefault();
        alert("Por favor, insira um e-mail válido");
        return;
    }

    // Marcar como enviando e mostrar loading
    enviando = true;
    mostrarLoading();
});

// Auto-focus no campo de email
emailInput.focus();