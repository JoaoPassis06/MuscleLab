
// JavaScript completo para a tela de cadastro de etapa única (MuscleLab)

// -----------------------------------------------------
// REFERÊNCIAS AOS ELEMENTOS DOM
// -----------------------------------------------------

// Elementos do Modal de Erro
const errorModal = document.getElementById('errorModal');
const modalMsgErros = document.getElementById('modal_msg_erros');

// Referências aos inputs e selects
const iptNome = document.getElementById('ipt_nome');
const iptSobrenome = document.getElementById('ipt_sobrenome');
const iptNivel = document.getElementById('ipt_nivel_muscle');
const iptObjetivo = document.getElementById('ipt_objetivo');
const iptEmail = document.getElementById('ipt_email');
const iptSenha = document.getElementById('ipt_senha');
const iptConfirmeSenha = document.getElementById('ipt_confirme_senha');

// Elementos da barra de Força da Senha
const spanForca = document.getElementById('span_forca_senha');
const barrasForca = [
    document.getElementById('div_barra_0'),
    document.getElementById('div_barra_1'),
    document.getElementById('div_barra_2'),
];

// -----------------------------------------------------
// FUNÇÕES DE UTILIDADE E MODAL
// -----------------------------------------------------

/**
 * Fecha o modal de erro. Chamado pelo botão "OK".
 */
function fecharModal() {
    errorModal.classList.remove('show');
}

/**
 * Exibe a mensagem de erro formatada no corpo do modal e o abre.
 * @param {HTMLElement} elementoModalBody - O corpo do modal onde a mensagem será inserida.
 * @param {string} mensagem - A mensagem de erro (já formatada em <ul><li>).
 */
function exibirErro(elementoModalBody, mensagem) {
    elementoModalBody.innerHTML = mensagem;
    errorModal.classList.add('show');
}

/**
 * Analisa a força da senha para feedback visual (mantido).
 * @param {string} senha - A senha digitada.
 * @returns {number} O score de força (máximo 5).
 */
function analisarForcaSenha(senha) {
    let score = 0;
    if (senha.length >= 8) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[a-z]/.test(senha)) score++;
    if (/\d/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++; 
    return score;
}

// Event Listener para atualizar a barra de força da senha em tempo real
if (iptSenha) {
    iptSenha.addEventListener('input', () => {
        const score = analisarForcaSenha(iptSenha.value);
        const maxBarras = 3; 

        for (let i = 0; i < maxBarras; i++) {
            barrasForca[i].style.backgroundColor = 'transparent';
        }

        let forcaText = 'Insegura';
        let corBarra = '#e55353'; // Vermelho

        if (score >= 5) {
            forcaText = 'Forte';
            corBarra = '#5cb85c'; // Verde
            for (let i = 0; i < maxBarras; i++) barrasForca[i].style.backgroundColor = corBarra;
        } else if (score >= 3) {
            forcaText = 'Média';
            corBarra = '#ffc107'; // Amarelo
            for (let i = 0; i < 2; i++) barrasForca[i].style.backgroundColor = corBarra;
        } else if (score >= 1) {
            forcaText = 'Fraca';
            corBarra = '#f0ad4e'; // Laranja
            barrasForca[0].style.backgroundColor = corBarra;
        }
        
        spanForca.textContent = forcaText;
        spanForca.style.color = corBarra;
    });
}

// -----------------------------------------------------
// FUNÇÃO PRINCIPAL: FINALIZAR CADASTRO E ENVIAR PARA API
// -----------------------------------------------------

/**
 * Valida todos os campos do formulário e envia os dados para a API.
 * @param {Event} event - O evento de submissão do formulário.
 */
async function finalizarCadastro(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    let erroGeral = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // --- 1. VALIDAÇÃO DOS DADOS PESSOAIS E METAS ---
    if (iptNome.value.length < 2) {
        erroGeral += '<li>O <strong>Nome</strong> deve ter no mínimo 2 caracteres.</li>';
    }
    if (iptSobrenome.value.length < 2) {
        erroGeral += '<li>O <strong>Sobrenome</strong> deve ter no mínimo 2 caracteres.</li>';
    }
    if (iptNivel.value === '') {
        erroGeral += '<li>Selecione seu <strong>nível</strong> na academia.</li>';
    }
    if (iptObjetivo.value === '') {
        erroGeral += '<li>Selecione seu <strong>objetivo</strong> principal.</li>';
    }

    // --- 2. VALIDAÇÃO DAS CREDENCIAIS ---
    if (!emailRegex.test(iptEmail.value)) {
        erroGeral += '<li>Insira um <strong>email</strong> válido.</li>';
    }
    if (iptSenha.value.length < 8) {
        erroGeral += '<li>A <strong>senha</strong> deve ter no mínimo 8 caracteres.</li>';
    }
    if (iptSenha.value !== iptConfirmeSenha.value) {
        erroGeral += '<li>As senhas <strong>não coincidem</strong>.</li>';
    }
    if (analisarForcaSenha(iptSenha.value) < 3) {
        erroGeral += '<li>A <strong>senha</strong> é muito fraca. Tente misturar letras, números e símbolos.</li>';
    }

    if (erroGeral !== '') {
        // Exibe os erros no Modal e para o processo
        exibirErro(modalMsgErros, `<ul>${erroGeral}</ul>`);
        return; 
    }

    // --- 3. COLETA E ENVIO PARA A API ---
    const nome = iptNome.value;
    const sobrenome = iptSobrenome.value;
    const nivel_muscle = iptNivel.value;
    const objetivo = iptObjetivo.value;
    const email = iptEmail.value;
    const senha = iptSenha.value;

    const API_URL = 'http://localhost:3000/api/users/register'; // endpoint

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sobrenome, nivel_muscle, objetivo, email, senha })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Cadastro realizado com sucesso! Redirecionando para o login.');
            window.location.href = 'login.html'; // Redireciona
        } else {
            // Erro vindo do Backend (ex: email duplicado)
            exibirErro(modalMsgErros, `<ul><li>${data.message || 'Erro no cadastro. Tente novamente.'}</li></ul>`);
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        exibirErro(modalMsgErros, '<ul><li>Não foi possível conectar ao servidor da API. Verifique se o backend está rodando.</li></ul>');
    }
}