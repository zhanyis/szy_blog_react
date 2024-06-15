/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1658579353488_3553';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: 'http://localhost:5173',
    credentials: true, // 开启认证
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.multipart = {
    mode: 'file',
    fileExtensions: [ '.txt', '.pdf', '.md', '.png', '.MOV' ],
    fileSize: '1000mb',
  };

  // config.sequelize = {
  //   dialect: 'mysql',
  //   host: '127.0.0.1',
  //   port: 3306,
  //   username: 'root',
  //   password: '123456',
  //   database: 'test_data_base',
  // };

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test_data_base',
    password: '123456',
    database: 'test_data_base',
    timezone: '+08:00',
    dialectOptions: {
      charset: 'utf8mb4',
    },
  };

  config.jwt = {
    secret: '654321',
    expiresIn: '30d',
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  config.static = {
    // 静态化访问前缀,如：`http://127.0.0.1:7001/static/images/logo.png`
    // prefix: '/static/',
    // // dir: path.join(appInfo.baseDir, 'app/public'), // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
    // dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
    // preload: false,
    // maxAge: 31536000, // in prod env, 0 in other envs
    // buffer: true, // in prod env, false in other envs
  };

  return {
    ...config,
    ...userConfig,
  };
};
