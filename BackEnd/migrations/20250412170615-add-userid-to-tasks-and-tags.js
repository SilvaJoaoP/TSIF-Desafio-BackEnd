'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',  
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    await queryInterface.addColumn('Tags', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',  
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'UserId');
    await queryInterface.removeColumn('Tags', 'UserId');
  }
};