module.exports = app => {
  // 根据批量新增物品
  app.router.post('/mhxyItemBulk', app.controller.mhxyItems.bulkCreate);
};
