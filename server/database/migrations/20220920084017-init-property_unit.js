'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING, DOUBLE } = Sequelize;
    await queryInterface.createTable('property_units', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      property_name: { type: STRING(255), allowNull: false },
      property_location: STRING,
      floor: INTEGER,
      unit: STRING,
      watch_time: DATE,
      towards: STRING,
      video_link: STRING,
      review_score: DOUBLE,
      feet: DOUBLE,
      price: DOUBLE,
      remarks: STRING,
      ages: STRING,
      outerLink: STRING,
      backupString1: STRING,
      backupString2: STRING,
      created_at: DATE,
      updated_at: DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('property_units');
  }
};
