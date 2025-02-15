"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "Estudo",
          color: "blue",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Trabalho",
          color: "green",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Urgente",
          color: "red",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tags", null, {});
  },
};
