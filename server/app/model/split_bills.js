'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, DOUBLE } = app.Sequelize;

  const Commnet = app.model.define('split_bills', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    payee_id: { type: INTEGER },
    payee_name: STRING,
    amount: { type: DOUBLE },
    share_with_user_id: STRING,
    share_with_user_name: STRING,
    comment: STRING,
    settle_user_id: STRING,
    settle_user_name: STRING,
    is_clearify: { type: INTEGER, comment: '0: 未结算, 1: 已结算' },
    photo_url: { type: STRING },
    date: DATE,
    created_at: DATE,
    updated_at: DATE,
  });

  return Commnet;
};
