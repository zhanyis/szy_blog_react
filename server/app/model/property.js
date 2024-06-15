'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

  const Property = app.model.define('property', {
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

  return Property;
};
