'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Commnet = app.model.define('diaries', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
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
  });

  return Commnet;
};
