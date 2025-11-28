document.getElementById('newsletter-registered').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const msgDiv = document.getElementById('msg');
    const form = this;

    // Preparar dados do formulário
    const formData = new FormData();
    formData.append('email', email);

    // Submeter via AJAX
    fetch('/newsletter', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            msgDiv.classList.remove('hidden', 'error');
            msgDiv.classList.add('success');
            msgDiv.textContent = data.message;

            // Limpar o campo de email após sucesso
            form.reset();

            // Ocultar mensagem após 5 segundos
            setTimeout(() => {
                msgDiv.classList.add('hidden');
                msgDiv.classList.remove('success');
            }, 5000);
        })
        .catch(error => {
            msgDiv.classList.remove('hidden', 'success');
            msgDiv.classList.add('error');
            msgDiv.textContent = 'Erro ao inscrever. Tente novamente.';
            console.error('Erro:', error);
        });
});