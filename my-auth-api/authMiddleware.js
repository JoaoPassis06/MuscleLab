const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verifica se o header existe e segue o padrão "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido ou formato inválido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifica o token usando a chave do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; 
        
        next();
    } catch (err) {
        console.error("Erro JWT:", err.message);
        return res.status(403).json({ message: 'Sessão inválida ou expirada. Faça login novamente.' });
    }
};