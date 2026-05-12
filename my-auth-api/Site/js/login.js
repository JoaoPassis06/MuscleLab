// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDisplay = document.getElementById('message');
    const API_URL = 'http://localhost:3000/api/users/login';


    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 


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

                localStorage.setItem('userToken', data.token); 
                
                
                messageDisplay.textContent = 'Login bem-sucedido! Redirecionando...';
                messageDisplay.className = 'success-message';

                window.location.href = '/user.html';
                
            } else {

                messageDisplay.textContent = data.message || 'Erro ao fazer login. Tente novamente.';
            }

        } catch (error) {
            console.error('Erro de conexão ou requisição:', error);
            messageDisplay.textContent = 'Não foi possível conectar ao servidor da API.';
        }
    });
});
