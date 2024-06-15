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
    await queryInterface.createTable('split_bills', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      payee_id: { type: INTEGER },
      payee_name: STRING,
      amount: { type: DOUBLE },
      comment: STRING,
      share_with_user_id: STRING,
      share_with_user_name: STRING,
      settle_user_id: STRING,
      settle_user_name: STRING,
      is_clearify: { type: INTEGER, comment: '0: 未结算, 1: 已结算' },
      photo_url: { type: STRING },
      date: DATE,
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
    await queryInterface.dropTable('split_bills');
  }
};
