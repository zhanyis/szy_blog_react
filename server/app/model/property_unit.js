'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

  const PropertyUnit = app.model.define('property_units', {
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
    ages: { type: STRING, field: 'ages' },
    outerLink: { type: STRING, field: 'outerLink' },
    backupString1: { type: STRING, field: 'backupString1' },
    backupString2: { type: STRING, field: 'backupString2' },
    remarks: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return PropertyUnit;
};
