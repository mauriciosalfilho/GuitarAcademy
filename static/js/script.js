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
            
            if (data.success) {
                // Sucesso: email inscrito
                msgDiv.classList.add('success');
                msgDiv.textContent = data.message;
                form.reset();
                
                // Ocultar mensagem após 5 segundos
                setTimeout(() => {
                    msgDiv.classList.add('hidden');
                    msgDiv.classList.remove('success');
                }, 5000);
            } else if (data.duplicate) {
                // Email já cadastrado na newsletter
                msgDiv.classList.add('info');
                msgDiv.textContent = data.message;
                
                // Ocultar mensagem após 5 segundos
                setTimeout(() => {
                    msgDiv.classList.add('hidden');
                    msgDiv.classList.remove('info');
                }, 5000);
            } else {
                // Erro genérico
                msgDiv.classList.add('error');
                msgDiv.textContent = data.error || 'Erro ao inscrever. Tente novamente.';
                
                // Ocultar mensagem após 5 segundos
                setTimeout(() => {
                    msgDiv.classList.add('hidden');
                    msgDiv.classList.remove('error');
                }, 5000);
            }
        })
        .catch(error => {
            msgDiv.classList.remove('hidden', 'success', 'info');
            msgDiv.classList.add('error');
            msgDiv.textContent = 'Erro ao inscrever. Tente novamente.';
            console.error('Erro:', error);
            
            // Ocultar mensagem após 5 segundos
            setTimeout(() => {
                msgDiv.classList.add('hidden');
                msgDiv.classList.remove('error');
            }, 5000);
        });
});