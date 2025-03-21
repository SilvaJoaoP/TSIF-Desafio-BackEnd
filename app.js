const express = require("express");
const { sequelize } = require("./models");
const authRouting = require("./routes/authRouting");
const taskRouting = require("./routes/taskRouting");
const tagRouting = require("./routes/tagRouting");

const app = express();
app.use(express.json());

app.use("/auth", authRouting);
app.use("/tasks", taskRouting);
app.use("/tags", tagRouting);

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
  })
  .catch((err) => console.error("Erro ao sincronizar com o banco:", err));
