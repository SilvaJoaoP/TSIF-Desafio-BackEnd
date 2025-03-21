const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já registrado' });
        }

        // Cria hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Cria novo usuário
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Gera token JWT
        const token = jwt.sign(
            { id: user.id },  // Apenas o ID para compatibilidade com o middleware auth.js
            process.env.JWT_SECRET || 'root',
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca usuário
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verifica senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gera token JWT
        const token = jwt.sign(
            { id: user.id },  // Mantém apenas o ID para compatibilidade com o middleware
            process.env.JWT_SECRET || 'root',
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para verificar se o token é válido
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'root');
        
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.json({ 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        res.status(500).json({ error: 'Erro ao verificar token' });
    }
});

module.exports = router;