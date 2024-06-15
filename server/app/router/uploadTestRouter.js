module.exports = app => {
  // 文件上传
  app.router.post('/upload', app.controller.upload.upload);
  // 测试post方法
  app.router.post('/testPost', app.controller.upload.postTest);
  // 视频播放
  app.router.get('/video', app.controller.upload.getVideo);
  // 视频上传
  app.router.post('/uploadVideo', app.controller.upload.uploadVideo);
  // 账单图片上传
  app.router.post('/uploadBills', app.controller.upload.uploadBills);
};
