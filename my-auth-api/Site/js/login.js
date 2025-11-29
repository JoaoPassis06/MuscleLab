// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDisplay = document.getElementById('message');
    const API_URL = 'http://localhost:3000/api/users/login'; // ENDPOINT da sua API

    // Função para lidar com o envio do formulário
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

        // Limpa mensagens de erro anteriores
        messageDisplay.textContent = '';
        messageDisplay.className = 'error-message';

        // 1. Coleta dos dados do formulário
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        try {
            // 2. Envio da requisição POST para a API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Sucesso: Guarda o JWT e redireciona
                
                // Armazena o token de acesso (IMPORTANTE para as rotas protegidas)
                localStorage.setItem('userToken', data.token); 
                
                // Exibe mensagem de sucesso
                messageDisplay.textContent = 'Login bem-sucedido! Redirecionando...';
                messageDisplay.className = 'success-message';

                window.location.href = '/user.html';
                
            } else {
                // 4. Falha: Exibe a mensagem de erro da API
                messageDisplay.textContent = data.message || 'Erro ao fazer login. Tente novamente.';
            }

        } catch (error) {
            console.error('Erro de conexão ou requisição:', error);
            messageDisplay.textContent = 'Não foi possível conectar ao servidor da API.';
        }
    });
});
