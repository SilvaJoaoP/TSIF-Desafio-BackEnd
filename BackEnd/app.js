// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\BackEnd\app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Importe o cors
const { sequelize } = require("./models");
const routes = require("./routes/index");

const app = express();

// Configure o CORS ANTES das rotas
// Isso permite requisições de qualquer origem (bom para desenvolvimento)
// Para produção, configure origens específicas: app.use(cors({ origin: 'http://seu-dominio-frontend.com' }));
app.use(cors());

app.use(express.json());

app.use(routes); // Mantenha as rotas depois do cors e express.json

const PORT = process.env.PORT || 5000; // Use a porta corrigida

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error("Erro ao sincronizar com o banco:", err));