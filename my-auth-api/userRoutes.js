
const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const db = require('./db'); 

const router = express.Router();

/**
 * 📝 Rota de Cadastro: POST /register
 * - Hasheia a senha
 * - Insere o novo usuário na tabela 'usuario'.
 */
router.post('/register', async (req, res) => {
    // Extrai os campos necessários
    const { nome, sobrenome, email, senha, nivel_muscle, objetivo } = req.body;

    // Validação básica (o Frontend também faz, mas o Backend deve garantir)
    if (!nome || !sobrenome || !email || !senha) {
        return res.status(400).json({ message: "Nome, Sobrenome, Email e Senha são obrigatórios." });
    }

    try {
        // 1. Hashear a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // 2. Inserir no banco de dados (usando os campos da sua tabela 'usuario')
        const [result] = await db.execute(
            `INSERT INTO usuario (nome, sobrenome, email, senha, nivel_muscle, objetivo) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, sobrenome, email, hashedPassword, nivel_muscle || 'Nenhum', objetivo || 'Nenhum']
        );

        res.status(201).json({ 
            message: "Usuário cadastrado com sucesso!", 
            usuario_id: result.insertId 
        });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        // Trata erro de email duplicado (ER_DUP_ENTRY)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Este email já está cadastrado." });
        }
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


/**
 * 🔐 Rota de Login: POST /login
 * * Autentica o usuário e GERA o Token JWT.
 */
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Email e Senha são obrigatórios para o login." });
    }

    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );

        const user = rows[0];
        
        // Verifica se o usuário existe e se a senha corresponde ao hash
        if (!user || !(await bcrypt.compare(senha, user.senha))) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        // --- Lógica de Geração do JWT ---
        const tokenPayload = { 
            usuario_id: user.usuario_id, 
            email: user.email 
        };
        
        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Sucesso no Login: Retorna o token para o Frontend
        res.status(200).json({ 
            message: "Login realizado com sucesso!",
            token: token, 
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