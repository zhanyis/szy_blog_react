module.exports = app => {
  // app.router.get('/getAccessToken', app.controller.wechatCom.getAccessToken);
  app.router.get('/sendWechatComMessageTest', app.controller.wechatCom.sendMessage);
  app.router.post('/sendWechatComMessage', app.controller.wechatCom.sendMessagePost);
};
