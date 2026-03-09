// server.js - Configuração do Servidor MuscleLab

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const userRoutes = require('./userRoutes'); 
const dataRoutes = require('./dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * CONFIGURAÇÕES BÁSICAS
 * Aqui eu libero o acesso para outros endereços (CORS) e 
 * preparo o servidor para entender dados em formato JSON.
 */
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());

/**
 * ARQUIVOS DO SITE
 * Comando para o servidor entregar os arquivos da pasta 'Site' 
 * (HTML, CSS e as fotos) quando alguém acessar o endereço.
 */
app.use(express.static('Site'));

/**
 * DEFINIÇÃO DAS ROTAS
 * Separo o que é login/cadastro do que são as funções do usuário logado.
 */
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes); 

/**
 * LIGAR O SERVIDOR
 * Inicia o sistema na porta configurada (geralmente a 3000).
 */
app.listen(PORT, () => {
    console.log(`Servidor MuscleLab rodando na porta ${PORT}`);
});