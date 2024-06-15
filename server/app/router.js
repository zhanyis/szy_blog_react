'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/wx', controller.home.wx);

  // comments 评论
  router.resources('comments', '/comments', controller.comments);
  // property
  router.resources('property', '/property', controller.property);
  // property_comment
  router.resources('property_comment', '/propertyComment', controller.propertyComment);
  // property_unit
  router.resources('property_unit', '/propertyUnit', controller.propertyUnit);
  // diaries
  router.resources('diaries', '/diaries', controller.diaries);
  // split_bills
  router.resources('splitBills', '/splitBills', controller.splitBills);
  // mhxy_item_types
  router.resources('mhxyItemTypes', '/mhxyItemTypes', controller.mhxyItemTypes);
  // mhxy_item
  router.resources('mhxyItems', '/mhxyItems', controller.mhxyItems);

  require('./router/userRouter')(app);
  require('./router/uploadTestRouter')(app);
  require('./router/wechatComRouter')(app);
  require('./router/diariesRouter')(app);
  require('./router/splitBillsRouter')(app);
  require('./router/mhxyRouter')(app);
};
