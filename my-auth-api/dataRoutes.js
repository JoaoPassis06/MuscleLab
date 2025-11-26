// dataRoutes.js (Exemplo de Rotas Protegidas)
const express = require('express');
const db = require('./db');
const verifyToken = require('./authMiddleware'); // <-- IMPORTAÇÃO DO MIDDLEWARE

const router = express.Router();

/**
 * Rota Protegida: GET /api/data/profile
 * Só será acessível se um token JWT válido for fornecido no cabeçalho.
 */
router.get('/profile', verifyToken, async (req, res) => {
    // O ID do usuário está disponível em req.user.usuario_id graças ao middleware!
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

// Outras rotas protegidas (IMC, CheckTreino) seriam adicionadas aqui...
// router.post('/imc', verifyToken, async (req, res) => { ... });

module.exports = router;