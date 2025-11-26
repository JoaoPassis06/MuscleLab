// server.js (Adicionando CORS)
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importe o CORS
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
// Isso permite que qualquer domínio (ou você pode especificar o seu) acesse a API
app.use(cors()); 

// Outros Middlewares
app.use(bodyParser.json());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// server.js (Adicionando dataRoutes)
// ...
const userRoutes = require('./userRoutes'); 
const dataRoutes = require('./dataRoutes');

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes); // <-- CONECTANDO AS ROTAS PROTEGIDAS

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
