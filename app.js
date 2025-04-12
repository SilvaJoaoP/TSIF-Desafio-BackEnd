require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const routes = require("./routes/index");

const app = express();
app.use(express.json());

app.use(routes);

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
  })
  .catch((err) => console.error("Erro ao sincronizar com o banco:", err));
