module.exports = app => {
  // users
  app.router.post('/user/register', app.controller.user.register);
  app.router.post('/user/login', app.controller.user.login);
  app.router.get('/checkLogin', app.controller.user.checkLogin);
  app.router.get('/allUserList', app.controller.user.allUserList);
};
