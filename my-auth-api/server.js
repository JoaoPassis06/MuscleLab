// server.js - Versão Final e Correta

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Importa a conexão com o DB

// 🚨 CORREÇÃO: As variáveis de rota devem ser declaradas AQUI
const userRoutes = require('./userRoutes'); 
const dataRoutes = require('./dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Middlewares de API ---
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());


// --- 2. Middleware para Servir Arquivos Estáticos ---
// Configura o Express para servir arquivos estáticos (HTML, CSS, JS) 
// da pasta 'Site'. (Isso requer que a pasta 'Site' esteja no mesmo nível que server.js)
app.use(express.static('Site'));


// --- 3. Rotas de API ---

// Rotas de Cadastro e Login (Não Protegidas)
app.use('/api/users', userRoutes);

// Rotas Protegidas (IMC, Perfil, etc.)
app.use('/api/data', dataRoutes); 


// --- 4. Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor MuscleLab rodando na porta ${PORT}`);
});