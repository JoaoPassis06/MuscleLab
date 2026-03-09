// js/quiz.js

const quizData = [
    {
        question: "1. Qual é o seu principal objetivo com o treino?",
        options: ["Hipertrofia (Ganho de Massa)", "Definição Muscular e Perda de Gordura", "Melhora da Resistência/Cardio", "Manutenção da Saúde Geral"]
    },
    {
        question: "2. Quantos dias por semana você consegue treinar com consistência?",
        options: ["1-2 dias", "3 dias", "4-5 dias", "6-7 dias"]
    },
    {
        question: "3. Qual a sua experiência atual com o levantamento de peso?",
        options: ["Iniciante (Pouca ou nenhuma experiência)", "Intermediário (Conheço os exercícios básicos)", "Avançado (Consigo treinar com alta intensidade e boa forma)"]
    },
    {
        question: "4. Quanto tempo você costuma dedicar a cada sessão de treino?",
        options: ["30 - 45 minutos", "45 - 60 minutos", "60 - 90 minutos", "Mais de 90 minutos"]
    },
    {
        question: "5. Qual tipo de exercício cardio você prefere incluir?",
        options: ["HIIT (Intervalos de alta intensidade)", "Cardio de baixa intensidade e longa duração (LISS)", "Prefiro não incluir cardio", "Misto (Incluo os dois tipos)"]
    },
    {
        question: "6. Qual parte do corpo você prioriza no momento?",
        options: ["Inferior (Pernas e Glúteos)", "Superior (Peito, Costas e Braços)", "Corpo Inteiro (Full Body)", "Core (Abdômen e Lombar)"]
    },
    {
        question: "7. Onde você planeja realizar a maioria dos seus treinos?",
        options: ["Academia (Com acesso a máquinas e pesos livres)", "Em casa (Com pesos leves ou peso corporal)", "Ao ar livre (Parques e pistas)", "Misto (Casa e Academia)"]
    },
    {
        question: "8. Qual seu nível de tolerância à dor muscular pós-treino (DOMS)?",
        options: ["Baixo (Preciso de treinos leves)", "Médio (Consigo me recuperar em 1-2 dias)", "Alto (Prefiro treinos intensos que gerem DOMS)"]
    },
    {
        question: "9. Você tem alguma restrição física ou lesão atual que afete os exercícios?",
        options: ["Sim, lesão crônica ou dor na coluna/joelhos", "Sim, pequenas dores que exigem adaptação", "Não, mas prefiro evitar exercícios de alto impacto", "Não, estou 100% apto"]
    },
    {
        question: "10. Qual nível de descanso e recuperação você costuma ter por noite?",
        options: ["Menos de 6 horas (Insuficiente)", "6-7 horas (Ok, mas posso melhorar)", "7-8 horas (Ideal)", "Mais de 8 horas (Excelente)"]
    }
];

const textoPergunta = document.getElementById('texto-pergunta');
const containerOpcoes = document.getElementById('container-opcoes');
const botaoAnterior = document.getElementById('btn-anterior');
const botaoProximo = document.getElementById('btn-proximo');
const botaoFinalizar = document.getElementById('btn-finalizar');
const displayPerguntaAtual = document.getElementById('pergunta-atual');

let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);

/**
 * CARREGAR PERGUNTA
 * Aqui eu limpo as opções anteriores e mostro a pergunta atual.
 * Se você já tiver respondido antes, eu deixo o botão marcado.
 */
function loadQuestion(index) {
    if (index >= 0 && index < quizData.length) {
        currentQuestionIndex = index;
        const q = quizData[index];
        
        textoPergunta.textContent = q.question;
        displayPerguntaAtual.textContent = index + 1;
        
        containerOpcoes.innerHTML = '';
        
        q.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.classList.add('botao-opcao');
            button.textContent = option;
            button.onclick = () => selectOption(i, button);
            
            if (userAnswers[index] === i) {
                button.classList.add('selecionado');
            }
            containerOpcoes.appendChild(button);
        });

        updateNavigationButtons();
    }
}

/**
 * SELECIONAR OPÇÃO
 * Quando você clica em uma resposta, eu guardo a escolha
 * e libero o botão de "Próximo".
 */
function selectOption(optionIndex, selectedButton) {
    userAnswers[currentQuestionIndex] = optionIndex;
    
    containerOpcoes.querySelectorAll('.botao-opcao').forEach(btn => {
        btn.classList.remove('selecionado');
    });
    selectedButton.classList.add('selecionado');
    
    updateNavigationButtons();
}

/**
 * CONTROLE DOS BOTÕES
 * Aqui eu decido quando mostrar o botão "Anterior", "Próximo" ou "Finalizar".
 * Você só pode avançar se tiver selecionado uma resposta.
 */
function updateNavigationButtons() {
    botaoAnterior.disabled = currentQuestionIndex === 0;

    const currentAnswered = userAnswers[currentQuestionIndex] !== null;
    botaoProximo.disabled = !currentAnswered || currentQuestionIndex === quizData.length - 1;

    if (currentQuestionIndex === quizData.length - 1 && currentAnswered) {
        botaoFinalizar.style.display = 'inline-block';
        botaoProximo.style.display = 'none';
    } else {
        botaoFinalizar.style.display = 'none';
        botaoProximo.style.display = 'inline-block';
    }
}

/**
 * FINALIZAR QUIZ
 * Verifica se todas as perguntas foram respondidas e te leva para a página de treino.
 */
function finishQuiz() {
    const totalAnswered = userAnswers.filter(answer => answer !== null).length;

    if (totalAnswered < quizData.length) {
        alert(`Você respondeu ${totalAnswered} de ${quizData.length}. Responda todas para continuar!`);
        return;
    }

    alert("Quiz concluído com sucesso!");
    window.location.href = 'treino.html'; 
}

/**
 * CONFIGURAÇÃO DOS CLIQUES
 * Define o que acontece ao clicar nos botões de navegação.
 */
botaoAnterior.onclick = () => loadQuestion(currentQuestionIndex - 1);
botaoProximo.onclick = () => loadQuestion(currentQuestionIndex + 1);
botaoFinalizar.onclick = finishQuiz;

/**
 * INÍCIO
 * Assim que a página carrega, eu mostro a primeira pergunta.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion(0);
});