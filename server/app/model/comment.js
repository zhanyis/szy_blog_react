'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Commnet = app.model.define('comment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    content: STRING(300),
    user_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
    reply_to_comment_id: INTEGER,
    article_id: INTEGER,
  });

  return Commnet;
};
