// userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); // <-- NOVA IMPORTAÇÃO
const db = require('./db'); 

const router = express.Router();

// ... (Rota /register permanece a mesma) ...

/**
 * 🔐 Rota de Login: POST /api/users/login
 * * Autentica o usuário e GERA o Token JWT.
 */
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;


    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );

        const user = rows[0];
        if (!user || !(await bcrypt.compare(senha, user.senha))) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        // --- Lógica de Geração do JWT ---
        
        // 1. O 'payload' (carga) do token
        const tokenPayload = { 
            usuario_id: user.usuario_id, 
            email: user.email 
        };
        
        // 2. Assina o token
        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET, // Sua chave secreta
            { expiresIn: '1d' } // Expira em 1 dia (tempo de vida)
        );

        // 3. Sucesso no Login: Retorna o token para o Frontend
        res.status(200).json({ 
            message: "Login realizado com sucesso!",
            token: token, // <-- O Token que o Frontend deve guardar
            user: { 
                usuario_id: user.usuario_id, 
                nome: user.nome,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

module.exports = router;