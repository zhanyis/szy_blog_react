'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING, DOUBLE } = Sequelize;
    await queryInterface.createTable('properties', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      property_name: { type: STRING(255), allowNull: false },
      property_location: STRING,
      watch_time: DATE,
      related_video_link: STRING,
      review_score: DOUBLE,
      two_room_feet: DOUBLE,
      two_room_price_avg: DOUBLE,
      three_room_feet: DOUBLE,
      three_room_price_avg: DOUBLE,
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('property_comments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      property_id: { type: INTEGER, allowNull: false },
      user_id: { type: INTEGER, allowNull: false },
      location_score: DOUBLE,
      investment_value_score: DOUBLE,
      property_facility_score: DOUBLE,
      property_indoor_score: DOUBLE,
      personal_score: DOUBLE,
      remark: STRING,
      created_at: DATE,
      updated_at: DATE,
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('properties');
    await queryInterface.dropTable('property_comments');
  },
};
