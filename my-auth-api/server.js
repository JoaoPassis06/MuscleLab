require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes'); 
const dataRoutes = require('./dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança e parsing
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS do Frontend)
app.use(express.static('Site'));

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Servidor MuscleLab rodando na porta ${PORT}`);
});