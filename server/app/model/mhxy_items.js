'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, DOUBLE } = app.Sequelize;

  const MhxyItems = app.model.define('mhxy_items', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    item_name: STRING,
    type_id: INTEGER,
    price: { type: DOUBLE },
    price_from: { type: INTEGER, comment: '0: 摆摊, 1: 商人' },
    created_at: DATE,
    updated_at: DATE,
  });

  return MhxyItems;
};
