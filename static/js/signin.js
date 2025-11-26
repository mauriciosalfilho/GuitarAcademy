const form = document.getElementById("signinForm");

const validaCPF = function (cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    add = 0;
    for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
};

// Validação ao enviar o formulário
form.addEventListener("submit", (e) => {
    const cpf = document.getElementById('cpf');
    const cpfError = document.getElementById('cpfError');

    // Validar CPF
    if (!validaCPF(cpf.value)) {
        e.preventDefault();
        cpfError.style.display = 'block';
        cpf.style.borderColor = '#ff6b6b';
        return false;
    } else {
        cpfError.style.display = 'none';
        cpf.style.borderColor = '#2a2f36';
    }

    return true;
});

// Formatação de CPF
(function () {
    const cpfInput = document.getElementById("cpf");
    const cpfError = document.getElementById("cpfError");

    function formatCPF(value) {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        const parts = [];
        if (digits.length > 0) parts.push(digits.slice(0, 3));
        if (digits.length > 3) parts.push(digits.slice(3, 6));
        if (digits.length > 6) parts.push(digits.slice(6, 9));
        let formatted = parts.join(".");
        if (digits.length > 9) {
            formatted += (formatted ? "-" : "") + digits.slice(9, 11);
        }
        return formatted;
    }

    cpfInput.addEventListener("input", (e) => {
        const formatted = formatCPF(e.target.value);
        e.target.value = formatted;

        // Validação em tempo real quando o CPF tem 11 dígitos
        if (formatted.replace(/\D/g, "").length === 11) {
            if (!validaCPF(formatted)) {
                cpfError.style.display = 'block';
                cpfInput.style.borderColor = '#ff6b6b';
            } else {
                cpfError.style.display = 'none';
                cpfInput.style.borderColor = '#2a2f36';
            }
        } else {
            cpfError.style.display = 'none';
            cpfInput.style.borderColor = '#2a2f36';
        }
    });

    cpfInput.addEventListener("keydown", (e) => {
        const allowed = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "Tab",
            "Home",
            "End",
        ];
        if (allowed.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });

    cpfInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData(
            "text"
        );
        const digits = text.replace(/\D/g, "").slice(0, 11);
        cpfInput.value = formatCPF(digits);
    });
})();