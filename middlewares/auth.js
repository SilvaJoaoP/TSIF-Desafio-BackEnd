const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        // Verifica se o header Authorization existe
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido ou inválido' });
        }

        // Extrai o token do header
        const token = authHeader.split(' ')[1];

        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'root');
        
        // Busca o usuário no banco de dados
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Adiciona o usuário ao request para uso posterior
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Erro na autenticação' });
    }
};

module.exports = authMiddleware;