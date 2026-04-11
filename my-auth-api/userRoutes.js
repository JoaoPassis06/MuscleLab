
const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const db = require('./db'); 

const router = express.Router();

// Rota de Cadastro
router.post('/register', async (req, res) => {
    const { nome, sobrenome, email, senha, nivel_muscle, objetivo } = req.body;

    if (!nome || !sobrenome || !email || !senha) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const [result] = await db.execute(
            `INSERT INTO usuario (nome, sobrenome, email, senha, nivel_muscle, objetivo) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, sobrenome, email, hashedPassword, nivel_muscle || 'Nenhum', objetivo || 'Nenhum']
        );

        res.status(201).json({ message: "Usuário cadastrado!", usuario_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: "Email já cadastrado." });
        res.status(500).json({ message: "Erro no servidor." });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(senha, user.senha))) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        //payload com o nome exato da sua coluna: usuario_id
        const tokenPayload = { 
            usuario_id: user.usuario_id, 
            email: user.email 
        };
        
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ 
            message: "Login realizado!",
            token: token, 
            user: { 
                usuario_id: user.usuario_id, 
                nome: user.nome 
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erro interno." });
    }
});

module.exports = router;