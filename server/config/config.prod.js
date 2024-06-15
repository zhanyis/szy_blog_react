'use strict';

exports.sequelize = {
  // dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  password: '123456',
  username: 'MY_DATA_BASE',
  database: 'my_data_base',
  timezone: '+08:00',
  dialectOptions: {
    charset: 'utf8mb4',
    typeCast(field, next) {
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    }
  },
};

exports.security = {
  csrf: {
    enable: true,
  },
};
