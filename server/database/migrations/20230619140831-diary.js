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
    await queryInterface.createTable('diaries', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      first_content: { type: STRING, charset: 'utf8mb4'},
      second_content: { type: STRING, charset: 'utf8mb4'},
      third_content: { type: STRING, charset: 'utf8mb4'},
      img_1_url: STRING,
      img_2_url: STRING,
      img_3_url: STRING,
      user_name: STRING,
      user_id: INTEGER,
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
    await queryInterface.dropTable('diaries');
  }
};
