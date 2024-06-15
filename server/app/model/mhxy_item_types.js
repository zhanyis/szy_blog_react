'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;

  const MhxyItemTypes = app.model.define('mhxy_item_types', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    type_name: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return MhxyItemTypes;
};
