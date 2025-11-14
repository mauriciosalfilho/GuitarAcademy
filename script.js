function escolherPlano(plano) {
  window.location.href = "signup.html?plano=" + encodeURIComponent(plano);
}

function handleNewsletter(event) {
  event.preventDefault();
  const msg = document.getElementById("msg");
  msg.textContent = "Inscrito com sucesso!";
}

function getPlanoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("plano") || "não informado";
}

function mostrarPlanoEscolhido() {
  const plano = getPlanoFromUrl();
  const paraPlano = document.getElementById("plano-escolhido-text");
  paraPlano.textContent = `Você escolheu o plano: ${plano}`;
}

(function () {
  const cpfInput = document.getElementById("cpf");

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
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 11);
    cpfInput.value = formatCPF(digits);
  });
})();

(function () {
  const telefoneInput = document.getElementById("telefone");
  function formatTelefone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let formatted = "";
    if (digits.length > 0) formatted += "(" + digits.slice(0, 2);
    if (digits.length >= 3) formatted += ") " + digits.slice(2, 7);
    if (digits.length >= 8) formatted += "-" + digits.slice(7, 11);
    return formatted;
  }

  telefoneInput.addEventListener("input", (e) => {
    const formatted = formatTelefone(e.target.value);
    e.target.value = formatted;
  });
  telefoneInput.addEventListener("keydown", (e) => {
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
  telefoneInput.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 11);
    telefoneInput.value = formatTelefone(digits);
  });
})();
