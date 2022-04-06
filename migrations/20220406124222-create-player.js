'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', //Attention au s
          key: 'id'
        }
      },
      duelId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Duels', //Attention au s
          key: 'id'
        }
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Q1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Q2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Q3: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Q4: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Q5: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Players');
  }
};