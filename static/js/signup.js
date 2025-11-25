const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const form = document.getElementById("wizardForm");

nextBtn.addEventListener("click", () => {
  const email = document.getElementById("email");
  const telefone = document.getElementById("telefone");
  const cpf = document.getElementById("cpf");
  const cpfError = document.getElementById("cpfError");

  if (email.value && telefone.value && cpf.value) {
    if (!validaCPF(cpf.value)) {
      cpfError.style.display = "block";
      cpf.style.borderColor = "#ff6b6b";
      return;
    }

    cpfError.style.display = "none";
    cpf.style.borderColor = "#2a2f36";

    page1.classList.add("slide-out-left");

    setTimeout(() => {
      page1.classList.add("hidden");
      page1.classList.remove("slide-out-left");
      page2.classList.remove("hidden");
      page2.classList.add("slide-in-left");

      setTimeout(() => {
        page2.classList.remove("slide-in-left");
      }, 400);
    }, 400);
  } else {
    email.reportValidity();
    telefone.reportValidity();
    cpf.reportValidity();
  }
});

backBtn.addEventListener("click", () => {
  page2.classList.add("slide-out-right");

  setTimeout(() => {
    page2.classList.add("hidden");
    page2.classList.remove("slide-out-right");
    page1.classList.remove("hidden");
    page1.classList.add("slide-in-right");

    setTimeout(() => {
      page1.classList.remove("slide-in-right");
    }, 400);
  }, 400);
});

form.addEventListener("submit", (e) => {
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");
  const passwordError = document.getElementById("passwordError");

  if (password.value !== confirmPassword.value) {
    e.preventDefault();
    passwordError.style.display = "block";
    password.style.borderColor = "#ff6b6b";
    confirmPassword.style.borderColor = "#ff6b6b";
    return false;
  }
  return true;
});

// Adiciona validação em tempo real
document
  .getElementById("confirm_password")
  .addEventListener("input", function () {
    const password = document.getElementById("password");
    const confirmPassword = this;
    const passwordError = document.getElementById("passwordError");

    if (password.value !== confirmPassword.value) {
      passwordError.style.display = "block";
      password.style.borderColor = "#ff6b6b";
      confirmPassword.style.borderColor = "#ff6b6b";
    } else {
      passwordError.style.display = "none";
      password.style.borderColor = "#2a2f36";
      confirmPassword.style.borderColor = "#2a2f36";
    }
  });

const validaCPF = function (cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf == "") return false;
  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  )
    return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  return true;
};

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
        cpfError.style.display = "block";
        cpfInput.style.borderColor = "#ff6b6b";
      } else {
        cpfError.style.display = "none";
        cpfInput.style.borderColor = "#2a2f36";
      }
    } else {
      cpfError.style.display = "none";
      cpfInput.style.borderColor = "#2a2f36";
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
