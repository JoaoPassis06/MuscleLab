require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * VERIFICAÇÃO DE SEGURANÇA (TOKEN)
 * Aqui eu confiro se quem está tentando acessar a rota está "logado".
 * Eu procuro por um código (token) que deve ser enviado no cabeçalho da requisição.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Acesso negado. Você precisa estar logado." });
    }

    const token = authHeader.split(' ')[1];

    try {
        /**
         * Se o código existir, eu tento "abrir" ele com a minha chave secreta.
         * Se der certo, eu descubro quem é o usuário e libero a passagem para a próxima etapa.
         */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; 

        next();

    } catch (err) {
        /**
         * Se o código estiver errado ou já tiver vencido, eu barro o acesso por aqui mesmo.
         */
        return res.status(403).json({ message: "Sua sessão expirou ou o código de acesso é inválido." });
    }
};

module.exports = verifyToken;