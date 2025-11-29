// dataRoutes.js (Rotas Protegidas para Perfil, IMC e Treino)
const express = require('express');
const db = require('./db');
const verifyToken = require('./authMiddleware'); // Middleware de autenticação JWT

const router = express.Router();

// -----------------------------------------------------
// ROTA 1: GET /api/data/profile (Buscar Dados do Perfil)
// -----------------------------------------------------
router.get('/profile', verifyToken, async (req, res) => {
    // O ID do usuário vem do JWT decodificado no middleware
    const userId = req.user.usuario_id; 

    try {
        const [rows] = await db.execute(
            'SELECT nome, sobrenome, nivel_muscle, objetivo, email FROM usuario WHERE usuario_id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({ 
            message: "Dados do perfil obtidos com sucesso!",
            profile: rows[0]
        });

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// -----------------------------------------------------
// ROTA 2: POST /api/data/imc (Registrar Novo IMC)
// -----------------------------------------------------
router.post('/imc', verifyToken, async (req, res) => {
    const userId = req.user.usuario_id;
    const { peso, altura } = req.body;

    if (!peso || !altura) {
        return res.status(400).json({ message: "Peso e altura são obrigatórios." });
    }
    
    // Simples validação de dados (pode ser mais robusta)
    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        return res.status(400).json({ message: "Peso e altura devem ser números positivos válidos." });
    }

    try {
        // fkUsuario, peso, altura, dtRegistro
        const [result] = await db.execute(
            'INSERT INTO imc (fkUsuario, peso, altura) VALUES (?, ?, ?)',
            [userId, peso, altura]
        );

        res.status(201).json({ 
            message: "Registro de IMC salvo com sucesso!",
            id_imc: result.insertId
        });

    } catch (error) {
        console.error("Erro ao registrar IMC:", error);
        res.status(500).json({ message: "Erro interno ao salvar IMC." });
    }
});

// -----------------------------------------------------
// ROTA 3: POST /api/data/treino (Registrar Check-in de Treino)
// -----------------------------------------------------
router.post('/treino', verifyToken, async (req, res) => {
    const userId = req.user.usuario_id;
    const { treino, status_treino } = req.body;
    
    if (!treino || !status_treino) {
        return res.status(400).json({ message: "Treino e status de treino são obrigatórios." });
    }
    
    // Validação para garantir que o status_treino é válido (conforme o CHECK do SQL)
    const statusValidos = ['Intenso', 'Leve', 'Mediano'];
    if (!statusValidos.includes(status_treino)) {
        return res.status(400).json({ 
            message: `Status inválido. Use um destes: ${statusValidos.join(', ')}` 
        });
    }

    try {
        // fkUsuario, treino, status_treino, dtHora
        const [result] = await db.execute(
            'INSERT INTO checkTreino (fkUsuario, treino, status_treino) VALUES (?, ?, ?)',
            [userId, treino, status_treino]
        );

        res.status(201).json({ 
            message: "Check-in de treino registrado!",
            id_treino: result.insertId
        });

    } catch (error) {
        console.error("Erro ao registrar treino:", error);
        res.status(500).json({ message: "Erro interno ao salvar check-in de treino." });
    }
});


module.exports = router;