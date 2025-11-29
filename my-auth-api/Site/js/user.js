

const API_BASE_URL = 'http://localhost:3000/api/data'; 
const userNameDisplay = document.getElementById('userNameDisplay');
const userPhoto = document.getElementById('userPhoto');
const logoutBtn = document.getElementById('logoutBtn');

// -----------------------------------------------------
// FUNÇÕES DE UTILIDADE E JWT
// -----------------------------------------------------
function checkAuth() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Sessão expirada ou não iniciada. Faça login novamente.');
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

/**
 * Carrega e exibe os dados do usuário (Nome)
 * @param {string} token - O JWT do usuário.
 */
async function loadUserData(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Envia o JWT
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            userNameDisplay.textContent = `Olá, ${data.profile.nome}!`;
            
        } else if (response.status === 403 || response.status === 401) {
            
            handleLogout('Sessão expirada. Faça login novamente.');
        } else {
            console.error('Falha ao carregar dados:', response.statusText);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
    }
}

/**
 * Realiza o logout, limpa o token e redireciona.
 * @param {string} message - Mensagem opcional para o alert.
 */
function handleLogout(message = 'Logout realizado com sucesso.') {
    localStorage.removeItem('userToken');
    if (message) alert(message);
    window.location.href = 'login.html';
}

// -----------------------------------------------------
// FUNÇÕES DE NAVEGAÇÃO DOS CARDS
// -----------------------------------------------------

function iniciarQuiz() {
    alert('Função Quiz: Redirecionando para a página de perguntas para montar o treino...');
    // window.location.href = 'quiz.html'; 
}

function abrirIMC() {
    alert('Função IMC: Redirecionando para a calculadora de IMC...');
    // window.location.href = 'imc.html';
}

function verTreino() {
    alert('Função Treino: Redirecionando para a visualização do plano de treino...');
    // window.location.href = 'treino.html';
}


// -----------------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuth(); // Verifica se está logado

    if (token) {
        loadUserData(token); // Carrega os dados do usuário
    }

    // Configura o botão de logout
    logoutBtn.addEventListener('click', () => {
        handleLogout();
    });
});