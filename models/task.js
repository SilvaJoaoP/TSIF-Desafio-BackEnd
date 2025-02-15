const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Em andamento", "Finalizado"),
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
  });
