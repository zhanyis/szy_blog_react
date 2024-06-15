'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     const { INTEGER, DATE, STRING } = Sequelize;
     await queryInterface.createTable('comments', {
       id: { type: INTEGER, primaryKey: true, autoIncrement: true },
       content: STRING(300),
       user_id: { type: INTEGER },
       created_at: DATE,
       updated_at: DATE,
     });
 
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('comments');
  }
};
