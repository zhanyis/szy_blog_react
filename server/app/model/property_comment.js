'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

  const PropertyComment = app.model.define('property_comment', {
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

  PropertyComment.associate = function() {
    app.model.PropertyComment.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'user_id' });
  };

  return PropertyComment;
};
