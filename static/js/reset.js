const form = document.getElementById("resetForm");
const novaSenhaInput = document.getElementById("nova-senha");
const confirmarSenhaInput = document.getElementById("confirmar-senha");
const senhaError = document.getElementById("senhaError");
const confirmarError = document.getElementById("confirmarError");
const forcaBar = document.getElementById("forcaBar");
const indicadorForca = document.getElementById("indicadorForca");

// ===== FUNÇÕES DE VALIDAÇÃO =====

/**
 * Calcula a força de uma senha (0-100)
 * Critérios: comprimento, maiúsculas, minúsculas, números, caracteres especiais
 */
function calcularForcaSenha(senha) {
    let forca = 0;

    // Comprimento
    if (senha.length >= 6) forca += 20;
    if (senha.length >= 10) forca += 10;
    if (senha.length >= 15) forca += 10;

    // Maiúsculas
    if (/[A-Z]/.test(senha)) forca += 15;

    // Minúsculas
    if (/[a-z]/.test(senha)) forca += 15;

    // Números
    if (/[0-9]/.test(senha)) forca += 15;

    // Caracteres especiais
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) forca += 15;

    return Math.min(forca, 100);
}

/**
 * Atualiza a cor e largura da barra de força
 */
function atualizarIndicadorForca(forca) {
    forcaBar.style.width = forca + "%";

    if (forca < 30) {
        forcaBar.style.backgroundColor = "#ff6b6b"; // Vermelho - Fraca
    } else if (forca < 60) {
        forcaBar.style.backgroundColor = "#ffa500"; // Laranja - Média
    } else if (forca < 85) {
        forcaBar.style.backgroundColor = "#73adff"; // Azul - Boa
    } else {
        forcaBar.style.backgroundColor = "#4caf50"; // Verde - Forte
    }
}

/**
 * Valida se as senhas correspondem
 */
function validarCorrespondencia() {
    if (
        novaSenhaInput.value &&
        confirmarSenhaInput.value &&
        novaSenhaInput.value !== confirmarSenhaInput.value
    ) {
        confirmarError.style.display = "block";
        confirmarError.textContent = "As senhas não correspondem";
        confirmarSenhaInput.style.borderColor = "#ff6b6b";
        return false;
    } else {
        confirmarError.style.display = "none";
        confirmarSenhaInput.style.borderColor = "#2a2f36";
        return true;
    }
}

/**
 * Valida comprimento mínimo da senha
 */
function validarComprimento(senha) {
    if (senha.length < 6) {
        senhaError.style.display = "block";
        senhaError.textContent = "Mínimo 6 caracteres";
        novaSenhaInput.style.borderColor = "#ff6b6b";
        return false;
    } else {
        senhaError.style.display = "none";
        novaSenhaInput.style.borderColor = "#2a2f36";
        return true;
    }
}


/**
 * Atualizar indicador de força enquanto digita
 */
novaSenhaInput.addEventListener("input", (e) => {
    const senha = e.target.value;

    if (senha.length > 0) {
        indicadorForca.style.display = "block";
        const forca = calcularForcaSenha(senha);
        atualizarIndicadorForca(forca);
        validarComprimento(senha);
    } else {
        indicadorForca.style.display = "none";
        senhaError.style.display = "none";
        novaSenhaInput.style.borderColor = "#2a2f36";
    }

    // Validar correspondência em tempo real
    if (confirmarSenhaInput.value) {
        validarCorrespondencia();
    }
});

/**
 * Validar correspondência de senhas enquanto digita a confirmação
 */
confirmarSenhaInput.addEventListener("input", (e) => {
    if (novaSenhaInput.value) {
        validarCorrespondencia();
    }
});

/**
 * Validação ao submeter o formulário
 */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const novaSenha = novaSenhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    // Validar campos vazios
    if (!novaSenha || !confirmarSenha) {
        alert("Todos os campos são obrigatórios");
        return false;
    }

    // Validar comprimento
    if (!validarComprimento(novaSenha)) {
        return false;
    }

    // Validar correspondência
    if (!validarCorrespondencia()) {
        return false;
    }

    // Se tudo está válido, submeter o formulário
    form.submit();
});

// ===== INICIALIZAÇÃO =====

// Auto-focus no primeiro campo
novaSenhaInput.focus();