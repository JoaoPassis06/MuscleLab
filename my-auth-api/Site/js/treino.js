// js/treino.js

const listaExercicios = document.getElementById('lista-exercicios');
const statusSelect = document.getElementById('status-treino');
const finalizarBtn = document.getElementById('btn-finalizar-treino');
const feedbackMsg = document.getElementById('mensagem-feedback');
const dataDisplay = document.getElementById('data-hoje');

const API_TREINO_URL = 'http://localhost:3000/api/data/treino'; 


const treinoSimulado = [
    { name: "Agachamento Livre", sets: "4x10-12", isCompleted: false },
    { name: "Supino Reto com Halteres", sets: "3x8", isCompleted: false },
    { name: "Remada Curvada", sets: "3x10", isCompleted: false },
    { name: "Elevação Lateral", sets: "3x15", isCompleted: false },
    { name: "Abdominais na Máquina", sets: "4xFalha", isCompleted: false }
];

function marcarItem(iconeElemento) {
    const itemLista = iconeElemento.closest('.item-exercicio');
    itemLista.classList.toggle('completed');
    
    iconeElemento.classList.toggle('far');
    iconeElemento.classList.toggle('fas');
}


function carregarExercicios(exercicios) {
    listaExercicios.innerHTML = ''; 

    const cabecalhoHtml = `
        <li class="cabecalho-tabela">
            <div>EXERCÍCIO</div>
            <div>SÉRIES/REPS</div>
            <div style="text-align: center;"><i class="fas fa-check"></i></div>
        </li>`;
    listaExercicios.innerHTML = cabecalhoHtml;

    exercicios.forEach(ex => {
        const li = document.createElement('li');
        li.classList.add('item-exercicio');
        
        li.innerHTML = `
            <div class="detalhes">
                <span class="nome-exercicio">${ex.name}</span>
            </div>
            <div class="coluna-series">${ex.sets}</div>
            <i class="far fa-check-circle icone-check" onclick="marcarItem(this)"></i>
        `;
        listaExercicios.appendChild(li);
    });
}

function definirData() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = new Date().toLocaleDateString('pt-BR', options);
    dataDisplay.textContent = date.charAt(0).toUpperCase() + date.slice(1);
}


async function finalizarTreino() {
    const token = localStorage.getItem('userToken');
    const status_treino = statusSelect.value;
    
    if (!token) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    if (!status_treino) {
        alert('Por favor, avalie a intensidade do seu treino antes de finalizar.');
        return;
    }

    const exerciciosConcluidos = Array.from(listaExercicios.querySelectorAll('.item-exercicio.completed'))
        .map(item => item.querySelector('.nome-exercicio').textContent)
        .join(', ');
    
    const resumoTreino = `Treino: ${exerciciosConcluidos || 'Nenhum exercício marcado.'}`;

    try {
        const response = await fetch(API_TREINO_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                treino: resumoTreino,
                status_treino: status_treino
            })
        });

        const data = await response.json();

        if (response.ok) {
            feedbackMsg.textContent = `✅ ${data.message}`;
            finalizarBtn.disabled = true;
            statusSelect.disabled = true;
        } else {
            feedbackMsg.textContent = `❌ Erro: ${data.message}`;
        }

    } catch (error) {
        console.error('Erro de rede:', error);
        feedbackMsg.textContent = '❌ Falha ao conectar com o servidor.';
    }
}


finalizarBtn.onclick = finalizarTreino;

document.addEventListener('DOMContentLoaded', () => {
    definirData();
    carregarExercicios(treinoSimulado);
});

    (function () {
        const observer = new MutationObserver(atualizarProgresso);

        function atualizarProgresso() {
            const todos      = document.querySelectorAll('#lista-exercicios .item-exercicio');
            const concluidos = document.querySelectorAll('#lista-exercicios .item-exercicio.completed');
            const total      = todos.length;
            const feitos     = concluidos.length;

            const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

            const fill  = document.getElementById('barra-fill');
            const label = document.getElementById('label-progresso');
            if (fill)  fill.style.width  = pct + '%';
            if (label) label.textContent = feitos + ' / ' + total + ' exercícios';
        }

        const lista = document.getElementById('lista-exercicios');
        if (lista) observer.observe(lista, { childList: true, subtree: true, attributes: true });

        const listaObs = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach((node, i) => {
                    if (node.classList && node.classList.contains('item-exercicio')) {
                        node.style.animationDelay = (i * 60) + 'ms';
                    }
                });
            });
            atualizarProgresso();
        });
        if (lista) listaObs.observe(lista, { childList: true });
    })();