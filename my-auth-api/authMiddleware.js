// authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar o Token JWT
 */
const verifyToken = (req, res, next) => {
    // 1. Tenta obter o token do cabeçalho 'Authorization' (padrão 'Bearer <token>')
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido ou formato inválido." });
    }

    // 2. Extrai o token removendo "Bearer "
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verifica e decodifica o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Adiciona o payload do usuário (ID e Email) ao objeto de requisição
        req.user = decoded; 

        // 5. Continua para a próxima função (a rota protegida)
        next();

    } catch (err) {
        // Erro se o token for inválido, expirado, ou a assinatura não coincidir
        return res.status(403).json({ message: "Token inválido ou expirado." });
    }
};

module.exports = verifyToken;