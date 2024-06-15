module.exports = app => {
  // 根据用户token获取相关账单
  app.router.get('/getAllListRelated', app.controller.splitBills.getAllListRelated);
};
