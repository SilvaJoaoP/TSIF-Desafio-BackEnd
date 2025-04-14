"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Tasks",
      [
        {
          title: "Estudar o conteúdo do Bootcamp",
          status: "Finalizado",
          priority: 1,
          description: "Estudar postgresql.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Estudar POO",
          status: "Em andamento",
          priority: 10,
          description: "Entender o que é POO, os usos e exemplos.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Programar o novo SRE",
          status: "Em andamento",
          priority: 1,
          description: "Criar o novo SRE.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tasks", null, {});
  },
};
