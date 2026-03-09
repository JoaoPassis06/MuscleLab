const express = require('express');
const db = require('./db');
const verifyToken = require('./authMiddleware');

const router = express.Router();

/**
 * BUSCAR DADOS DO PERFIL
 * Aqui eu pego as informações básicas do usuário (nome, objetivo, nível, etc)
 * direto do banco de dados usando o ID que vem do token de login.
 */
router.get('/profile', verifyToken, async (req, res) => {
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

/**
 * REGISTRAR IMC
 * Este bloco recebe o peso e a altura que o usuário enviou,
 * valida se os números fazem sentido e salva no histórico de IMC dele.
 */
router.post('/imc', verifyToken, async (req, res) => {
    const userId = req.user.usuario_id;
    const { peso, altura } = req.body;
    
    if (!peso || !altura) {
        return res.status(400).json({ message: "Peso e altura são obrigatórios." });
    }
    
    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        return res.status(400).json({ message: "Peso e altura devem ser números positivos." });
    }

    try {
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

/**
 * CHECK-IN DE TREINO
 * Serve para marcar que o usuário treinou. Eu salvo qual foi o treino
 * e como ele se sentiu (Intenso, Leve ou Mediano).
 */
router.post('/treino', verifyToken, async (req, res) => {
    const userId = req.user.usuario_id;
    const { treino, status_treino } = req.body;
    
    if (!treino || !status_treino) {
        return res.status(400).json({ message: "Treino e status de treino são obrigatórios." });
    }
    
    const statusValidos = ['Intenso', 'Leve', 'Mediano'];
    if (!statusValidos.includes(status_treino)) {
        return res.status(400).json({ 
            message: `Status inválido. Use: ${statusValidos.join(', ')}` 
        });
    }

    try {
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