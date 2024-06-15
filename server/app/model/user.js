'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('users', {
    user_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_name: STRING(20),
    user_password: STRING,
    user_avatar_url: STRING(255),
    user_auth_type: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });

  return User;
};
