require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const { sequelize } = require("./models");
const routes = require("./routes/index");

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes); 

const PORT = process.env.PORT || 5000; 

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error("Erro ao sincronizar com o banco:", err));