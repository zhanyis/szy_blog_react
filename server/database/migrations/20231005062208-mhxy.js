'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING, DOUBLE } = Sequelize;
    await queryInterface.createTable('mhxy_items', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      item_name: STRING,
      type_id: INTEGER,
      price: { type: DOUBLE },
      price_from: { type: INTEGER, comment: '0: 摆摊, 1: 商人' },
      created_at: DATE,
      updated_at: DATE,
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
    await queryInterface.createTable('mhxy_item_types', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      type_name: STRING,
      created_at: DATE,
      updated_at: DATE,
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('mhxy_items');
    await queryInterface.dropTable('mhxy_item_types');
  }
};
